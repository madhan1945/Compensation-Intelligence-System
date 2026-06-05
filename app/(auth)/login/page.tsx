"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
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
            Sign in to <span className="text-accent-blue font-mono font-bold">CompensationIQ</span>
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-accent-blue hover:text-blue-400 transition-colors"
            >
              create a new account
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
              <label htmlFor="email-address" className="block text-sm font-medium text-text-secondary mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-text-primary placeholder-text-muted focus:border-accent-blue focus:outline-none sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-text-primary hover:bg-blue-600 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
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
