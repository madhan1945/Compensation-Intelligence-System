import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { apiError } from "../../../lib/api-utils";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        salaryEntries: {
          select: {
            totalComp: true,
            jobTitle: true,
          },
        },
      },
    });

    const data = companies.map((c) => {
      const entries = c.salaryEntries;
      const count = entries.length;

      if (count === 0) {
        return {
          id: c.id,
          name: c.canonicalName,
          slug: c.slug,
          _count: { salaryEntries: 0 },
          avgTotalComp: 0,
          medianTotalComp: 0,
          topRoles: [] as string[],
        };
      }

      const tcs = entries.map((e) => e.totalComp).sort((a, b) => a - b);
      const avgTotalComp = tcs.reduce((sum, val) => sum + val, 0) / count;

      let medianTotalComp = 0;
      const mid = Math.floor(count / 2);
      if (count % 2 === 0) {
        medianTotalComp = (tcs[mid - 1] + tcs[mid]) / 2;
      } else {
        medianTotalComp = tcs[mid];
      }

      // Count job titles to find top roles
      const roleCounts: Record<string, number> = {};
      entries.forEach((e) => {
        roleCounts[e.jobTitle] = (roleCounts[e.jobTitle] || 0) + 1;
      });

      const topRoles = Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([role]) => role);

      return {
        id: c.id,
        name: c.canonicalName,
        slug: c.slug,
        _count: { salaryEntries: count },
        avgTotalComp: Math.round(avgTotalComp),
        medianTotalComp: Math.round(medianTotalComp),
        topRoles,
      };
    });

    // Sort by entry count descending
    data.sort((a, b) => b._count.salaryEntries - a._count.salaryEntries);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/companies failed:", error);
    return apiError("Failed to fetch companies", 500);
  }
}
