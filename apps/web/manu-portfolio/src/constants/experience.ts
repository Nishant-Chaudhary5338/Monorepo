export interface ExperienceItem {
  ghost:      string;
  period:     string;
  role:       string;
  org:        string;
  body:       string;
  highlights: string[];
  tags:       string[];
}

export const experience: ExperienceItem[] = [
  {
    ghost:  "01",
    period: "APR 2024 — PRESENT",
    role:   "Digital Marketing Trainer",
    org:    "Delhi School of Internet Marketing",
    body:   "Mentor 1000+ aspiring marketers in SEO, paid ads, email automation, and analytics — blending live projects with practical curriculum.",
    highlights: [
      "Curriculum design across paid acquisition modules",
      "Live project supervision for student cohorts",
      "Career guidance for transitioning marketers",
    ],
    tags: ["Training", "Curriculum", "SEO", "Paid Ads"],
  },
  {
    ghost:  "02",
    period: "JAN 2024 — MAY 2025 · 1 YR 5 MOS",
    role:   "Digital Growth Consultant",
    org:    "Body & Butter",
    body:   "Scaled a clean skincare DTC brand through performance marketing, influencer outreach, and email automation. Drove revenue growth and built a loyal community.",
    highlights: [
      "Meta Ads + Google campaigns optimisation",
      "Website conversion flow improvements",
      "Targeted influencer collaborations",
      "Email marketing automation",
      "Customer journey mapping",
    ],
    tags: ["DTC", "Skincare", "Meta Ads", "Email", "CRO"],
  },
  {
    ghost:  "03",
    period: "MAY 2022 — MAY 2025 · 3 YRS 1 MO",
    role:   "International Admissions & Digital Analytics Officer",
    org:    "Leeds Beckett University",
    body:   "Ran global lead generation campaigns using Google Ad Manager, Meta Ads, and affiliate networks. Built end-to-end UTM tracking systems that traced ad performance through the entire student journey.",
    highlights: [
      "A/B-tested landing pages at scale",
      "Cross-functional analytics enablement workshops",
      "End-to-end UTM tracking architecture",
      "Performance reporting for leadership",
    ],
    tags: ["Lead Gen", "Higher Ed", "UTM Architecture", "A/B Testing"],
  },
];
