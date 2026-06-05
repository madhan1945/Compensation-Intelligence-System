interface CompInput {
  baseSalary: number;
  annualBonus?: number;
  signingBonus?: number;
  stockValue?: number;
  vestingYears?: number;
}

export function calculateTotalComp(input: CompInput): number {
  const {
    baseSalary,
    annualBonus = 0,
    signingBonus = 0,
    stockValue = 0,
    vestingYears = 4,
  } = input;

  // Signing bonus amortized over first year only
  const annualizedStock = vestingYears > 0 ? stockValue / vestingYears : 0;
  return baseSalary + annualBonus + signingBonus + annualizedStock;
}

export function formatCurrency(value: number, currency: string = "INR"): string {
  if (currency === "INR") {
    if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
    if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}
