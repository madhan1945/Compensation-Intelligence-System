"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

interface CompanyLogoProps {
  logoUrl?: string | null;
  name: string;
  className?: string;
}

export function CompanyLogo({ logoUrl, name, className = "h-10 w-10" }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  if (!logoUrl || error) {
    return <Building2 className={`${className} text-text-secondary`} />;
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      onError={() => setError(true)}
      className={`${className} object-contain`}
    />
  );
}
