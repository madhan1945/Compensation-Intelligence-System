import { formatCurrency } from "@/lib/tc-calculator";
import { cn } from "@/lib/utils";

interface TCDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  currency?: string;
  isLarge?: boolean;
}

export function TCDisplay({
  value,
  currency = "INR",
  isLarge = false,
  className,
  ...props
}: TCDisplayProps) {
  const formatted = formatCurrency(value, currency);

  let colorClass = "text-text-primary";

  if (currency === "INR") {
    if (value >= 5_000_000) {
      colorClass = "text-accent-gold"; // Premium TC
    } else if (value >= 2_000_000) {
      colorClass = "text-accent-green"; // Good TC
    }
  } else if (currency === "USD") {
    if (value >= 150_000) {
      colorClass = "text-accent-gold";
    } else if (value >= 80_000) {
      colorClass = "text-accent-green";
    }
  }

  return (
    <span
      className={cn(
        "font-mono font-bold tracking-tight",
        isLarge ? "text-2xl sm:text-3xl" : "text-sm sm:text-base",
        colorClass,
        className
      )}
      {...props}
    >
      {formatted}
    </span>
  );
}
