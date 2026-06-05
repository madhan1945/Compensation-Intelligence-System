"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TCDisplay } from "@/components/ui/TCDisplay";
import { formatCurrency } from "@/lib/tc-calculator";
import { Search, X, Check, BarChart3, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  _count: { salaryEntries: number };
}

interface CompareResult {
  company: { id: string; name: string; slug: string };
  avgTotalComp: number;
  medianTotalComp: number;
  avgBase: number;
  avgBonus: number;
  avgStock: number;
  levelBreakdown: { level: string; avgTc: number; count: number }[];
  topRoles: { title: string; avgTc: number; count: number }[];
  sampleSize: number;
}

export default function ComparePage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CompanyItem[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyItem[]>([]);
  
  const [compareData, setCompareData] = useState<CompareResult[]>([]);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);
  const [error, setError] = useState("");

  // Fetch all companies for autocomplete
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        setLoadingList(false);
      }
    }
    loadCompanies();
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedCompanies.some((sc) => sc.id === c.id)
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchQuery, selectedCompanies, companies]);

  const handleSelectCompany = (company: CompanyItem) => {
    if (selectedCompanies.length >= 3) return;
    setSelectedCompanies([...selectedCompanies, company]);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleRemoveCompany = (id: string) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c.id !== id));
    setHasCompared(false);
    setCompareData([]);
  };

  const handleCompare = async () => {
    if (selectedCompanies.length < 2) return;
    setLoadingCompare(true);
    setError("");
    setHasCompared(false);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyIds: selectedCompanies.map((c) => c.id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to compare companies");
      } else {
        setCompareData(data);
        setHasCompared(true);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingCompare(false);
    }
  };

  // Highlights helper for high/low comparisons
  const getHighlightClass = (
    val: number,
    allVals: number[],
    mode: "high" | "low" = "high"
  ) => {
    if (allVals.length < 2) return "text-text-primary";
    
    const validVals = allVals.filter(v => v > 0);
    if (validVals.length < 2) return "text-text-primary";

    const max = Math.max(...validVals);
    const min = Math.min(...validVals);

    if (val === max && mode === "high") {
      return "text-accent-green font-bold";
    }
    if (val === min && mode === "low") {
      return "text-accent-red font-bold";
    }
    return "text-text-primary";
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Compare Companies
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Select 2 to 3 companies to compare salaries, levels, and compensation components side by side.
            </p>
          </div>

          {/* Autocomplete Input & Selected Pills */}
          <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              {/* Search Autocomplete */}
              <div className="flex-grow relative">
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Add Company to Compare
                </label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-5 w-5 text-text-muted" />
                  <input
                    type="text"
                    disabled={selectedCompanies.length >= 3 || loadingList}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      selectedCompanies.length >= 3
                        ? "Maximum 3 companies selected"
                        : "Type company name..."
                    }
                    className="w-full rounded-md border border-bg-border bg-bg-elevated py-2 pl-10 pr-4 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none disabled:opacity-40"
                  />
                </div>

                {/* Autocomplete suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-10 mt-1 rounded-md border border-bg-border bg-bg-card shadow-lg overflow-hidden">
                    {suggestions.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCompany(c)}
                        className="w-full flex justify-between items-center px-4 py-2.5 text-left text-sm text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-xs text-text-secondary">
                          {c._count.salaryEntries} entries
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Compare Button */}
              <div>
                <button
                  onClick={handleCompare}
                  disabled={selectedCompanies.length < 2 || loadingCompare}
                  className="w-full md:w-auto rounded-md bg-accent-blue hover:bg-blue-600 disabled:opacity-45 text-text-primary px-6 py-2 font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loadingCompare ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Comparing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-5 w-5" />
                      <span>Compare</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Selected Pills */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Selected Companies ({selectedCompanies.length}/3)
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedCompanies.length === 0 ? (
                  <span className="text-sm text-text-muted italic">No companies selected yet</span>
                ) : (
                  selectedCompanies.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg border border-bg-border bg-bg-elevated/70 pl-3.5 pr-2 py-1.5 flex items-center space-x-2 shadow-sm"
                    >
                      <span className="text-sm font-bold text-text-primary">{c.name}</span>
                      <button
                        onClick={() => handleRemoveCompany(c.id)}
                        className="p-0.5 rounded-full hover:bg-bg-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-accent-red/10 border border-accent-red/30 p-4 text-sm text-accent-red">
              {error}
            </div>
          )}

          {/* Comparison Table */}
          {hasCompared && compareData.length >= 2 && (
            <div className="rounded-xl border border-bg-border bg-bg-card overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-bg-border bg-bg-elevated/30">
                      <th className="px-6 py-4 text-sm font-extrabold uppercase text-text-secondary w-1/4">
                        Metric
                      </th>
                      {compareData.map((res) => (
                        <th key={res.company.id} className="px-6 py-4 w-1/4">
                          <Link
                            href={`/company/${res.company.slug}`}
                            className="font-extrabold text-base text-text-primary hover:text-accent-blue transition-colors"
                          >
                            {res.company.name}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Avg TC */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-text-primary">Avg Total Comp</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className={`px-6 py-4 font-mono font-bold text-base ${getHighlightClass(
                            res.avgTotalComp,
                            compareData.map((d) => d.avgTotalComp),
                            "high"
                          )}`}
                        >
                          {formatCurrency(res.avgTotalComp)}
                        </td>
                      ))}
                    </tr>

                    {/* Median TC */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-text-primary">Median Total Comp</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className={`px-6 py-4 font-mono font-bold text-base ${getHighlightClass(
                            res.medianTotalComp,
                            compareData.map((d) => d.medianTotalComp),
                            "high"
                          )}`}
                        >
                          {formatCurrency(res.medianTotalComp)}
                        </td>
                      ))}
                    </tr>

                    {/* Avg Base */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm">Avg Base Salary</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className={`px-6 py-4 font-mono text-sm ${getHighlightClass(
                            res.avgBase,
                            compareData.map((d) => d.avgBase),
                            "high"
                          )}`}
                        >
                          {formatCurrency(res.avgBase)}
                        </td>
                      ))}
                    </tr>

                    {/* Avg Bonus */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm">Avg Annual Bonus</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className={`px-6 py-4 font-mono text-sm ${getHighlightClass(
                            res.avgBonus,
                            compareData.map((d) => d.avgBonus),
                            "high"
                          )}`}
                        >
                          {res.avgBonus > 0 ? formatCurrency(res.avgBonus) : "—"}
                        </td>
                      ))}
                    </tr>

                    {/* Avg Stock */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm">Avg Equity (Per Yr)</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className={`px-6 py-4 font-mono text-sm ${getHighlightClass(
                            res.avgStock,
                            compareData.map((d) => d.avgStock),
                            "high"
                          )}`}
                        >
                          {res.avgStock > 0 ? formatCurrency(res.avgStock) : "—"}
                        </td>
                      ))}
                    </tr>

                    {/* Sample Size */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm">Sample Size</td>
                      {compareData.map((res) => (
                        <td
                          key={res.company.id}
                          className="px-6 py-4 font-mono text-sm text-text-primary"
                        >
                          {res.sampleSize} entries
                        </td>
                      ))}
                    </tr>

                    {/* Top Roles */}
                    <tr className="border-b border-bg-border/60 hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm align-top pt-4">
                        Top Roles
                      </td>
                      {compareData.map((res) => (
                        <td key={res.company.id} className="px-6 py-4">
                          <ul className="space-y-1.5 text-sm">
                            {res.topRoles.length === 0 ? (
                              <li className="text-text-muted italic">No data</li>
                            ) : (
                              res.topRoles.map((r, i) => (
                                <li key={i} className="text-text-primary font-medium">
                                  {r.title}{" "}
                                  <span className="text-xs text-text-secondary font-mono">
                                    ({formatCurrency(r.avgTc)})
                                  </span>
                                </li>
                              ))
                            )}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Level Breakdown */}
                    <tr className="hover:bg-bg-elevated/20 transition-colors">
                      <td className="px-6 py-4 text-text-secondary text-sm align-top pt-4">
                        Levels Breakdown
                      </td>
                      {compareData.map((res) => (
                        <td key={res.company.id} className="px-6 py-4">
                          <ul className="space-y-1 text-sm font-mono">
                            {res.levelBreakdown.length === 0 ? (
                              <li className="text-text-muted italic">No data</li>
                            ) : (
                              res.levelBreakdown.map((l, i) => (
                                <li key={i} className="text-text-primary">
                                  <span className="font-semibold text-accent-blue">{l.level}</span>:{" "}
                                  <span>{formatCurrency(l.avgTc)}</span>{" "}
                                  <span className="text-xs text-text-muted">({l.count} entries)</span>
                                </li>
                              ))
                            )}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
