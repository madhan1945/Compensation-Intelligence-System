"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"company" | "jobTitle">("company");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery === "") return;

    if (searchType === "company") {
      router.push(`/salaries?company=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push(`/salaries?jobTitle=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form 
        onSubmit={handleSearch} 
        className="relative rounded-xl border border-bg-border bg-bg-card/75 backdrop-blur-md shadow-2xl p-1.5 flex items-center transition-all duration-300 hover:border-accent-blue/50 focus-within:border-accent-blue focus-within:shadow-accent-blue/10 focus-within:shadow-2xl"
      >
        <div className="flex items-center pl-3">
          <Search className="h-5 w-5 text-text-muted transition-colors duration-300 group-focus-within:text-accent-blue" />
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
          className="w-full bg-transparent border-0 py-3 pl-3 pr-20 text-text-primary placeholder-text-muted focus:outline-none focus:ring-0 sm:text-base font-medium"
        />
        <button
          type="submit"
          disabled={query.trim() === ""}
          className="absolute right-3 px-5 py-2.5 rounded-lg bg-accent-blue text-text-primary hover:bg-blue-600 disabled:opacity-50 transition-all duration-200 cursor-pointer text-sm font-bold shadow-md hover:shadow-lg active:scale-95"
        >
          Search
        </button>
      </form>

      <div className="flex justify-center space-x-3">
        <button
          type="button"
          onClick={() => setSearchType("company")}
          className={`px-4.5 py-2 rounded-full text-xs font-bold border transition-all duration-250 cursor-pointer active:scale-95 ${
            searchType === "company"
              ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              : "bg-bg-card/60 border-bg-border text-text-secondary hover:text-text-primary hover:border-text-secondary"
          }`}
        >
          Search Companies
        </button>
        <button
          type="button"
          onClick={() => setSearchType("jobTitle")}
          className={`px-4.5 py-2 rounded-full text-xs font-bold border transition-all duration-250 cursor-pointer active:scale-95 ${
            searchType === "jobTitle"
              ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.15)]"
              : "bg-bg-card/60 border-bg-border text-text-secondary hover:text-text-primary hover:border-text-secondary"
          }`}
        >
          Search Job Titles
        </button>
      </div>
    </div>
  );
}
