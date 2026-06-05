import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      return apiError("Company not found", 404);
    }

    const allEntries = await prisma.salaryEntry.findMany({
      where: { companyId: company.id },
    });

    const recentEntries = await prisma.salaryEntry.findMany({
      where: { companyId: company.id },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    const totalEntries = allEntries.length;

    if (totalEntries === 0) {
      return NextResponse.json({
        company,
        stats: {
          totalEntries: 0,
          avgTotalComp: 0,
          medianTotalComp: 0,
          avgBase: 0,
          levelDistribution: [],
          cityDistribution: [],
          tcByYoe: [],
        },
        recentEntries: [],
      });
    }

    // Averages and Medians
    const bases = allEntries.map((e) => e.baseSalary);
    const tcs = allEntries.map((e) => e.totalComp).sort((a, b) => a - b);

    const avgTotalComp = tcs.reduce((sum, val) => sum + val, 0) / totalEntries;
    const avgBase = bases.reduce((sum, val) => sum + val, 0) / totalEntries;

    let medianTotalComp = 0;
    const mid = Math.floor(totalEntries / 2);
    if (totalEntries % 2 === 0) {
      medianTotalComp = (tcs[mid - 1] + tcs[mid]) / 2;
    } else {
      medianTotalComp = tcs[mid];
    }

    // Level distribution
    const levelGroups: Record<string, { count: number; sumTc: number }> = {};
    allEntries.forEach((e) => {
      if (!levelGroups[e.level]) {
        levelGroups[e.level] = { count: 0, sumTc: 0 };
      }
      levelGroups[e.level].count += 1;
      levelGroups[e.level].sumTc += e.totalComp;
    });

    const levelDistribution = Object.entries(levelGroups).map(([level, g]) => ({
      level,
      count: g.count,
      avgTc: Math.round(g.sumTc / g.count),
    }));

    // City distribution
    const cityGroups: Record<string, number> = {};
    allEntries.forEach((e) => {
      cityGroups[e.city] = (cityGroups[e.city] || 0) + 1;
    });

    const cityDistribution = Object.entries(cityGroups)
      .map(([city, count]) => ({
        city,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // TC by YoE distribution
    const yoeGroups: Record<number, { count: number; sumTc: number }> = {};
    allEntries.forEach((e) => {
      if (!yoeGroups[e.yearsOfExp]) {
        yoeGroups[e.yearsOfExp] = { count: 0, sumTc: 0 };
      }
      yoeGroups[e.yearsOfExp].count += 1;
      yoeGroups[e.yearsOfExp].sumTc += e.totalComp;
    });

    const tcByYoe = Object.entries(yoeGroups)
      .map(([yoeStr, g]) => ({
        yearsOfExp: parseInt(yoeStr, 10),
        avgTc: Math.round(g.sumTc / g.count),
      }))
      .sort((a, b) => a.yearsOfExp - b.yearsOfExp);

    return NextResponse.json({
      company,
      stats: {
        totalEntries,
        avgTotalComp: Math.round(avgTotalComp),
        medianTotalComp: Math.round(medianTotalComp),
        avgBase: Math.round(avgBase),
        levelDistribution,
        cityDistribution,
        tcByYoe,
      },
      recentEntries,
    });
  } catch (error) {
    console.error("GET /api/companies/[slug] failed:", error);
    return apiError("Internal server error", 500);
  }
}
