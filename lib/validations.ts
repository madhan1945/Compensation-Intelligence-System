import { z } from "zod";

export const SalarySubmissionSchema = z.object({
  companyName: z.string().min(1, "Company name required").max(100),
  jobTitle: z.string().min(1, "Job title required").max(100),
  level: z.string().min(1, "Level required").max(20),
  department: z.string().optional(),
  yearsOfExp: z.number().int().min(0).max(50),
  city: z.string().min(1).max(100),
  country: z.string().default("India"),
  remote: z.boolean().default(false),
  currency: z.enum(["INR", "USD"]).default("INR"),
  baseSalary: z.number().positive("Base salary must be positive"),
  annualBonus: z.number().min(0).default(0),
  signingBonus: z.number().min(0).default(0),
  stockValue: z.number().min(0).default(0),
  vestingYears: z.number().int().min(1).max(10).default(4),
  anonymous: z.boolean().default(true),
});

export const SalaryFilterSchema = z.object({
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  level: z.string().optional(),
  city: z.string().optional(),
  minYoe: z.coerce.number().optional(),
  maxYoe: z.coerce.number().optional(),
  minTc: z.coerce.number().optional(),
  maxTc: z.coerce.number().optional(),
  currency: z.enum(["INR", "USD"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["totalComp", "baseSalary", "submittedAt", "yearsOfExp"]).default("totalComp"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type SalarySubmissionInput = z.infer<typeof SalarySubmissionSchema>;
export type SalaryFilterInput = z.infer<typeof SalaryFilterSchema>;
