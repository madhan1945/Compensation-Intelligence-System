"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"company" | "jobTitle">("company");
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (query.trim() === "") return;

    const timer = setTimeout(() => {
      if (searchType === "company") {
        router.push(`/salaries?company=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(`/salaries?jobTitle=${encodeURIComponent(query.trim())}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative rounded-lg border border-bg-border bg-bg-card shadow-lg p-1.5 flex items-center">
        <div className="flex items-center pl-3">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            searchType === "company"
              ? "Search by company name (e.g. Google, Amazon)..."
              : "Search by job title (e.g. Software Engineer)..."
          }
          className="w-full bg-transparent border-0 py-3 pl-3 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:ring-0 sm:text-base"
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setSearchType("company")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            searchType === "company"
              ? "bg-accent-blue/10 border-accent-blue text-accent-blue"
              : "bg-bg-card border-bg-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Search Companies
        </button>
        <button
          onClick={() => setSearchType("jobTitle")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            searchType === "jobTitle"
              ? "bg-accent-blue/10 border-accent-blue text-accent-blue"
              : "bg-bg-card border-bg-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Search Job Titles
        </button>
      </div>
    </div>
  );
}
