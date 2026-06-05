import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SalaryFilterSchema, SalarySubmissionSchema } from "@/lib/validations";
import { normalizeCompanyName, normalizeCity, toSlug } from "@/lib/normalize";
import { calculateTotalComp } from "@/lib/tc-calculator";
import { apiError, handleZodError } from "@/lib/api-utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Rate limiting: Map<ip, { count: number, resetAt: number }>
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

function sanitize(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, "") // prevent basic HTML injection
    .slice(0, 500); // hard length cap
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });

    const parsed = SalaryFilterSchema.safeParse(paramsObj);
    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const filters = parsed.data;
    const where: any = {};

    if (filters.company) {
      where.company = {
        canonicalName: { contains: filters.company, mode: "insensitive" },
      };
    }

    if (filters.jobTitle) {
      where.jobTitle = { contains: filters.jobTitle, mode: "insensitive" };
    }

    if (filters.level) {
      where.level = { contains: filters.level, mode: "insensitive" };
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }

    // Years of Experience filter
    if (filters.minYoe !== undefined || filters.maxYoe !== undefined) {
      where.yearsOfExp = {};
      if (filters.minYoe !== undefined) where.yearsOfExp.gte = filters.minYoe;
      if (filters.maxYoe !== undefined) where.yearsOfExp.lte = filters.maxYoe;
    }

    // Total Comp filter
    if (filters.minTc !== undefined || filters.maxTc !== undefined) {
      where.totalComp = {};
      if (filters.minTc !== undefined) where.totalComp.gte = filters.minTc;
      if (filters.maxTc !== undefined) where.totalComp.lte = filters.maxTc;
    }

    if (filters.currency) {
      where.currency = filters.currency;
    }

    const page = filters.page;
    const limit = Math.min(filters.limit, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.salaryEntry.findMany({
        where,
        include: {
          company: {
            select: {
              name: true,
              canonicalName: true,
              slug: true,
              logoUrl: true,
            },
          },
        },
        orderBy: {
          [filters.sortBy]: filters.sortDir,
        },
        skip,
        take: limit,
      }),
      prisma.salaryEntry.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/salaries failed:", error);
    return apiError("Failed to fetch salaries", 500);
  }
}

export async function POST(req: Request) {
  // Rate limiter
  const ip = getClientIp(req);
  const now = Date.now();
  const limitInfo = rateLimits.get(ip);

  if (limitInfo && now < limitInfo.resetAt) {
    if (limitInfo.count >= 5) {
      return apiError("Too many submissions. Try again later.", 429);
    }
    limitInfo.count += 1;
  } else {
    rateLimits.set(ip, { count: 1, resetAt: now + 3600 * 1000 }); // 1 hour reset
  }

  try {
    const body = await req.json();
    const parsed = SalarySubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const input = parsed.data;

    // Data integrity validation guards
    if (input.baseSalary > 10000000000) {
      return apiError("Base salary must be positive and plausible", 400);
    }
    if (input.yearsOfExp > 50) {
      return apiError("Years of experience cannot exceed 50", 400);
    }

    // Adjusting parameters safely
    const baseSalary = input.baseSalary;
    const annualBonus = input.annualBonus < 0 ? 0 : input.annualBonus;
    const signingBonus = input.signingBonus < 0 ? 0 : input.signingBonus;
    const stockValue = input.stockValue < 0 ? 0 : input.stockValue;
    const vestingYears = input.vestingYears <= 0 ? 4 : input.vestingYears;
    const currency = ["INR", "USD"].includes(input.currency) ? input.currency : "INR";

    // Sanitization
    const cleanCompanyName = sanitize(input.companyName);
    const cleanJobTitle = sanitize(input.jobTitle);
    const cleanCity = sanitize(input.city);
    const cleanDepartment = input.department ? sanitize(input.department) : undefined;
    const cleanLevel = sanitize(input.level);

    // Calculate total compensation
    const totalComp = calculateTotalComp({
      baseSalary,
      annualBonus,
      signingBonus,
      stockValue,
      vestingYears,
    });

    // Check authentication
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    const canonicalName = normalizeCompanyName(cleanCompanyName);
    const slug = toSlug(canonicalName);

    // Upsert company
    let company = await prisma.company.findFirst({
      where: { canonicalName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: cleanCompanyName,
          canonicalName,
          slug,
          logoUrl: `https://logo.clearbit.com/${slug}.com`,
        },
      });
    }

    // Create entry
    const entry = await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        submittedById: userId,
        jobTitle: cleanJobTitle,
        level: cleanLevel,
        department: cleanDepartment,
        yearsOfExp: input.yearsOfExp,
        city: normalizeCity(cleanCity),
        country: input.country,
        remote: input.remote,
        currency,
        baseSalary,
        annualBonus,
        signingBonus,
        stockValue,
        vestingYears,
        totalComp,
        anonymous: input.anonymous,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/salaries failed:", error);
    return apiError("Internal server error", 500);
  }
}
