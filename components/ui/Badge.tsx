import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: string;
}

export function Badge({ level, className, ...props }: BadgeProps) {
  const lvl = level.toLowerCase();
  
  let colorClass = "bg-bg-elevated border-bg-border text-text-secondary"; // default

  if (lvl.includes("l3") || lvl.includes("sde-1") || lvl.includes("associate")) {
    colorClass = "bg-bg-elevated border-bg-border text-text-secondary";
  } else if (lvl.includes("l4") || lvl.includes("sde-2") || lvl.includes("analyst")) {
    colorClass = "bg-accent-blue/10 border-accent-blue/20 text-accent-blue";
  } else if (lvl.includes("l5") || lvl.includes("sde-3") || lvl.includes("senior")) {
    colorClass = "bg-accent-gold/10 border-accent-gold/20 text-accent-gold";
  } else if (lvl.includes("l6") || lvl.includes("staff") || lvl.includes("principal") || lvl.includes("lead")) {
    colorClass = "bg-accent-green/10 border-accent-green/20 text-accent-green";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none",
        colorClass,
        className
      )}
      {...props}
    >
      {level}
    </span>
  );
}
