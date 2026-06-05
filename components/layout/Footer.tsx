import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-bg-border bg-bg-card/90 backdrop-blur-md py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan Column */}
          <div className="space-y-4">
            <span className="text-lg font-bold font-mono text-text-primary">
              Compensation<span className="text-accent-blue font-bold">IQ</span>
            </span>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bringing salary transparency and negotiation intelligence to tech professionals. Enforced levels and accurate compensation insights.
            </p>
          </div>

          {/* Platform Links Column */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">Platform</h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/salaries" className="hover:text-accent-blue transition-colors">
                  Browse Salaries
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-accent-blue transition-colors">
                  Compare Companies
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-accent-blue transition-colors">
                  Submit Salary
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">Socials</h3>
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/madhan1945"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors bg-bg-elevated border border-bg-border hover:border-accent-blue/30 p-2.5 rounded-lg active:scale-95 cursor-pointer shadow-sm"
                aria-label="GitHub Profile"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/j-madhan-kumaar-aa67ab355/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors bg-bg-elevated border border-bg-border hover:border-accent-blue/30 p-2.5 rounded-lg active:scale-95 cursor-pointer shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* GitHub / Built Info Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-primary">Creator</h3>
            <p className="text-xs text-text-secondary">
              Developed by <span className="font-semibold text-text-primary">madhan1945</span>.
            </p>
            <a
              href="https://github.com/madhan1945/Compensation-Intelligence-System"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs text-text-secondary hover:text-text-primary transition-colors bg-bg-elevated border border-bg-border px-3 py-1.5 rounded-md active:scale-95 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        <div className="border-t border-bg-border/60 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} CompensationIQ. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Self-reported entries are user-submitted and anonymous.
          </p>
        </div>
      </div>
    </footer>
  );
}
