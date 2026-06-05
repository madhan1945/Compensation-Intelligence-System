"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { calculateTotalComp, formatCurrency } from "@/lib/tc-calculator";
import { normalizeCity } from "@/lib/normalize";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Lock, Sparkles } from "lucide-react";

const LEVELS = ["L3", "L4", "L5", "L6", "SDE-1", "SDE-2", "Senior", "Lead", "Principal", "Other"];

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Step 1 Form fields
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");

  // Autocomplete for companies
  const [companiesList, setCompaniesList] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Step 2 Form fields
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [remote, setRemote] = useState(false);
  const [yearsOfExp, setYearsOfExp] = useState<number | "">("");

  // Step 3 Form fields
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [baseSalary, setBaseSalary] = useState<number | "">("");
  const [annualBonus, setAnnualBonus] = useState<number | "">("");
  const [signingBonus, setSigningBonus] = useState<number | "">("");
  const [stockValue, setStockValue] = useState<number | "">("");
  const [vestingYears, setVestingYears] = useState<number>(4);

  // Fetch company names for autocomplete
  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompaniesList(data.map((c: any) => c.name));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCompanies();
  }, []);

  // Filter company autocomplete
  useEffect(() => {
    if (companyName.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = companiesList.filter((c) =>
      c.toLowerCase().includes(companyName.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [companyName, companiesList]);

  // Redirect to login if unauthenticated
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <Loader2 className="animate-spin h-8 w-8 text-accent-blue" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 px-4 bg-bg-primary">
          <div className="w-full max-w-md text-center rounded-xl border border-bg-border bg-bg-card p-8 shadow-xl space-y-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary">Authentication Required</h2>
            <p className="text-sm text-text-secondary">
              You must sign in to submit your salary. This helps prevent spam and duplicate submissions. All submissions are completely anonymous.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push(`/login?callbackUrl=/submit`)}
                className="w-full rounded-md bg-accent-blue hover:bg-blue-600 text-text-primary py-2.5 font-bold transition-colors cursor-pointer"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Live TC calculation
  const liveTc = calculateTotalComp({
    baseSalary: Number(baseSalary) || 0,
    annualBonus: Number(annualBonus) || 0,
    signingBonus: Number(signingBonus) || 0,
    stockValue: Number(stockValue) || 0,
    vestingYears: Number(vestingYears) || 4,
  });

  // Normalization check
  const normalizedCityResult = city ? normalizeCity(city) : "";
  const showsCityNormalization = city && normalizedCityResult !== city;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          jobTitle,
          level,
          department: department || undefined,
          yearsOfExp: Number(yearsOfExp) || 0,
          city,
          country,
          remote,
          currency,
          baseSalary: Number(baseSalary) || 0,
          annualBonus: Number(annualBonus) || 0,
          signingBonus: Number(signingBonus) || 0,
          stockValue: Number(stockValue) || 0,
          vestingYears: Number(vestingYears) || 4,
          anonymous: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          // Auto route to steps where errors occurred
          if (data.details.companyName || data.details.jobTitle || data.details.level) {
            setStep(1);
          } else if (data.details.city || data.details.yearsOfExp) {
            setStep(2);
          } else {
            setStep(3);
          }
        } else {
          setError(data.error || "Submission failed");
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 px-4 bg-bg-primary">
          <div className="w-full max-w-md text-center rounded-xl border border-bg-border bg-bg-card p-8 shadow-xl space-y-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary">Submission Successful!</h2>
            <p className="text-sm text-text-secondary">
              Thank you! Your anonymous submission helps members of the community negotiate better compensation packages.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/salaries"
                className="w-full rounded-md bg-accent-blue hover:bg-blue-600 text-text-primary py-2.5 font-bold transition-colors inline-block"
              >
                Browse Salaries
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(1);
                  setCompanyName("");
                  setJobTitle("");
                  setLevel("");
                  setDepartment("");
                  setCity("");
                  setYearsOfExp("");
                  setBaseSalary("");
                  setAnnualBonus("");
                  setSigningBonus("");
                  setStockValue("");
                  setVestingYears(4);
                }}
                className="w-full rounded-md bg-bg-elevated border border-bg-border hover:bg-bg-border text-text-primary py-2.5 font-bold transition-colors cursor-pointer"
              >
                Submit Another Entry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-bg-primary">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Submit Salary Entry
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Contribute your compensation details anonymously.
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-8 px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-grow last:flex-grow-0">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-extrabold border transition-all duration-300 ${
                    step >= s
                      ? "bg-accent-blue border-accent-blue text-text-primary shadow-[0_0_15px_rgba(59,130,246,0.35)] scale-105"
                      : "bg-bg-card border-bg-border text-text-secondary"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 flex-grow mx-2 transition-colors duration-300 ${
                      step > s ? "bg-accent-blue" : "bg-bg-border"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-bg-border bg-bg-card p-6 sm:p-8 shadow-md space-y-6">
            {error && (
              <div className="rounded-md bg-accent-red/10 border border-accent-red/30 p-4 text-sm text-accent-red">
                {error}
              </div>
            )}

            {/* STEP 1: Company & Role */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                  <span className="text-accent-blue">Step 1:</span>
                  <span>Company & Role Details</span>
                </h2>

                {/* Company Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Google"
                    className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                  />
                  {fieldErrors.companyName && (
                    <p className="mt-1 text-xs text-accent-red">{fieldErrors.companyName[0]}</p>
                  )}

                  {/* Autocomplete suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 z-10 mt-1.5 rounded-xl border border-bg-border bg-bg-card/90 backdrop-blur-md shadow-2xl overflow-hidden">
                      {suggestions.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCompanyName(c);
                            setSuggestions([]);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-accent-blue/15 hover:text-accent-blue transition-colors cursor-pointer font-medium"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                  />
                  {fieldErrors.jobTitle && (
                    <p className="mt-1 text-xs text-accent-red">{fieldErrors.jobTitle[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Level / Grade
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      required
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    >
                      <option value="">Select Level</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.level && (
                      <p className="mt-1 text-xs text-accent-red">{fieldErrors.level[0]}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Department (Optional)
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Engineering, Product"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!companyName || !jobTitle || !level}
                    className="rounded-md bg-accent-blue hover:bg-blue-600 disabled:opacity-45 text-text-primary px-5 py-2 font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Next: Location & Exp</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Location & Experience */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                  <span className="text-accent-blue">Step 2:</span>
                  <span>Location & Experience</span>
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="e.g. Bangalore"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                    {fieldErrors.city && (
                      <p className="mt-1 text-xs text-accent-red">{fieldErrors.city[0]}</p>
                    )}

                    {/* Normalization Alert */}
                    {showsCityNormalization && (
                      <div className="mt-1.5 text-xs text-accent-green flex items-center space-x-1 font-semibold">
                        <Sparkles className="h-3 w-3" />
                        <span>
                          You entered: <span className="italic">{city}</span> → Saved as:{" "}
                          <span className="underline">{normalizedCityResult}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      placeholder="India"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                    {fieldErrors.country && (
                      <p className="mt-1 text-xs text-accent-red">{fieldErrors.country[0]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Years of Exp */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Years of Experience (Total)
                    </label>
                    <input
                      type="number"
                      value={yearsOfExp}
                      onChange={(e) =>
                        setYearsOfExp(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      required
                      min={0}
                      max={50}
                      placeholder="e.g. 3"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                    {fieldErrors.yearsOfExp && (
                      <p className="mt-1 text-xs text-accent-red">{fieldErrors.yearsOfExp[0]}</p>
                    )}
                  </div>

                  {/* Remote */}
                  <div className="flex items-center pt-6">
                    <input
                      id="remote"
                      type="checkbox"
                      checked={remote}
                      onChange={(e) => setRemote(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-bg-border bg-bg-elevated text-accent-blue focus:ring-accent-blue cursor-pointer"
                    />
                    <label htmlFor="remote" className="ml-2.5 text-sm font-medium text-text-secondary cursor-pointer">
                      This is a remote position
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-md bg-bg-elevated border border-bg-border hover:bg-bg-border text-text-primary px-4 py-2 font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!city || yearsOfExp === ""}
                    className="rounded-md bg-accent-blue hover:bg-blue-600 disabled:opacity-45 text-text-primary px-5 py-2 font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Next: Compensation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Compensation & Live Preview */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-text-primary flex items-center space-x-2">
                  <span className="text-accent-blue">Step 3:</span>
                  <span>Compensation Details</span>
                </h2>

                {/* Currency Toggle */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Currency
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setCurrency("INR")}
                      className={`flex-grow rounded-md py-2 text-sm font-bold border transition-all cursor-pointer ${
                        currency === "INR"
                          ? "bg-accent-blue/10 border-accent-blue text-accent-blue"
                          : "bg-bg-elevated border-bg-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      INR (₹)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`flex-grow rounded-md py-2 text-sm font-bold border transition-all cursor-pointer ${
                        currency === "USD"
                          ? "bg-accent-blue/10 border-accent-blue text-accent-blue"
                          : "bg-bg-elevated border-bg-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Base Salary */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Annual Base Salary ({currency === "INR" ? "₹" : "$"})
                    </label>
                    <input
                      type="number"
                      value={baseSalary}
                      onChange={(e) =>
                        setBaseSalary(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      required
                      placeholder={currency === "INR" ? "e.g. 1800000" : "e.g. 120000"}
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                    {fieldErrors.baseSalary && (
                      <p className="mt-1 text-xs text-accent-red">{fieldErrors.baseSalary[0]}</p>
                    )}
                  </div>

                  {/* Annual Bonus */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Target Annual Bonus ({currency === "INR" ? "₹" : "$"})
                    </label>
                    <input
                      type="number"
                      value={annualBonus}
                      onChange={(e) =>
                        setAnnualBonus(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="0 if none"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Signing Bonus */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Signing Bonus
                    </label>
                    <input
                      type="number"
                      value={signingBonus}
                      onChange={(e) =>
                        setSigningBonus(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="0 if none"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                  </div>

                  {/* Stock Value */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Total Equity Grant (4 yr)
                    </label>
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) =>
                        setStockValue(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="Total value"
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                  </div>

                  {/* Vesting Years */}
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Vesting Period (Yrs)
                    </label>
                    <input
                      type="number"
                      value={vestingYears}
                      onChange={(e) => setVestingYears(Number(e.target.value) || 4)}
                      min={1}
                      max={10}
                      className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-blue focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live TC Preview Card */}
                <div className="rounded-xl border border-accent-blue/30 bg-accent-blue/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Live Compensation Preview</h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Formula: Base + Target Bonus + Signing + (Stock / Vesting Years)
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <div className="text-xs text-text-secondary font-semibold uppercase">
                      Estimated First Year TC
                    </div>
                    <div className="font-mono text-2xl font-extrabold text-accent-green mt-0.5">
                      {formatCurrency(liveTc, currency)}
                      <span className="text-xs text-text-secondary font-sans font-normal ml-1">
                        /yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-md bg-bg-elevated border border-bg-border hover:bg-bg-border text-text-primary px-4 py-2 font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!baseSalary || loading}
                    className="rounded-md bg-accent-green hover:brightness-115 text-text-primary px-6 py-2 font-bold transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Salary Entry</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
