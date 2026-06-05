# Competitive Research: Compensation Intelligence Platforms

An analysis of top compensation platforms to guide the design and features of **CompensationIQ**.

## Feature Comparison Table

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? (Yes/No/Partial) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Salary by role + level** | Yes | Yes | Partial | Partial | **Yes** (Enforced in database and filters) |
| **TC breakdown (base/bonus/equity)** | Yes | Yes | Partial | Partial | **Yes** (Base, bonus, signing, and stock) |
| **Location normalization** | Yes | Yes | Yes | Yes | **Yes** (City normalization utility) |
| **Company pages** | Yes | Yes | Yes | Yes | **Yes** (With charts & recent entries) |
| **YoE filtering** | Yes | Yes | Yes | Yes | **Yes** (Interactive filters in UI) |
| **Side-by-side comparison** | Yes | Partial | No | No | **Yes** (Compare 2-3 companies) |
| **Salary trend charts** | Yes | Partial | Yes | Yes | **Yes** (TC by YoE and level charts) |
| **Anonymous submission** | Yes | Yes | Yes | Yes | **Yes** (Default mode for all users) |
| **Verification system** | Yes | Partial | Partial | Partial | **No** (Deferred to future roadmap) |
| **Search autocomplete** | Yes | Yes | Yes | Yes | **Yes** (Autocomplete for company select) |

---

## Key Insight: Why Levels Matter More Than Job Titles

In the modern tech industry, **job titles are highly misleading**. A "Senior Software Engineer" at one company can mean something completely different at another, both in terms of responsibilities and compensation.

### The Equivalency Gap
- **Google L5** (Senior Software Engineer) has an average total compensation of ~₹65L - ₹90L+ in India.
- **TCS Senior Consultant / Senior Engineer** has an average salary of ~₹15L - ₹22L in India.
Both carry the word "Senior" in their titles, but the compensation difference is **3x to 4x**.

### Structural Levels (e.g., L3 to L6)
To address this, leading tech companies use structured engineering levels (e.g., L3/SDE-1, L4/SDE-2, L5/Senior, L6/Staff). 
- Mapping compensation to these levels allows job seekers to compare their offers accurately across peer companies (e.g., comparing Google L4 with Microsoft L61 or Amazon L5).
- Standardizing by level, rather than job title, removes the noise and surfaces the true market rate for a specific level of scope and impact.
- Our platform **enforces levels** on submission and offers filtering based on normalized level groups (L3, L4, L5, L6) to provide high-fidelity insights.
