import { cn } from "@/lib/utils";

// Wait! In create-next-app, a utils file is usually created or not. Let's see if we should create `lib/utils.ts`.
// Next.js templates with tailwindcss often create it. Let's make sure we have clsx and tailwind-merge used.
// Let's write the skeleton component simply:
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-bg-elevated/70 ${className}`}
      {...props}
    />
  );
}
