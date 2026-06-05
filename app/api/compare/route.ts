import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyIds } = body as { companyIds?: string[] };

    if (!companyIds || !Array.isArray(companyIds)) {
      return apiError("Compare requires a companyIds array", 400);
    }

    // Deduplicate IDs
    const uniqueIds = Array.from(new Set(companyIds));

    if (uniqueIds.length < 2 || uniqueIds.length > 3) {
      return apiError("Compare requires 2–3 companies", 400);
    }

    const comparisonData = await Promise.all(
      uniqueIds.map(async (companyId) => {
        const company = await prisma.company.findUnique({
          where: { id: companyId },
        });

        if (!company) {
          return null;
        }

        const entries = await prisma.salaryEntry.findMany({
          where: { companyId },
        });

        const sampleSize = entries.length;

        if (sampleSize === 0) {
          return {
            company: { id: company.id, name: company.canonicalName, slug: company.slug },
            avgTotalComp: 0,
            medianTotalComp: 0,
            avgBase: 0,
            avgBonus: 0,
            avgStock: 0,
            levelBreakdown: [],
            topRoles: [],
            sampleSize: 0,
          };
        }

        // Calculate general averages
        const tcs = entries.map((e) => e.totalComp).sort((a, b) => a - b);
        const avgTotalComp = tcs.reduce((sum, val) => sum + val, 0) / sampleSize;
        const avgBase = entries.reduce((sum, val) => sum + val.baseSalary, 0) / sampleSize;
        const avgBonus = entries.reduce((sum, val) => sum + val.annualBonus, 0) / sampleSize;
        const avgStock = entries.reduce((sum, val) => sum + val.stockValue / val.vestingYears, 0) / sampleSize;

        let medianTotalComp = 0;
        const mid = Math.floor(sampleSize / 2);
        if (sampleSize % 2 === 0) {
          medianTotalComp = (tcs[mid - 1] + tcs[mid]) / 2;
        } else {
          medianTotalComp = tcs[mid];
        }

        // Level breakdown
        const levelMap: Record<string, { sumTc: number; count: number }> = {};
        entries.forEach((e) => {
          if (!levelMap[e.level]) {
            levelMap[e.level] = { sumTc: 0, count: 0 };
          }
          levelMap[e.level].sumTc += e.totalComp;
          levelMap[e.level].count += 1;
        });

        const levelBreakdown = Object.entries(levelMap).map(([level, g]) => ({
          level,
          avgTc: Math.round(g.sumTc / g.count),
          count: g.count,
        }));

        // Role breakdown
        const roleMap: Record<string, { sumTc: number; count: number }> = {};
        entries.forEach((e) => {
          if (!roleMap[e.jobTitle]) {
            roleMap[e.jobTitle] = { sumTc: 0, count: 0 };
          }
          roleMap[e.jobTitle].sumTc += e.totalComp;
          roleMap[e.jobTitle].count += 1;
        });

        const topRoles = Object.entries(roleMap)
          .map(([title, g]) => ({
            title,
            avgTc: Math.round(g.sumTc / g.count),
            count: g.count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        return {
          company: { id: company.id, name: company.canonicalName, slug: company.slug },
          avgTotalComp: Math.round(avgTotalComp),
          medianTotalComp: Math.round(medianTotalComp),
          avgBase: Math.round(avgBase),
          avgBonus: Math.round(avgBonus),
          avgStock: Math.round(avgStock),
          levelBreakdown,
          topRoles,
          sampleSize,
        };
      })
    );

    // Filter out null values (if any companyId didn't match a real company)
    const result = comparisonData.filter((item) => item !== null);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/compare failed:", error);
    return apiError("Internal server error", 500);
  }
}
