"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");
  const registeredParam = searchParams.get("registered");

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
      router.refresh();
    }
  }, [status, callbackUrl, router]);

  // Show registration success message
  useEffect(() => {
    if (registeredParam === "true") {
      setSuccessMessage("Account created successfully! Please sign in below.");
    }
  }, [registeredParam]);

  // Handle auth errors from query params
  useEffect(() => {
    if (errorParam) {
      if (errorParam === "OAuthSignin") {
        setError("Failed to link account with Google. Please try again.");
      } else if (errorParam === "OAuthCallback") {
        setError("Error completing Google sign-in. Please try again.");
      } else if (errorParam === "OAuthAccountNotLinked") {
        setError("This email is already associated with another login method. Please sign in with your email and password.");
      } else if (errorParam === "CredentialsSignin") {
        setError("Invalid email or password.");
      } else {
        setError("Sign-in failed. Please check your credentials or try again.");
      }
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
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
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Render a loading state while checking authentication to prevent layout flashing
  if (status === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

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
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-medium text-accent-blue hover:text-blue-400 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="rounded-md bg-accent-green/10 border border-accent-green/30 p-4 text-sm text-accent-green">
              {successMessage}
            </div>
          )}
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

        <div className="relative flex py-2 items-center justify-center">
          <div className="flex-grow border-t border-bg-border"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-text-muted uppercase">Or continue with</span>
          <div className="flex-grow border-t border-bg-border"></div>
        </div>

        <div>
          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center rounded-md border border-bg-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-bg-border disabled:opacity-50 transition-colors cursor-pointer space-x-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.473 0-6.294-2.82-6.294-6.293 0-3.473 2.82-6.294 6.294-6.294 1.579 0 3.018.58 4.135 1.536l3.1-3.1C18.995 1.83 15.823 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11 0-.746-.08-1.42-.224-2.195H12.24z" />
            </svg>
            <span>{googleLoading ? "Signing in..." : "Google"}</span>
          </button>
        </div>

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
