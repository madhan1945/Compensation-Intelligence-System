import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/layout/SearchBar";
import SalaryTable from "@/components/salary/SalaryTable";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Building2, MapPin, NotebookPen } from "lucide-react";

export const dynamic = "force-dynamic"; // Render page on demand to show real-time stats

export default async function HomePage() {
  // Direct database aggregates for statistics
  const [totalEntries, totalCompanies, distinctCities] = await Promise.all([
    prisma.salaryEntry.count(),
    prisma.company.count(),
    prisma.salaryEntry.groupBy({
      by: ["city"],
      _count: true,
    }),
  ]);

  const totalCities = distinctCities.length;

  // Fetch last 10 entries
  const recentEntries = await prisma.salaryEntry.findMany({
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

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bg-primary">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-bg-border/60">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text-primary">
              Real compensation data. <br />
              <span className="text-accent-blue">No fluff.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg sm:text-xl text-text-secondary">
              Discover what companies are actually paying. Enforced levels, detailed total compensation breakdowns, and comparisons.
            </p>

            <div className="pt-6">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-bg-card/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Stat 1 */}
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-accent-blue/10 text-accent-blue">
                  <NotebookPen className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-text-primary">
                    {totalEntries}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Salary Entries
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-accent-gold/10 text-accent-gold">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-text-primary">
                    {totalCompanies}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Companies Tracked
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-accent-green/10 text-accent-green">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-text-primary">
                    {totalCities}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Cities Covered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Submissions */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-text-primary">Recent Submissions</h2>
                <p className="text-sm text-text-secondary">
                  The latest anonymous compensation entries contributed by the community.
                </p>
              </div>
              <Link
                href="/salaries"
                className="flex items-center space-x-1 text-sm font-semibold text-accent-blue hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>View All Salaries</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4">
              <Suspense fallback={<div className="animate-pulse bg-bg-card border border-bg-border rounded-xl h-48 w-full"></div>}>
                <SalaryTable
                  data={recentEntries}
                  loading={false}
                  pagination={{ page: 1, limit: 10, total: 10, totalPages: 1 }}
                />
              </Suspense>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-bg-border bg-gradient-to-r from-bg-card to-bg-elevated/45 p-8 text-center sm:p-10 space-y-4">
              <h3 className="text-xl font-bold text-text-primary">Contributed to the community?</h3>
              <p className="mx-auto max-w-lg text-sm text-text-secondary">
                Submit your salary data anonymously in under 2 minutes. Your data helps other professionals negotiate fair pay.
              </p>
              <div className="pt-2">
                <Link
                  href="/submit"
                  className="rounded-md bg-accent-blue px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-blue-600 transition-colors inline-block"
                >
                  Submit Your Salary Anonymously
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
