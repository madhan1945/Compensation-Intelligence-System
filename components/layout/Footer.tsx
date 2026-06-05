export default function Footer() {
  return (
    <footer className="mt-auto border-t border-bg-border bg-bg-card py-6">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} CompensationIQ. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Built by <span className="font-semibold text-text-secondary">madhan1945</span>
        </p>
      </div>
    </footer>
  );
}
