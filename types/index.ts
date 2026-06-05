export interface SalaryEntry {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  jobTitle: string;
  level: string;
  department?: string | null;
  yearsOfExp: number;
  city: string;
  country: string;
  remote: boolean;
  currency: string;
  baseSalary: number;
  annualBonus: number;
  signingBonus: number;
  stockValue: number;
  vestingYears: number;
  totalComp: number;
  verified: boolean;
  anonymous: boolean;
  submittedAt: string | Date;
}

export interface Company {
  id: string;
  name: string;
  canonicalName: string;
  slug: string;
  industry?: string | null;
  headquarters?: string | null;
  logoUrl?: string | null;
  createdAt: string | Date;
}
