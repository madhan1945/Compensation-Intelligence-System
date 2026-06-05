"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, DollarSign, BarChart3, PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-bg-border bg-bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-wider font-mono text-text-primary animate-pulse-slow">
                Compensation<span className="text-accent-blue font-bold">IQ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/salaries"
              className="flex items-center space-x-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              <span>Browse Salaries</span>
            </Link>
            <Link
              href="/compare"
              className="flex items-center space-x-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Compare</span>
            </Link>
            <Link
              href="/submit"
              className="flex items-center space-x-1.5 text-sm font-bold text-accent-green hover:brightness-110 transition-all bg-accent-green/10 border border-accent-green/20 px-3.5 py-1.5 rounded-full"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit Salary</span>
            </Link>

            <div className="h-5 w-px bg-bg-border"></div>
            
            <ThemeToggle />

            <div className="h-5 w-px bg-bg-border"></div>

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary">
                  Hi, <span className="font-semibold text-text-primary">{session.user?.name}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-md bg-bg-elevated border border-bg-border px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-bg-border transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-accent-blue px-4 py-2 text-sm font-semibold text-text-primary hover:bg-blue-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary hover:bg-bg-elevated hover:text-text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-bg-border bg-bg-card px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            href="/salaries"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
          >
            Browse Salaries
          </Link>
          <Link
            href="/compare"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/submit"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-accent-green bg-accent-green/10 hover:bg-accent-green/20 transition-all"
          >
            Submit Salary
          </Link>

          <div className="my-2 border-t border-bg-border"></div>

          <div className="flex justify-between items-center px-3 py-2">
            <span className="text-sm font-semibold text-text-secondary">Toggle Theme</span>
            <ThemeToggle />
          </div>

          <div className="my-2 border-t border-bg-border"></div>

          {session ? (
            <div className="space-y-2 px-3">
              <div className="text-sm text-text-secondary">
                Logged in as <span className="font-semibold text-text-primary">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-md bg-bg-elevated border border-bg-border px-3 py-2 text-center text-sm font-semibold text-text-primary hover:bg-bg-border transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-center text-sm font-medium text-text-primary hover:bg-bg-border transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-accent-blue px-3 py-2 text-center text-sm font-semibold text-text-primary hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
