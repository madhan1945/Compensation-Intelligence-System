"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        } else {
          setError(data.error || "Failed to create account");
        }
      } else {
        // Success: Automatically sign in
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.error) {
          router.push("/login?registered=true");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-bg-primary">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-bg-border bg-bg-card p-8 shadow-2xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-text-primary">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-accent-blue hover:text-blue-400 transition-colors"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-accent-red/10 border border-accent-red/30 p-4 text-sm text-accent-red">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none sm:text-sm"
                placeholder="Jane Doe"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-accent-red">{fieldErrors.name[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-text-secondary mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none sm:text-sm"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-accent-red">{fieldErrors.email[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password (min 8 chars)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none sm:text-sm"
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-accent-red">{fieldErrors.password[0]}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-text-primary hover:bg-blue-600 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-text-muted hover:text-text-secondary transition-colors"
          >
            Continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}
