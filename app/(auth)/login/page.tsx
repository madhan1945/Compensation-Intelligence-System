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
  const reasonParam = searchParams.get("reason");

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
      router.refresh();
    }
  }, [status, callbackUrl, router]);

  // Show registration success message or auth gate redirection notice
  useEffect(() => {
    if (registeredParam === "true") {
      setSuccessMessage("Account created successfully! Please sign in below.");
    } else if (reasonParam === "gate") {
      setSuccessMessage("Please sign in or create an account to continue browsing CompensationIQ.");
    }
  }, [registeredParam, reasonParam]);

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
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left Pane: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-bg-primary z-10">
        <div className="w-full max-w-md space-y-8 rounded-xl border border-bg-border bg-bg-card p-8 shadow-2xl hover:border-accent-blue/20 transition-all duration-300">
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
              onClick={() => sessionStorage.setItem("guest-mode", "true")}
              className="text-xs font-semibold text-text-muted hover:text-text-secondary transition-colors"
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>

      {/* Right Pane: Visual Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-bg-card border-l border-bg-border relative overflow-hidden items-center justify-center p-12 select-none">
        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-blue/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-green/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 relative z-10 text-left">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-3.5 py-1 rounded-full">
              Negotiation Intelligence
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
              Know your worth. <br />
              Negotiate with data.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Join thousands of tech professionals sharing anonymous, verified salary records. Access side-by-side company metrics and compensation breakdowns.
            </p>
          </div>

          {/* Mockup Salary Card */}
          <div className="rounded-2xl border border-bg-border bg-bg-elevated/75 backdrop-blur-md p-6 shadow-2xl space-y-4 hover:border-accent-blue/40 transition-colors duration-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center font-bold text-accent-blue text-sm font-mono border border-accent-blue/20">
                  G
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Software Engineer</h4>
                  <span className="text-xs text-text-secondary">Google • L4</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Total Comp</span>
                <span className="text-lg font-extrabold text-accent-green font-mono">₹34,50,000<span className="text-[10px] text-text-secondary font-sans font-normal ml-0.5">/yr</span></span>
              </div>
            </div>

            {/* Progress bars breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-bg-border/60">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-secondary">Base Salary</span>
                  <span className="text-text-primary font-mono">₹22,00,000 (64%)</span>
                </div>
                <div className="w-full bg-bg-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-blue h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-secondary">Annual Equity</span>
                  <span className="text-text-primary font-mono">₹9,00,000 (26%)</span>
                </div>
                <div className="w-full bg-bg-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-gold h-full rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-secondary">Target Bonus</span>
                  <span className="text-text-primary font-mono">₹3,50,000 (10%)</span>
                </div>
                <div className="w-full bg-bg-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-green h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators row */}
          <div className="flex items-center space-x-3 pt-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-accent-blue/20 border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-accent-blue">L3</div>
              <div className="w-7 h-7 rounded-full bg-accent-green/20 border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-accent-green">L4</div>
              <div className="w-7 h-7 rounded-full bg-accent-gold/20 border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-accent-gold">L5</div>
            </div>
            <p className="text-xs text-text-secondary">
              Empowering candidates since 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
