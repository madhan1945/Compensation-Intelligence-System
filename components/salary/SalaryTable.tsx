"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { TCDisplay } from "@/components/ui/TCDisplay";
import { formatCurrency } from "@/lib/tc-calculator";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface SalaryTableProps {
  data: any[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SalaryTable({ data, loading, pagination }: SalaryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (field: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentSort = current.get("sortBy") || "totalComp";
    const currentDir = current.get("sortDir") || "desc";

    let nextDir = "desc";
    if (currentSort === field) {
      nextDir = currentDir === "desc" ? "asc" : "desc";
    }

    current.set("sortBy", field);
    current.set("sortDir", nextDir);
    router.push(`?${current.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`?${current.toString()}`);
  };

  const getSortIcon = (field: string) => {
    const currentSort = searchParams.get("sortBy") || "totalComp";
    const currentDir = searchParams.get("sortDir") || "desc";

    if (currentSort !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />;
    }
    return currentDir === "desc" ? (
      <ArrowDown className="h-3.5 w-3.5 text-accent-blue" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5 text-accent-blue" />
    );
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="rounded-xl border border-bg-border bg-bg-card overflow-hidden">
          <div className="h-12 border-b border-bg-border bg-bg-elevated/50 flex items-center px-6">
            <Skeleton className="h-5 w-full max-w-lg" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex space-x-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-xl border border-bg-border bg-bg-card p-12 text-center">
        <h3 className="text-lg font-bold text-text-primary mb-2">No matching entries found</h3>
        <p className="text-sm text-text-secondary mb-6">
          Try clearing some filters or be the first to submit a salary for this query!
        </p>
        <Link
          href="/submit"
          className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-text-primary hover:bg-blue-600 transition-colors inline-block"
        >
          Submit Salary
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block rounded-xl border border-bg-border bg-bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-bg-border bg-bg-elevated/30">
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Company
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Level
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Location
                </th>
                <th
                  onClick={() => handleSort("yearsOfExp")}
                  className="px-6 py-4 text-xs font-bold uppercase text-text-secondary cursor-pointer hover:bg-bg-elevated/35 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>YoE</span>
                    {getSortIcon("yearsOfExp")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("baseSalary")}
                  className="px-6 py-4 text-xs font-bold uppercase text-text-secondary cursor-pointer hover:bg-bg-elevated/35 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Base</span>
                    {getSortIcon("baseSalary")}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Bonus
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">
                  Stock
                </th>
                <th
                  onClick={() => handleSort("totalComp")}
                  className="px-6 py-4 text-xs font-bold uppercase text-text-secondary cursor-pointer hover:bg-bg-elevated/35 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Total Comp</span>
                    {getSortIcon("totalComp")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("submittedAt")}
                  className="px-6 py-4 text-xs font-bold uppercase text-text-secondary cursor-pointer hover:bg-bg-elevated/35 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {getSortIcon("submittedAt")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/salaries/${item.id}`)}
                  className="border-b border-bg-border hover:bg-bg-elevated/40 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/company/${item.company.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-text-primary hover:text-accent-blue transition-colors"
                    >
                      {item.company.canonicalName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {item.jobTitle}
                  </td>
                  <td className="px-6 py-4">
                    <Badge level={item.level} />
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">
                    {item.city}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-text-primary">
                    {item.yearsOfExp} yrs
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-text-secondary">
                    {formatCurrency(item.baseSalary, item.currency)}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-text-secondary">
                    {item.annualBonus > 0 ? formatCurrency(item.annualBonus, item.currency) : "—"}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-text-secondary">
                    {item.stockValue > 0
                      ? `${formatCurrency(item.stockValue / item.vestingYears, item.currency)}/yr`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <TCDisplay value={item.totalComp} currency={item.currency} />
                  </td>
                  <td className="px-6 py-4 text-text-muted text-xs">
                    {new Date(item.submittedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card-based Layout */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/salaries/${item.id}`)}
            className="rounded-xl border border-bg-border bg-bg-card p-5 shadow-sm hover:border-text-muted transition-all active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <Link
                  href={`/company/${item.company.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-base text-text-primary hover:text-accent-blue transition-colors block"
                >
                  {item.company.canonicalName}
                </Link>
                <span className="text-sm font-medium text-text-secondary">{item.jobTitle}</span>
              </div>
              <TCDisplay value={item.totalComp} currency={item.currency} />
            </div>

            <div className="flex justify-between items-center text-xs text-text-secondary pt-3 border-t border-bg-border/60">
              <div className="flex space-x-2 items-center">
                <Badge level={item.level} />
                <span>•</span>
                <span>{item.city}</span>
                <span>•</span>
                <span>{item.yearsOfExp} YoE</span>
              </div>
              <span className="text-text-muted">
                {new Date(item.submittedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-3 border-t border-bg-border">
          <div className="text-sm text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{data.length}</span> of{" "}
            <span className="font-semibold text-text-primary">{pagination.total}</span> entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-md border border-bg-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-bg-border disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs text-text-secondary select-none">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-md border border-bg-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-bg-border disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
