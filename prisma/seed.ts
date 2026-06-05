import { prisma } from "../lib/prisma";
import { normalizeCompanyName, normalizeCity, toSlug } from "../lib/normalize";
import { calculateTotalComp } from "../lib/tc-calculator";

const COMPANIES = [
  { name: "Google", industry: "Technology", headquarters: "Mountain View, CA", logoUrl: "https://logo.clearbit.com/google.com" },
  { name: "Microsoft", industry: "Technology", headquarters: "Redmond, WA", logoUrl: "https://logo.clearbit.com/microsoft.com" },
  { name: "Amazon", industry: "E-Commerce & Cloud", headquarters: "Seattle, WA", logoUrl: "https://logo.clearbit.com/amazon.com" },
  { name: "Flipkart", industry: "E-Commerce", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/flipkart.com" },
  { name: "Swiggy", industry: "Food Delivery", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/swiggy.com" },
  { name: "Zepto", industry: "Quick Commerce", headquarters: "Mumbai, India", logoUrl: "https://logo.clearbit.com/zepto.co" },
  { name: "PhonePe", industry: "Fintech", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/phonepe.com" },
  { name: "Razorpay", industry: "Fintech", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/razorpay.com" },
  { name: "Groww", industry: "Fintech", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/groww.in" },
  { name: "CRED", industry: "Fintech", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/cred.club" },
  { name: "Meesho", industry: "E-Commerce", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/meesho.com" },
  { name: "Infosys", industry: "IT Services", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/infosys.com" },
  { name: "TCS", industry: "IT Services", headquarters: "Mumbai, India", logoUrl: "https://logo.clearbit.com/tcs.com" },
  { name: "Wipro", industry: "IT Services", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/wipro.com" },
  { name: "Accenture", industry: "IT Consulting", headquarters: "Dublin, Ireland", logoUrl: "https://logo.clearbit.com/accenture.com" },
  { name: "Atlassian", industry: "Collaboration Software", headquarters: "Sydney, Australia", logoUrl: "https://logo.clearbit.com/atlassian.com" },
  { name: "Adobe", industry: "Software", headquarters: "San Jose, CA", logoUrl: "https://logo.clearbit.com/adobe.com" },
  { name: "Uber", industry: "Ride Hailing", headquarters: "San Francisco, CA", logoUrl: "https://logo.clearbit.com/uber.com" },
  { name: "Walmart Labs", industry: "Retail Tech", headquarters: "Bengaluru, India", logoUrl: "https://logo.clearbit.com/walmart.com" },
  { name: "JPMorgan", industry: "Investment Banking", headquarters: "New York, NY", logoUrl: "https://logo.clearbit.com/jpmorganchase.com" }
];

const JOB_TITLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Engineer",
  "DevOps Engineer",
  "Engineering Manager"
];

const CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Gurugram",
  "Mumbai",
  "Noida",
  "Chennai"
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function main() {
  console.log("Cleaning database...");
  await prisma.salaryEntry.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating companies...");
  const companyMap: Record<string, any> = {};

  for (const c of COMPANIES) {
    const canonical = normalizeCompanyName(c.name);
    const slug = toSlug(canonical);
    const company = await prisma.company.create({
      data: {
        name: c.name,
        canonicalName: canonical,
        slug: slug,
        industry: c.industry,
        headquarters: c.headquarters,
        logoUrl: c.logoUrl,
      }
    });
    companyMap[canonical] = company;
  }

  console.log("Generating 220 realistic salary entries...");
  const entriesData = [];

  for (let i = 0; i < 220; i++) {
    const companyName = getRandomItem(COMPANIES).name;
    const canonicalCompany = normalizeCompanyName(companyName);
    const company = companyMap[canonicalCompany];

    const jobTitle = getRandomItem(JOB_TITLES);
    const city = normalizeCity(getRandomItem(CITIES));
    const remote = Math.random() > 0.85;

    let level = "L3";
    let yearsOfExp = getRandomRange(0, 3);
    let baseSalary = 1200000;
    let annualBonus = 100000;
    let signingBonus = 100000;
    let stockValue = 1000000;
    let vestingYears = 4;
    let currency = "INR";

    // Adjust parameters based on company tier
    if (["Google", "Microsoft", "Amazon", "Uber", "Adobe", "Atlassian"].includes(canonicalCompany)) {
      // Tier 1 FAANG / Top Product
      const levelRoll = Math.random();
      if (levelRoll < 0.4) {
        level = "L3"; // Entry level
        yearsOfExp = getRandomRange(0, 2);
        baseSalary = getRandomRange(1600000, 2400000);
        annualBonus = getRandomRange(150000, 250000);
        signingBonus = Math.random() > 0.5 ? getRandomRange(100000, 300000) : 0;
        stockValue = getRandomRange(2000000, 4000000);
      } else if (levelRoll < 0.75) {
        level = "L4"; // SDE-2
        yearsOfExp = getRandomRange(2, 6);
        baseSalary = getRandomRange(2600000, 3800000);
        annualBonus = getRandomRange(250000, 450000);
        signingBonus = Math.random() > 0.4 ? getRandomRange(200000, 500000) : 0;
        stockValue = getRandomRange(4000000, 8000000);
      } else if (levelRoll < 0.95) {
        level = "L5"; // Senior SDE
        yearsOfExp = getRandomRange(6, 12);
        baseSalary = getRandomRange(4200000, 6000000);
        annualBonus = getRandomRange(400000, 750000);
        signingBonus = Math.random() > 0.3 ? getRandomRange(300000, 800000) : 0;
        stockValue = getRandomRange(8000000, 16000000);
      } else {
        level = "L6"; // Principal / Staff
        yearsOfExp = getRandomRange(10, 18);
        baseSalary = getRandomRange(6500000, 9500000);
        annualBonus = getRandomRange(800000, 1500000);
        signingBonus = Math.random() > 0.2 ? getRandomRange(500000, 1500000) : 0;
        stockValue = getRandomRange(16000000, 35000000);
      }
    } else if (["TCS", "Infosys", "Wipro", "Accenture", "JPMorgan"].includes(canonicalCompany)) {
      // Tier 3 IT Services & Services Financial
      const levelRoll = Math.random();
      if (levelRoll < 0.4) {
        level = "Associate";
        yearsOfExp = getRandomRange(0, 2);
        baseSalary = getRandomRange(360000, 550000);
        annualBonus = getRandomRange(10000, 30000);
        signingBonus = 0;
        stockValue = 0;
      } else if (levelRoll < 0.7) {
        level = "Analyst";
        yearsOfExp = getRandomRange(2, 5);
        baseSalary = getRandomRange(600000, 900000);
        annualBonus = getRandomRange(30000, 60000);
        signingBonus = 0;
        stockValue = 0;
      } else if (levelRoll < 0.9) {
        level = "Senior Engineer";
        yearsOfExp = getRandomRange(5, 9);
        baseSalary = getRandomRange(1000000, 1600000);
        annualBonus = getRandomRange(50000, 100000);
        signingBonus = 0;
        stockValue = 0;
      } else {
        level = "Lead";
        yearsOfExp = getRandomRange(8, 14);
        baseSalary = getRandomRange(1800000, 2800000);
        annualBonus = getRandomRange(100000, 200000);
        signingBonus = 0;
        stockValue = 0;
      }
    } else {
      // Tier 2 Indian Startups (Flipkart, Swiggy, Zepto, CRED, etc.)
      const levelRoll = Math.random();
      if (levelRoll < 0.4) {
        level = "SDE-1";
        yearsOfExp = getRandomRange(0, 2);
        baseSalary = getRandomRange(1200000, 2000000);
        annualBonus = getRandomRange(100000, 200000);
        signingBonus = Math.random() > 0.5 ? getRandomRange(50000, 150000) : 0;
        stockValue = getRandomRange(400000, 1000000);
      } else if (levelRoll < 0.75) {
        level = "SDE-2";
        yearsOfExp = getRandomRange(2, 5);
        baseSalary = getRandomRange(2200000, 3400000);
        annualBonus = getRandomRange(200000, 400000);
        signingBonus = Math.random() > 0.4 ? getRandomRange(100000, 300000) : 0;
        stockValue = getRandomRange(1500000, 3500000);
      } else if (levelRoll < 0.95) {
        level = "SDE-3";
        yearsOfExp = getRandomRange(5, 10);
        baseSalary = getRandomRange(3600000, 4800000);
        annualBonus = getRandomRange(300000, 600000);
        signingBonus = Math.random() > 0.3 ? getRandomRange(200000, 500000) : 0;
        stockValue = getRandomRange(4000000, 8000000);
      } else {
        level = "Staff";
        yearsOfExp = getRandomRange(8, 15);
        baseSalary = getRandomRange(5000000, 7500000);
        annualBonus = getRandomRange(500000, 1000000);
        signingBonus = Math.random() > 0.2 ? getRandomRange(300000, 800000) : 0;
        stockValue = getRandomRange(8000000, 15000000);
      }
    }

    // Occasional USD salary entries (e.g. for Google or Microsoft remote / relocated)
    if (Math.random() > 0.96 && ["Google", "Microsoft", "Amazon", "Uber"].includes(canonicalCompany)) {
      currency = "USD";
      baseSalary = Math.round(baseSalary / 80);
      annualBonus = Math.round(annualBonus / 80);
      signingBonus = Math.round(signingBonus / 80);
      stockValue = Math.round(stockValue / 80);
    }

    const totalComp = calculateTotalComp({
      baseSalary,
      annualBonus,
      signingBonus,
      stockValue,
      vestingYears
    });

    // Generate random date within the last 12 months
    const date = new Date();
    date.setMonth(date.getMonth() - getRandomRange(0, 11));
    date.setDate(getRandomRange(1, 28));

    entriesData.push({
      companyId: company.id,
      jobTitle,
      level,
      department: Math.random() > 0.3 ? "Engineering" : "Product",
      yearsOfExp,
      city,
      country: currency === "USD" ? "United States" : "India",
      remote,
      currency,
      baseSalary,
      annualBonus,
      signingBonus,
      stockValue,
      vestingYears,
      totalComp,
      verified: Math.random() > 0.4,
      anonymous: true,
      submittedAt: date,
      updatedAt: date
    });
  }

  // Batch insert entries
  console.log("Inserting entries in database...");
  await prisma.salaryEntry.createMany({
    data: entriesData
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
