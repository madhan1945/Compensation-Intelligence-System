// Company name normalization
const COMPANY_ALIASES: Record<string, string> = {
  "google llc": "Google",
  "alphabet": "Google",
  "alphabet inc": "Google",
  "meta platforms": "Meta",
  "facebook": "Meta",
  "microsoft corporation": "Microsoft",
  "amazon.com": "Amazon",
  "amazon web services": "Amazon",
  "aws": "Amazon",
  "infosys bpo": "Infosys",
  "wipro technologies": "Wipro",
  "tata consultancy services": "TCS",
  "tcs": "TCS",
};

export function normalizeCompanyName(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return COMPANY_ALIASES[lower] ?? raw.trim();
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Location normalization
const CITY_ALIASES: Record<string, string> = {
  "bangalore": "Bengaluru",
  "bengalore": "Bengaluru",
  "blr": "Bengaluru",
  "bombay": "Mumbai",
  "new delhi": "Delhi",
  "ncr": "Delhi",
  "gurgaon": "Gurugram",
};

export function normalizeCity(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return CITY_ALIASES[lower] ?? raw.trim();
}
