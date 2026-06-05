"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h2 className="text-2xl font-extrabold text-text-primary">Something went wrong</h2>
      <p className="text-text-secondary max-w-md">
        {error.message || "An unexpected error occurred in the application."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-accent-blue hover:bg-blue-600 text-text-primary px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
