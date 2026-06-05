import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompanyCharts from "@/components/company/CompanyCharts";
import SalaryTable from "@/components/salary/SalaryTable";
import { prisma } from "@/lib/prisma";
import { TCDisplay } from "@/components/ui/TCDisplay";
import { formatCurrency } from "@/lib/tc-calculator";
import { ArrowLeft, Building2, MapPin, Briefcase, IndianRupee } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic"; // Render profile dynamically on demand

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { canonicalName: true },
  });

  if (!company) {
    return {
      title: "Company Salaries | CompensationIQ",
    };
  }

  const entriesCount = await prisma.salaryEntry.count({
    where: { company: { slug } },
  });

  return {
    title: `${company.canonicalName} Salaries & Compensation | CompensationIQ`,
    description: `Browse ${entriesCount} salary and total compensation entries for ${company.canonicalName}. Explore averages by engineering levels and years of experience.`,
  };
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch company
  const company = await prisma.company.findUnique({
    where: { slug },
  });

  if (!company) {
    notFound();
  }

  // Fetch all entries for calculations
  const allEntries = await prisma.salaryEntry.findMany({
    where: { companyId: company.id },
  });

  // Fetch recent 10 entries for table
  const recentEntries = await prisma.salaryEntry.findMany({
    where: { companyId: company.id },
    orderBy: { submittedAt: "desc" },
    take: 10,
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
  });

  const totalEntries = allEntries.length;

  // Handle zero submissions edge case
  if (totalEntries === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
          <div className="mx-auto max-w-7xl space-y-6">
            <Link
              href="/salaries"
              className="flex items-center space-x-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all salaries</span>
            </Link>

            <div className="rounded-xl border border-bg-border bg-bg-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-bg-elevated border border-bg-border rounded-lg flex items-center justify-center font-bold text-lg text-text-secondary">
                  {company.canonicalName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-text-primary">
                    {company.canonicalName}
                  </h1>
                  <p className="text-sm text-text-secondary">
                    {company.industry || "Technology"} • {company.headquarters || "India"}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-text-muted">0 entries contributed</span>
              </div>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-card p-12 text-center">
              <h3 className="text-lg font-bold text-text-primary mb-2">No salary entries yet</h3>
              <p className="text-sm text-text-secondary mb-6">
                Be the first to contribute a salary entry for {company.canonicalName}!
              </p>
              <Link
                href="/submit"
                className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-text-primary hover:bg-blue-600 transition-colors inline-block"
              >
                Submit Salary
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Perform aggregations
  const currency = allEntries[0]?.currency || "INR";
  const bases = allEntries.map((e) => e.baseSalary);
  const tcs = allEntries.map((e) => e.totalComp).sort((a, b) => a - b);

  const avgTotalComp = tcs.reduce((sum, val) => sum + val, 0) / totalEntries;
  const avgBase = bases.reduce((sum, val) => sum + val, 0) / totalEntries;
  const avgBonus = allEntries.reduce((sum, val) => sum + val.annualBonus, 0) / totalEntries;
  const avgStock = allEntries.reduce((sum, val) => sum + val.stockValue / val.vestingYears, 0) / totalEntries;

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

  return (
    <>
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Back button */}
          <Link
            href="/salaries"
            className="flex items-center space-x-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all salaries</span>
          </Link>

          {/* Profile Header */}
          <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-bg-elevated border border-bg-border rounded-lg flex items-center justify-center overflow-hidden">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.canonicalName}
                    onError={(e) => {
                      // Fallback if Clearbit logo fails
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-text-secondary" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                  {company.canonicalName}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-text-secondary">
                  <span className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4 text-text-muted" />
                    <span>{company.industry || "Software & Services"}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span>{company.headquarters || "India"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Avg Total Comp
              </div>
              <div className="mt-0.5">
                <TCDisplay value={avgTotalComp} currency={currency} isLarge />
              </div>
              <div className="text-xs text-text-secondary mt-1">
                Based on {totalEntries} submissions
              </div>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Median TC */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Median TC
              </div>
              <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-accent-gold">
                {formatCurrency(medianTotalComp, currency)}
              </div>
            </div>

            {/* Avg Base */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Avg Base Salary
              </div>
              <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-text-primary">
                {formatCurrency(avgBase, currency)}
              </div>
            </div>

            {/* Avg Bonus */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Avg Annual Bonus
              </div>
              <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-text-primary">
                {avgBonus > 0 ? formatCurrency(avgBonus, currency) : "—"}
              </div>
            </div>

            {/* Avg Stock */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Avg Equity (Per Yr)
              </div>
              <div className="mt-2 font-mono text-xl sm:text-2xl font-extrabold text-text-primary">
                {avgStock > 0 ? formatCurrency(avgStock, currency) : "—"}
              </div>
            </div>
          </div>

          {/* Charts component */}
          <CompanyCharts
            levelDistribution={levelDistribution}
            tcByYoe={tcByYoe}
            cityDistribution={cityDistribution}
            currency={currency}
          />

          {/* Recent entries table */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-text-primary">Recent Submissions</h2>
              <p className="text-sm text-text-secondary">
                The latest salary entries contributed for {company.canonicalName}.
              </p>
            </div>
            <SalaryTable
              data={recentEntries}
              loading={false}
              pagination={{ page: 1, limit: 10, total: totalEntries, totalPages: 1 }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
