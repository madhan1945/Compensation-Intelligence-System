import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-bg-primary">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-8 w-8 text-accent-blue" />
        <span className="text-sm font-semibold text-text-secondary">Loading page data...</span>
      </div>
    </div>
  );
}
