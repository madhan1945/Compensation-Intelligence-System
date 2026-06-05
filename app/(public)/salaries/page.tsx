import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SalaryFilters from "@/components/salary/SalaryFilters";
import SalaryTable from "@/components/salary/SalaryTable";
import { prisma } from "@/lib/prisma";
import { SalaryFilterSchema } from "@/lib/validations";

export const revalidate = 0; // Dynamic server-rendered page

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;

  // Validate parameters with Zod
  const parsed = SalaryFilterSchema.safeParse(rawParams);
  const filters = parsed.success ? parsed.data : {
    page: 1,
    limit: 20,
    sortBy: "totalComp" as const,
    sortDir: "desc" as const,
  };

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

  // DB queries
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

  const pagination = {
    page,
    limit,
    total,
    totalPages,
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Software Engineer Salaries
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Browse, filter, and sort salary submissions by company, level, and location.
            </p>
          </div>

          <SalaryFilters />

          <SalaryTable data={data} loading={false} pagination={pagination} />
        </div>
      </main>
      <Footer />
    </>
  );
}
