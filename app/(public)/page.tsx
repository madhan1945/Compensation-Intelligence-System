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
        <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-bg-border/60">
          {/* Decorative Grid & Ambient Glows */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-10 left-1/3 w-[300px] h-[300px] rounded-full bg-accent-green/5 blur-[100px] pointer-events-none"></div>

          <div className="mx-auto max-w-4xl space-y-6 relative z-10">
            {/* Live Indicator Badge */}
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider text-accent-blue bg-accent-blue/10 px-3.5 py-1.5 rounded-full uppercase border border-accent-blue/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
              <span>Real-Time Compensation Database</span>
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text-primary leading-tight">
              Uncover Your True Market Value. <br />
              <span className="bg-gradient-to-r from-accent-blue via-accent-green to-accent-gold bg-clip-text text-transparent">No secrets. No fluff.</span>
            </h1>
            <p className="mx-auto max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed">
              Discover what companies are actually paying. Enforced levels, detailed total compensation breakdowns, and side-by-side comparisons.
            </p>

            <div className="pt-4 max-w-xl mx-auto">
              <SearchBar />
            </div>

            {/* Interactive Mockup Preview */}
            <div className="mt-14 mx-auto max-w-3xl rounded-2xl border border-bg-border bg-bg-card/40 backdrop-blur-md p-6 shadow-2xl relative group overflow-hidden transition-all duration-500 hover:border-accent-blue/20">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center justify-between border-b border-bg-border/60 pb-3.5 mb-5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-red/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-gold/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-green/60"></span>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase">Salary Analytics (Interactive Preview)</span>
                <span className="w-4.5 h-4.5 rounded-full bg-bg-elevated/85 border border-bg-border/40 flex items-center justify-center text-[9px] font-bold text-text-secondary">?</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Left side of preview: Company comparison bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-secondary">Software Engineer (L4/L5 equivalent)</span>
                    <span className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded uppercase border border-accent-blue/20">TC Comparison</span>
                  </div>
                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-text-primary">Google (L4)</span>
                        <span className="text-accent-green font-mono">₹34,50,000<span className="text-[10px] text-text-secondary font-normal font-sans ml-0.5">/yr</span></span>
                      </div>
                      <div className="w-full bg-bg-border/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-blue to-accent-green h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-text-primary">Microsoft (62)</span>
                        <span className="text-text-secondary font-mono">₹28,20,000<span className="text-[10px] text-text-muted font-normal font-sans ml-0.5">/yr</span></span>
                      </div>
                      <div className="w-full bg-bg-border/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-bg-elevated h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-text-primary">Amazon (L5)</span>
                        <span className="text-text-secondary font-mono">₹31,00,000<span className="text-[10px] text-text-muted font-normal font-sans ml-0.5">/yr</span></span>
                      </div>
                      <div className="w-full bg-bg-border/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-bg-elevated h-full rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Key Insights */}
                <div className="bg-bg-elevated/35 rounded-xl p-4.5 border border-bg-border/60 flex flex-col justify-between hover:border-accent-blue/15 transition-colors duration-300">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider bg-accent-gold/10 px-2.5 py-0.5 rounded border border-accent-gold/15">Negotiation TIP</span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Google L4 base salaries in India center around **₹22-24L**. Focus negotiating on stock grants/RSUs, which yield the highest variance and average **26%** of total compensation.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-bg-border/40 pt-3 mt-4 text-[10px] text-text-muted font-semibold">
                    <span>Community verified submissions</span>
                    <Link href="/compare" className="text-accent-blue hover:text-blue-400 transition-colors font-bold flex items-center space-x-0.5">
                      <span>Compare Tool</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-bg-card/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Stat 1 */}
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4 hover-lift hover:border-accent-blue/30 transition-all duration-300">
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
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4 hover-lift hover:border-accent-gold/30 transition-all duration-300">
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
              <div className="rounded-xl border border-bg-border bg-bg-card p-6 flex items-center space-x-4 hover-lift hover:border-accent-green/30 transition-all duration-300">
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
                className="flex items-center space-x-1.5 text-sm font-bold text-accent-blue hover:text-blue-400 transition-colors cursor-pointer group"
              >
                <span>View All Salaries</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <div className="rounded-2xl border border-bg-border bg-gradient-to-r from-bg-card via-bg-card to-bg-elevated/50 p-8 text-center sm:p-10 space-y-4 shadow-xl transition-all duration-300 hover:border-accent-blue/30">
              <h3 className="text-xl font-bold text-text-primary">Contributed to the community?</h3>
              <p className="mx-auto max-w-lg text-sm text-text-secondary">
                Submit your salary data anonymously in under 2 minutes. Your data helps other professionals negotiate fair pay.
              </p>
              <div className="pt-2">
                <Link
                  href="/submit"
                  className="rounded-lg bg-accent-blue px-6 py-3 text-sm font-bold text-text-primary hover:bg-blue-600 shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 transition-all duration-200 inline-block active:scale-95"
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
