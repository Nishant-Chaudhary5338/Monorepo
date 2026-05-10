export interface CapabilityItem {
  name:  string;
  years: string;
}

export interface CapabilityGroup {
  category: string;
  items:    CapabilityItem[];
}

export const capabilities: CapabilityGroup[] = [
  {
    category: "Paid Acquisition",
    items: [
      { name: "Google Ads",                       years: "5+ yrs" },
      { name: "Meta Ads (Facebook + Instagram)",  years: "5+ yrs" },
      { name: "LinkedIn Ads",                     years: "4 yrs"  },
      { name: "Affiliate Networks",               years: "3 yrs"  },
    ],
  },
  {
    category: "Analytics & Attribution",
    items: [
      { name: "Google Analytics 4",               years: "5+ yrs" },
      { name: "Meta Business Suite Insights",     years: "5+ yrs" },
      { name: "Search Console",                   years: "5+ yrs" },
      { name: "End-to-end UTM Architecture",      years: "3 yrs"  },
    ],
  },
  {
    category: "SEO",
    items: [
      { name: "Keyword Research & On-page Optimisation", years: "5+ yrs" },
      { name: "Backlinking & Off-page Strategy",         years: "4 yrs"  },
      { name: "Technical SEO",                           years: "3 yrs"  },
    ],
  },
  {
    category: "Email & Automation",
    items: [
      { name: "Brevo (Sendinblue)", years: "3 yrs" },
      { name: "Mailchimp",          years: "4 yrs" },
      { name: "ActiveCampaign",     years: "2 yrs" },
    ],
  },
  {
    category: "Strategy & CRO",
    items: [
      { name: "Landing Page A/B Testing", years: "4 yrs" },
      { name: "Funnel Optimisation",      years: "4 yrs" },
      { name: "Customer Journey Mapping", years: "3 yrs" },
    ],
  },
];

export const capabilitiesCol1 = capabilities.slice(0, 3);
export const capabilitiesCol2 = capabilities.slice(3);
