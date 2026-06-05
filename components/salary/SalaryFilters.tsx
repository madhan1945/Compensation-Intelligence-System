"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

const LEVELS = ["L3", "L4", "L5", "L6", "SDE-1", "SDE-2", "Senior", "Lead", "Principal"];
const CITIES = ["Bengaluru", "Hyderabad", "Pune", "Gurugram", "Mumbai", "Noida", "Chennai"];
const YOE_RANGES = [
  { label: "All YoE", min: "", max: "" },
  { label: "0-2 Years", min: "0", max: "2" },
  { label: "2-5 Years", min: "2", max: "5" },
  { label: "5-10 Years", min: "5", max: "10" },
  { label: "10+ Years", min: "10", max: "50" },
];

export default function SalaryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [yoeRange, setYoeRange] = useState(() => {
    const minYoe = searchParams.get("minYoe") || "";
    const maxYoe = searchParams.get("maxYoe") || "";
    const found = YOE_RANGES.find((r) => r.min === minYoe && r.max === maxYoe);
    return found ? YOE_RANGES.indexOf(found) : 0;
  });
  const [minTc, setMinTc] = useState(searchParams.get("minTc") || "");

  const handleCompanySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ company });
  };

  const updateUrl = (updatedParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    // Reset page to 1 on filter change
    if (!updatedParams.page) {
      current.set("page", "1");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handleLevelChange = (selectedLevel: string) => {
    const newVal = level === selectedLevel ? "" : selectedLevel;
    setLevel(newVal);
    updateUrl({ level: newVal });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCity(val);
    updateUrl({ city: val });
  };

  const handleYoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    setYoeRange(idx);
    const range = YOE_RANGES[idx];
    updateUrl({
      minYoe: range.min || null,
      maxYoe: range.max || null,
    });
  };

  const handleMinTcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinTc(val);
  };

  const handleClearAll = () => {
    setCompany("");
    setLevel("");
    setCity("");
    setYoeRange(0);
    setMinTc("");
    router.push(pathname);
  };

  return (
    <div className="w-full rounded-xl border border-bg-border bg-bg-card p-6 shadow-md mb-6">
      <div className="flex items-center space-x-2 text-text-primary font-bold mb-4">
        <SlidersHorizontal className="h-5 w-5 text-accent-blue" />
        <span>Filters</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <form onSubmit={handleCompanySearchSubmit} className="relative">
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Search Company
          </label>
          <div className="relative">
            <button type="submit" className="absolute top-2.5 left-3 h-4.5 w-4.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center justify-center">
              <Search className="h-4.5 w-4.5" />
            </button>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Press Enter to search"
              className="w-full rounded-md border border-bg-border bg-bg-elevated py-2 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none"
            />
          </div>
        </form>

        {/* City Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Location
          </label>
          <select
            value={city}
            onChange={handleCityChange}
            className="w-full rounded-md border border-bg-border bg-bg-elevated py-2 px-3 text-sm text-text-primary focus:border-accent-blue focus:outline-none"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* YoE Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Experience (YoE)
          </label>
          <select
            value={yoeRange}
            onChange={handleYoeChange}
            className="w-full rounded-md border border-bg-border bg-bg-elevated py-2 px-3 text-sm text-text-primary focus:border-accent-blue focus:outline-none"
          >
            {YOE_RANGES.map((r, i) => (
              <option key={r.label} value={i}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min TC Input */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Min Total Comp (₹)
          </label>
          <input
            type="number"
            value={minTc}
            onChange={handleMinTcChange}
            onBlur={() => updateUrl({ minTc })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateUrl({ minTc });
              }
            }}
            placeholder="e.g. 2000000"
            className="w-full rounded-md border border-bg-border bg-bg-elevated py-2 px-3 text-sm text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none"
          />
        </div>
      </div>

      {/* Levels Multi-select row */}
      <div className="mt-5">
        <label className="block text-xs font-semibold text-text-secondary mb-2">
          Filter by Level
        </label>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const active = level === l;
            return (
              <button
                key={l}
                onClick={() => handleLevelChange(l)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue"
                    : "bg-bg-elevated border-bg-border text-text-secondary hover:text-text-primary hover:border-text-secondary"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={handleClearAll}
          className="flex items-center space-x-1.5 text-xs text-text-secondary hover:text-accent-red font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
}
