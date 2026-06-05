import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/layout/SearchBar";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 bg-bg-primary text-center">
        <div className="max-w-md space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="font-mono text-5xl font-extrabold text-accent-blue">404</h1>
            <h2 className="text-2xl font-bold text-text-primary">Page Not Found</h2>
            <p className="text-sm text-text-secondary">
              We couldn't find the page you're looking for. Search for companies or job titles below.
            </p>
          </div>

          <div className="pt-4">
            <SearchBar />
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="text-sm font-semibold text-accent-blue hover:text-blue-400 transition-colors"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
