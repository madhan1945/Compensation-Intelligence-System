import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { TCDisplay } from "@/components/ui/TCDisplay";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/tc-calculator";
import { ArrowLeft, Building2, MapPin, Calendar, CheckCircle, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic"; // Render detail page dynamically on demand

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SalaryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const entry = await prisma.salaryEntry.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          name: true,
          canonicalName: true,
          slug: true,
          logoUrl: true,
          industry: true,
        },
      },
    },
  });

  if (!entry) {
    notFound();
  }

  const stockPerYear = entry.stockValue / entry.vestingYears;
  const currency = entry.currency;

  // Percentages for visual breakdown
  const total = entry.baseSalary + entry.annualBonus + stockPerYear;
  const basePct = total > 0 ? (entry.baseSalary / total) * 100 : 0;
  const bonusPct = total > 0 ? (entry.annualBonus / total) * 100 : 0;
  const stockPct = total > 0 ? (stockPerYear / total) * 100 : 0;

  return (
    <>
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Back Button */}
          <Link
            href="/salaries"
            className="flex items-center space-x-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all salaries</span>
          </Link>

          {/* Core Info Header */}
          <div className="rounded-xl border border-bg-border bg-bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-bg-elevated border border-bg-border rounded-lg flex items-center justify-center overflow-hidden">
                  {entry.company.logoUrl ? (
                    <img
                      src={entry.company.logoUrl}
                      alt={entry.company.canonicalName}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-text-secondary" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-text-primary">{entry.jobTitle}</h1>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-text-secondary">
                    <Link
                      href={`/company/${entry.company.slug}`}
                      className="font-bold text-accent-blue hover:underline"
                    >
                      {entry.company.canonicalName}
                    </Link>
                    <span>•</span>
                    <Badge level={entry.level} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Total Compensation
                </div>
                <div className="mt-0.5">
                  <TCDisplay value={entry.totalComp} currency={currency} isLarge />
                </div>
              </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-4 border-t border-bg-border/60 text-sm">
              <div>
                <span className="block text-text-muted font-medium">Location</span>
                <span className="text-text-primary font-semibold flex items-center space-x-1 mt-0.5">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  <span>
                    {entry.city}
                    {entry.remote ? " (Remote)" : ""}
                  </span>
                </span>
              </div>
              <div>
                <span className="block text-text-muted font-medium">Experience</span>
                <span className="text-text-primary font-semibold mt-0.5 block">
                  {entry.yearsOfExp} years
                </span>
              </div>
              <div>
                <span className="block text-text-muted font-medium">Verification</span>
                <span className="text-text-primary font-semibold flex items-center space-x-1 mt-0.5">
                  {entry.verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-accent-green" />
                      <span className="text-accent-green">Verified</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4 text-text-muted" />
                      <span className="text-text-secondary">Self-reported</span>
                    </>
                  )}
                </span>
              </div>
              <div>
                <span className="block text-text-muted font-medium">Submitted At</span>
                <span className="text-text-primary font-semibold flex items-center space-x-1 mt-0.5">
                  <Calendar className="h-4 w-4 text-text-muted" />
                  <span>
                    {new Date(entry.submittedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Compensation Component Breakdown */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Detailed Values */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-text-primary">Compensation Components</h2>

              <div className="space-y-3 font-mono text-sm">
                {/* Base */}
                <div className="flex justify-between items-center py-2 border-b border-bg-border/50">
                  <span className="text-text-secondary font-sans font-medium">Base Salary</span>
                  <span className="text-text-primary font-semibold">
                    {formatCurrency(entry.baseSalary, currency)}
                  </span>
                </div>

                {/* Bonus */}
                <div className="flex justify-between items-center py-2 border-b border-bg-border/50">
                  <span className="text-text-secondary font-sans font-medium">Annual Bonus</span>
                  <span className="text-text-primary font-semibold">
                    {entry.annualBonus > 0 ? formatCurrency(entry.annualBonus, currency) : "—"}
                  </span>
                </div>

                {/* Stock per year */}
                <div className="flex justify-between items-center py-2 border-b border-bg-border/50">
                  <span className="text-text-secondary font-sans font-medium">
                    Stock Grant (Per Year)
                  </span>
                  <span className="text-text-primary font-semibold">
                    {entry.stockValue > 0
                      ? `${formatCurrency(stockPerYear, currency)}`
                      : "—"}
                  </span>
                </div>

                {/* Signing Bonus */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-secondary font-sans font-medium">Signing Bonus</span>
                  <span className="text-text-primary font-semibold">
                    {entry.signingBonus > 0 ? formatCurrency(entry.signingBonus, currency) : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Progress Bars */}
            <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm flex flex-col justify-between">
              <h2 className="text-base font-bold text-text-primary">Annualized Breakdown</h2>

              <div className="space-y-4 my-auto">
                {/* Base Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Base Salary</span>
                    <span className="text-text-primary">{basePct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent-blue h-full rounded-full"
                      style={{ width: `${basePct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bonus Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Annual Bonus</span>
                    <span className="text-text-primary">{bonusPct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent-green h-full rounded-full"
                      style={{ width: `${bonusPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stock Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Equity (Stock/RSUs)</span>
                    <span className="text-text-primary">{stockPct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-bg-border h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent-gold h-full rounded-full"
                      style={{ width: `${stockPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
