// ─── Personal ─────────────────────────────────────────────
export const personal = {
  name: "Nidhi Chhimwal",
  firstName: "Nidhi",
  title: "Senior UI/UX Designer",
  subtitle: "& Illustrator",
  location: "Gurugram, India",
  email: "nidhi.doodles@gmail.com",
  phone: "8168580423",
  behance: "https://www.behance.net/nidhichhim6d3d",
  tagline:
    "5+ years bridging research, strategy, and visual craft — crafting experiences that are intuitive, beautiful, and business-driven.",
  bio: "I'm a multidisciplinary senior designer who lives at the intersection of UX strategy and visual artistry. Currently shaping enterprise digital products at Samsung Electronics, I combine rigorous user research with pixel-perfect craft to design experiences that feel inevitable. Beyond screens, I'm an illustrator, brand designer, and motion artist who believes every medium is a chance to communicate something meaningful.",
  available: true,
  resumeUrl: "/Nidhi Chhimwal — Resume 2026.pdf",
};

// ─── Hero role slider ──────────────────────────────────────
export const heroRoles = [
  "Senior UI/UX Designer",
  "UX Researcher & Strategist",
  "Illustrator & Brand Designer",
];

// ─── Stats ─────────────────────────────────────────────────
export const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 6, suffix: "", label: "Live Products Shipped" },
  { value: 50, suffix: "K+", label: "Users Impacted" },
  { value: 3, suffix: "", label: "Enterprise Companies" },
];

// ─── Skills ────────────────────────────────────────────────
export const skillCategories = [
  {
    id: "ux",
    label: "UX & Product Design",
    icon: "◎",
    color: "purple",
    description: "End-to-end product thinking from research to pixel-perfect handoff",
    skills: [
      "Design Thinking",
      "Information Architecture",
      "User Flows & Journey Mapping",
      "Wireframing",
      "High-Fidelity Prototyping",
      "Design Systems",
      "Interaction Design",
      "Responsive Design",
      "Accessibility (WCAG 2.1)",
      "Design QA & Handoff",
    ],
  },
  {
    id: "research",
    label: "UX Research",
    icon: "🔬",
    color: "teal",
    description: "Evidence-based decisions through rigorous mixed-methods research",
    skills: [
      "Moderated Usability Testing",
      "User Interviews",
      "Affinity Mapping",
      "Persona Development",
      "A/B Testing",
      "Card Sorting",
      "Tree Testing",
      "Heuristic Evaluation",
      "Competitive Analysis",
      "Analytics & Heat Maps",
    ],
  },
  {
    id: "visual",
    label: "Visual & Creative",
    icon: "✦",
    color: "gold",
    description: "Brand-level craft across illustration, motion, and editorial design",
    skills: [
      "Illustration & Sketching",
      "Typography & Brand Identity",
      "Motion Graphics & 2D Animation",
      "Packaging Design",
      "Editorial & Publication Design",
      "Social Media Design",
      "Environmental / Mural Art",
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    icon: "⬡",
    color: "rose",
    description: "Industry-standard and emerging design tooling",
    skills: [
      "Figma (Advanced)",
      "Figma Variables & Tokens",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Procreate",
      "After Effects",
      "Adobe InDesign",
      "Miro / FigJam",
      "ProtoPie",
      "Storybook",
    ],
  },
  {
    id: "ai",
    label: "AI-Augmented Design",
    icon: "⚡",
    color: "amber",
    description: "Leveraging AI tools to accelerate research, ideation, and production",
    skills: [
      "Midjourney (Mood Boards)",
      "ChatGPT (Research Synthesis)",
      "AI-Assisted Prototyping",
      "Design Tokens (W3C)",
      "Prompt Engineering for Design",
    ],
  },
];

// ─── Experience ────────────────────────────────────────────
export const experiences = [
  {
    num: "01",
    role: "Senior Associate — UI/UX Design",
    company: "Samsung Electronics",
    period: "Dec 2023 — Present",
    location: "Gurugram, India",
    current: true,
    accentColor: "#9d72ff",
    gradientFrom: "#1a1035",
    gradientTo: "#0d0920",
    impact: [
      { value: "3+", label: "Enterprise Products" },
      { value: "DS", label: "Design System Built" },
      { value: "Global", label: "QA Teams Served" },
    ],
    highlights: [
      "Designed TVPlus Test Suite — enterprise QA automation UX adopted by Samsung's global content operations teams",
      "Built the Samsung Design System in Figma (tokens, components, variants) adopted across 3+ internal products",
      "Led end-to-end UX for Samsung Research Centre's intranet portal and LMS",
      "Conducted user research, usability testing, and journey mapping to drive evidence-based design decisions",
      "Partnered cross-functionally with product, engineering, and global brand teams",
    ],
    tags: ["Figma", "Design Systems", "Enterprise UX", "User Research", "Storybook"],
  },
  {
    num: "02",
    role: "UI/UX Designer",
    company: "Safex Chemicals India Ltd.",
    period: "Jun 2022 — Dec 2023",
    location: "Delhi, India",
    current: false,
    accentColor: "#f5a623",
    gradientFrom: "#1a1500",
    gradientTo: "#0f0d00",
    impact: [
      { value: "15K+", label: "Active Users" },
      { value: "2", label: "Apps Shipped" },
      { value: "5+", label: "Sites Launched" },
    ],
    highlights: [
      "Designed Golden Farms — a live B2B e-commerce app for agricultural chemicals now available on Play Store & App Store",
      "Designed Safex LMS and Admin Portal — enterprise training and B2B order management platform",
      "Launched 5+ brand websites with enhanced UX, visual identity, and conversion-focused design",
      "Produced motion graphics and brand identity systems for product launches",
    ],
    tags: ["Mobile UX", "B2B App", "LMS", "Admin Portal", "Brand Identity"],
  },
  {
    num: "03",
    role: "Graphic Visualizer",
    company: "Liberty Shoes Pvt. Ltd.",
    period: "Apr 2021 — Mar 2022",
    location: "Delhi, India",
    current: false,
    accentColor: "#ff6b9d",
    gradientFrom: "#1a0a18",
    gradientTo: "#0f060f",
    impact: [
      { value: "+25%", label: "Engagement Boost" },
      { value: "Multi", label: "Brand Campaigns" },
      { value: "GIF", label: "& Motion Assets" },
    ],
    highlights: [
      "Created brand-aligned illustrations, GIFs, banners, and marketing visuals for digital campaigns",
      "Drove a 25% boost in engagement through high-impact campaign creatives",
      "Managed multiple campaign tracks under tight deadlines",
    ],
    tags: ["Illustration", "Campaign Design", "Motion", "Photoshop", "Illustrator"],
  },
  {
    num: "04",
    role: "Graphic Designer",
    company: "Mediamix",
    period: "Mar 2020 — Jul 2020",
    location: "Gurugram, India",
    current: false,
    accentColor: "#4cc9f0",
    gradientFrom: "#001520",
    gradientTo: "#000d15",
    impact: [
      { value: "Multi", label: "Brand Accounts" },
      { value: "Social", label: "Media Systems" },
      { value: "Reuse", label: "Template Library" },
    ],
    highlights: [
      "Designed social media creatives and managed accounts for multiple brand clients",
      "Built a reusable design template library to improve consistency and production efficiency",
    ],
    tags: ["Social Media", "Illustrator", "Procreate", "Photoshop", "InDesign"],
  },
];

// ─── UX Process ────────────────────────────────────────────
export const processSteps = [
  {
    num: "01",
    icon: "🔍",
    title: "Discover",
    tagline: "Listen before designing",
    description:
      "Immersive user research — interviews, surveys, competitive analysis, and empathy mapping to uncover real user needs and unspoken pain points.",
    deliverables: ["User Interviews", "Competitive Analysis", "Empathy Maps", "Research Synthesis"],
  },
  {
    num: "02",
    icon: "🎯",
    title: "Define",
    tagline: "Frame the right problem",
    description:
      "Translating research insights into clear problem statements, user journeys, information architecture, and a strategic design brief.",
    deliverables: ["User Journeys", "Information Architecture", "Problem Statements", "Design Brief"],
  },
  {
    num: "03",
    icon: "✏️",
    title: "Design",
    tagline: "From rough to refined",
    description:
      "Rapid ideation through sketches and wireframes, evolving into high-fidelity prototypes that balance visual beauty with functional clarity.",
    deliverables: ["Wireframes", "Hi-fi Prototypes", "Design System", "Interaction Specs"],
  },
  {
    num: "04",
    icon: "🚀",
    title: "Deliver",
    tagline: "Test, iterate, ship",
    description:
      "Usability testing, A/B validation, design QA, and developer handoff — ensuring the final product stays true to the original vision.",
    deliverables: ["Usability Testing", "Design QA", "Dev Handoff", "Iteration Reports"],
  },
];

// ─── Project types ─────────────────────────────────────────
export type CaseStudyLink = {
  live?: string;
  storybook?: string;
  appStore?: string;
  playStore?: string;
  behance?: string;
  pdf?: string;
  sites?: { label: string; url: string }[];
};

export type CaseStudyOutcome = {
  metric: string;
  label: string;
};

export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
  full?: boolean;   // landscape banner — spans full width, objectFit: contain
  mobile?: boolean; // portrait mobile screenshot — shown in horizontal scrollable strip
};

export type Portal = {
  id: string;
  title: string;
  subtitle: string;
  context: string;
  problem: string;
  painPoints: string[];
  solutionHighlights: string[];
  outcomes: CaseStudyOutcome[];
  images: CaseStudyImage[];
};

export type CaseStudy = {
  myRole: string;
  timeline: string;
  tools: string[];
  teamNote?: string;
  overview: string;
  problem: string;
  painPoints: string[];
  processHighlights: { phase: string; what: string }[];
  solutionHighlights: string[];
  portals?: Portal[];
  outcomes: CaseStudyOutcome[];
  images: CaseStudyImage[];
  links: CaseStudyLink;
  disclaimer?: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  featured: boolean;
  company: string;
  badge?: string;
  year?: string;
  projectType: "enterprise" | "creative" | "freelance";
  caseStudy?: CaseStudy;
};

// ─── Work / Projects ───────────────────────────────────────
export const projects: Project[] = [
  // ── 1. Golden Farms ───────────────────────────────────────
  {
    id: "golden-farms",
    title: "Golden Farms",
    projectType: "enterprise",
    year: "2022–2023",
    category: "Mobile App · B2B UX",
    description:
      "A live B2B e-commerce app on Play Store & App Store, empowering 15K+ agricultural distributors with digital ordering, permit verification, and real-time inventory — designed for rural India.",
    tags: ["Mobile UX", "B2B", "Android & iOS", "Research-led", "Accessibility"],
    gradient: "linear-gradient(135deg, #0d1a06 0%, #1a3500 50%, #0d1a06 100%)",
    accentColor: "#6dca3e",
    featured: true,
    company: "Safex Chemicals",
    badge: "Live on Play Store & App Store",
    caseStudy: {
      myRole: "Lead UX Designer & Researcher",
      timeline: "Jun 2022 — Dec 2023",
      tools: ["Figma", "FigJam", "Miro", "Google Analytics", "After Effects"],
      teamNote: "Cross-functional team: 2 developers, 1 product manager, 1 QA engineer",
      overview:
        "Golden Farms is Safex Chemicals' first B2B e-commerce platform — live on Play Store and App Store, serving 15K+ agricultural distributors across India. I led the end-to-end UX: the distributor mobile app, an internal ops admin portal, and the complete launch brand system.",
      problem:
        "Safex's entire B2B distribution ran on phone calls and WhatsApp — no digital ordering, no onboarding structure, and zero ops visibility.",
      painPoints: [
        "Manual ordering via phone/WhatsApp — errors, delays, no order history",
        "Complex KYC onboarding with business docs, govt licenses, and shop photos",
        "Ops team verifying documents manually with no dashboard or approval workflow",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Field research with 12 distributors across UP and Haryana — in-person interviews, contextual inquiry, and journey mapping across the full ordering lifecycle.",
        },
        {
          phase: "Define",
          what: "3 personas (rural retailer, urban distributor, ops admin), 5 core flows (onboarding, catalog, ordering, permit upload, tracking), and a prioritized feature matrix.",
        },
        {
          phase: "Design",
          what: "14 wireframe rounds across the app, admin portal, and bilingual onboarding — 48dp touch targets, camera-integrated permit upload, and a parallel admin verification flow.",
        },
        {
          phase: "Deliver",
          what: "Usability testing with 8 distributors pre-launch. 120+ screen Figma handoff + admin portal specs + packaging and brand launch kit.",
        },
      ],
      solutionHighlights: [],
      portals: [
        {
          id: "gf-app",
          title: "Distributor App",
          subtitle: "B2B Mobile Ordering Platform",
          context: "Live on Play Store (4.2★) and App Store (5.0★) — used by 15K+ agricultural distributors and retailers across India.",
          problem: "Distributors had no way to register, upload compliance documents, or place orders digitally.",
          painPoints: [
            "Multi-step KYC: mobile OTP → referral code → business docs + shop photos",
            "Browse & cart allowed before approval — orders gated until admin verified",
            "Bilingual (Hindi/English) for rural, low-literacy users across Tier-2/3 cities",
          ],
          solutionHighlights: [
            "5-step onboarding with pending-approval browse mode so users stay engaged",
            "Camera-integrated permit + licence upload (govt docs, existing shop images)",
            "On-the-fly bilingual toggle (Hindi ↔ English) without re-navigation",
            "One-tap reorder + real-time delivery tracking with push notifications",
          ],
          outcomes: [
            { metric: "15K+", label: "Active distributors" },
            { metric: "80%", label: "Fewer manual order calls" },
            { metric: "4.2★", label: "Play Store rating" },
            { metric: "Live", label: "Nidhi credited in-app" },
          ],
          images: [
            { src: "/images/golden-farms/playstore.webp",       alt: "Golden Farms — Play Store listing", caption: "Play Store · Agcare Technologies", full: true },
            { src: "/images/golden-farms/appstore.webp",        alt: "Golden Farms — App Store listing",  caption: "App Store · Utility",           full: true },
            { src: "/images/golden-farms/language.webp",       alt: "Language selection — English / Hindi / Bangla", caption: "Onboarding · Language",      mobile: true },
            { src: "/images/golden-farms/login.webp",          alt: "OTP-based mobile login",                        caption: "Authentication · OTP Login", mobile: true },
            { src: "/images/golden-farms/home.webp",           alt: "Home dashboard — ledger, quick actions",         caption: "Dashboard · Home",           mobile: true },
            { src: "/images/golden-farms/products.webp",       alt: "Product catalog with category filters",          caption: "Catalog · All Products",     mobile: true },
            { src: "/images/golden-farms/product-detail.webp", alt: "Product detail — dosage and pricing",            caption: "Product Detail",             mobile: true },
          ],
        },
        {
          id: "gf-admin",
          title: "Admin Portal & Brand System",
          subtitle: "Ops Management + Launch Identity",
          context: "Internal tool for Safex ops team — KYC verification, order management, stock and warehouse tracking. Plus the complete brand system for go-to-market launch.",
          problem: "The ops team reviewed KYC documents case by case, tracked orders in spreadsheets, and had zero launch collateral for a national rollout.",
          painPoints: [
            "No KYC approval dashboard — distributor docs verified manually, case by case",
            "Stock, warehouse, and order fulfilment tracked across spreadsheets",
            "Zero brand collateral for a national product launch",
          ],
          solutionHighlights: [
            "Admin portal: customer verification queue, order management table, stock + warehouse tracking",
            "Product packaging design for the Golden Farms brand",
            "Launch collateral: branded calendars, merchandise (T-shirts, caps), training PPTs + videos",
            "Product launch presentations for internal and channel partner stakeholders",
          ],
          outcomes: [
            { metric: "Live",      label: "Ops team fully onboarded" },
            { metric: "Shipped",   label: "Packaging design delivered" },
            { metric: "Complete",  label: "Full launch kit" },
          ],
          images: [],
        },
      ],
      outcomes: [
        { metric: "15K+", label: "Active users on Play Store & App Store" },
        { metric: "80%",  label: "Reduction in manual order calls" },
        { metric: "4.2★", label: "Average app store rating" },
        { metric: "Live",  label: "Nidhi's name credited inside the app" },
      ],
      images: [],
      links: {
        playStore: "https://play.google.com/store/apps/details?id=com.safexchemicals.goldenfarms",
        appStore: "https://apps.apple.com/in/app/golden-farms/id6443530676",
      },
    },
  },

  // ── 2. TVPlus Test Suite ───────────────────────────────────
  {
    id: "tvplus",
    title: "TVPlus Test Suite",
    projectType: "enterprise",
    year: "2023–Present",
    category: "Enterprise UX · QA Automation Platform",
    description:
      "Built from scratch — an end-to-end QA automation platform eliminating 100% of manual content testing effort for Samsung's TVPlus streaming service. Used by global QA engineers, PMs, and managers. Achieving 98.5% accuracy in pilot.",
    tags: ["Enterprise UX", "QA Automation", "Dashboard", "Scheduling", "AI Chatbot"],
    gradient: "linear-gradient(135deg, #0d0a2e 0%, #1a1060 50%, #0d0a2e 100%)",
    accentColor: "#9d72ff",
    featured: false,
    company: "Samsung Electronics",
    badge: "98.5% Accuracy in Pilot",
    caseStudy: {
      myRole: "Senior UX Designer (0→1)",
      timeline: "Dec 2023 — Present",
      tools: ["Adobe XD", "FigJam", "Miro", "ProtoPie"],
      teamNote: "Samsung global QA engineering, content ops, and product teams",
      overview:
        "Built from scratch — automates 100% of manual content QA for Samsung's TVPlus streaming service. QA engineers, PMs, and managers across global teams use it to schedule, monitor, and review automated test runs. 98.5% accuracy in pilot.",
      problem:
        "All content QA was manual — engineers watched content on physical TVs, country by country, device by device. No scheduling, no status view, no scale.",
      painPoints: [
        "100% manual QA — no automation, no scheduling, one test at a time",
        "No status visibility — QA leads couldn't see what was passing, failing, or queued",
        "Non-engineers had no way to trigger tests or check assets without going through QA",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Mapped the full manual QA workflow with global engineers and content ops. Found the scheduling flow as the core design challenge — 6 interdependent selection dimensions.",
        },
        {
          phase: "Define",
          what: "3 user types: QA Engineer, PM/Manager, Admin. Full platform IA: Dashboard → Schedule → Monitor → Jobs → Admin. Scheduling and dashboard prioritised for Phase 1.",
        },
        {
          phase: "Design",
          what: "6-step progressive stepper for scheduling — each step locks on confirm, live summary panel tracks selections. Drag-drop dashboard personalised per role.",
        },
        {
          phase: "Deliver",
          what: "Iterated scheduling flow through prototype rounds with QA team. Added AI chatbot for PM/manager quick tasks. Full handoff with annotated specs.",
        },
      ],
      solutionHighlights: [
        "Dashboard: 7 KPI cards + drag-drop widgets (Server Health, Issue Trends, Ageing Hours, Live & VOD ring charts)",
        "6-step scheduler: Country → Content Type → Assets → Devices → QC Category → Test Cases → Submit",
        "AI chatbot: enter a service ID → get asset status + schedule a test in one step",
        "3 role levels: QA Engineer (full access), PM/Manager (chatbot + status), Admin (full + audit)",
      ],
      outcomes: [
        { metric: "98.5%", label: "Accuracy in pilot" },
        { metric: "↓100%", label: "Manual TV QA effort" },
        { metric: "Global", label: "Teams using it" },
        { metric: "4",     label: "Platforms expanding to" },
      ],
      images: [
        { src: "/images/tvplus/dashboard.webp",   alt: "Monitoring dashboard",   caption: "Dashboard",    full: true },
        { src: "/images/tvplus/scheduling.webp", alt: "6-step scheduling flow", caption: "Schedule Test" },
        { src: "/images/tvplus/job-status.webp", alt: "Test run job status",    caption: "Job Status" },
      ],
      links: {},
      disclaimer:
        "Screens are recreated mockups. Samsung product information is confidential.",
    },
  },

  // ── 3. Samsung Design System ───────────────────────────────
  {
    id: "samsung-ds",
    title: "Samsung Design System",
    projectType: "enterprise",
    year: "2024–Present",
    category: "Design System · Figma + Storybook",
    description:
      "Two design systems built for Samsung — a generic enterprise component library (43 components, live Storybook) and Signal & Flame, a TVPlus-specific brand system designed for the rebranding of Samsung's streaming platform across multiple portals.",
    tags: ["Design System", "Figma Tokens", "Storybook", "TVPlus", "Brand System"],
    gradient: "linear-gradient(135deg, #0a1520 0%, #0f2540 50%, #0a1520 100%)",
    accentColor: "#4cc9f0",
    featured: false,
    company: "Samsung Electronics",
    badge: "2 Design Systems · Live Storybook",
    caseStudy: {
      myRole: "Lead Design System Designer (Figma)",
      timeline: "Jan 2024 — Present",
      tools: ["Adobe XD", "Figma Variables", "Storybook", "Radix UI", "Tailwind CSS v4"],
      teamNote: "Design: Nidhi Chhimwal | Engineering & Storybook: in-house dev team",
      overview:
        "Two design systems for Samsung — a 43-component enterprise library used across internal products, and Signal & Flame, the TVPlus brand system built for the platform's rebranding across portals.",
      problem:
        "Teams designed in isolation with no shared tokens or components, and TVPlus had no visual identity to unify its growing suite of portals.",
      painPoints: [
        "12 conflicting color systems across internal products — all hardcoded, no token layer",
        "Every team rebuilt the same components from scratch — Button, Modal, DataTable, over and over",
        "TVPlus rebrand underway with no visual language to anchor it across portals",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Audited 3 Samsung product UIs — 180+ component variants, 12 button styles. TVPlus brand workshops surfaced the emotional core: trust + energy → Signal & Flame.",
        },
        {
          phase: "Define",
          what: "4-tier token taxonomy (primitive → semantic → component → theme). Signal Blue + Flame Orange defined as the two-color TVPlus identity with full 11-step scales.",
        },
        {
          phase: "Design",
          what: "43 Figma components with 5-state variants and dark/light mode. Signal & Flame color scales, accessible pairings, and usage guidelines for all TVPlus surfaces.",
        },
        {
          phase: "Deliver",
          what: "Live Storybook with copy-paste code for all 43 components. Signal & Flame shipped as its own Storybook chapter with swatches, ratios, and gradient demos.",
        },
      ],
      solutionHighlights: [],
      portals: [
        {
          id: "generic-ds",
          title: "Generic Design System",
          subtitle: "Enterprise Component Library · 43 Components",
          context: "Token-driven component library for Samsung internal products — Radix UI + Tailwind CSS v4, full dark/light mode, live Storybook.",
          problem:
            "Every internal team was building the same components independently, with hardcoded values and no shared source of truth.",
          painPoints: [
            "180+ component variants across 3 products — almost zero shared code",
            "No token layer — any color change meant hunting every hardcoded value",
            "Handoff was Figma screenshots — devs guessed spacing, states, and shadows",
          ],
          solutionHighlights: [
            "43 components: Button, Input, DataTable, AutoForm, Dialog, Command palette, and more",
            "10 token categories — Colors, Typography, Spacing, Shadows, Motion, and more",
            "DataTable: sorting, filtering, pagination, inline editing, CSV export, RBAC — via feature flags",
            "Dark/light mode via CSS variable swap — zero component-level changes needed",
          ],
          outcomes: [
            { metric: "43",   label: "Components in Phase 1" },
            { metric: "10",   label: "Token categories" },
            { metric: "↓40%", label: "Design-to-dev handoff time" },
            { metric: "Live", label: "Storybook deployed" },
          ],
          images: [
            { src: "/images/samsung-ds/token-overview.webp", alt: "Design token system in Figma Variables", caption: "Token Architecture" },
            { src: "/images/samsung-ds/components.webp",     alt: "Component library in Storybook",         caption: "Component Library" },
            { src: "/images/samsung-ds/input.webp",          alt: "Input component variants and states",    caption: "Input Component" },
            { src: "/images/samsung-ds/storybook.webp",      alt: "Live Storybook documentation",           caption: "Live Storybook" },
          ],
        },
        {
          id: "signal-flame",
          title: "Signal & Flame",
          subtitle: "TVPlus Brand System · Streaming Platform Rebrand",
          context: "Brand system for the TVPlus rebranding — Signal Blue + Flame Orange across all portals and apps.",
          problem:
            "TVPlus was expanding with no visual identity — every team used Samsung's corporate blue differently across portals.",
          painPoints: [
            "No brand color scale — teams couldn't build hover states or accessible variants",
            "Consumer and internal portal surfaces looked like different products",
            "Zero accessibility documentation — contrast ratios never checked",
          ],
          solutionHighlights: [
            "Signal Blue (#1428A0) — primary for trust, clarity, action. Full 11-step scale.",
            "Flame Orange (#F4511E) — secondary for energy and warmth. Full 11-step scale.",
            "6 accessible pairings — WCAG AA/AAA ratios documented and shipped",
            "Gradient system + Storybook chapter with swatches and accessibility matrix",
          ],
          outcomes: [
            { metric: "2",    label: "Brand colors, full scales" },
            { metric: "6",    label: "WCAG-tested color pairings" },
            { metric: "Multi-portal", label: "TVPlus surfaces covered" },
            { metric: "Live", label: "Signal & Flame in Storybook" },
          ],
          images: [
            { src: "/images/samsung-ds/signal-flame.webp",     alt: "Signal Blue + Flame Orange brand story", caption: "Signal & Flame" },
            { src: "/images/samsung-ds/color-scales.webp",     alt: "11-step color scales",                   caption: "Color Scales" },
            { src: "/images/samsung-ds/dark-light.webp",       alt: "Dark and light mode token swap",         caption: "Dark / Light Mode" },
            { src: "/images/samsung-ds/samsung-ds:accessible-pairs.webp", alt: "WCAG accessibility pairing matrix", caption: "Accessibility" },
          ],
        },
      ],
      outcomes: [
        { metric: "43",   label: "Components shipped" },
        { metric: "2",    label: "Design systems (generic + TVPlus brand)" },
        { metric: "↓40%", label: "Design-to-dev handoff time" },
        { metric: "Live", label: "Storybook documented and deployed" },
      ],
      images: [],
      links: {
        storybook: "https://fluffy-churros-b798ad.netlify.app/?path=/docs/components-button--docs",
      },
      disclaimer:
        "Screens recreated to protect confidential information. Storybook deployed with real components.",
    },
  },

  // ── 4. Safex Enterprise Portals ───────────────────────────
  {
    id: "safex-lms",
    title: "Safex Enterprise Portals",
    projectType: "enterprise",
    year: "2022–2023",
    category: "Enterprise UX · Web Platform",
    description:
      "Two distinct enterprise platforms designed from the ground up — SafeXLMS for company-wide training and compliance, and a custom SAP Web Interface bridging SAP Cloud Platform into Briar Chemicals (Norwich, UK), a newly acquired Safex subsidiary.",
    tags: ["Enterprise UX", "LMS", "ERP", "SAP Integration", "Web App"],
    gradient: "linear-gradient(135deg, #1a0a00 0%, #3a1800 50%, #1a0a00 100%)",
    accentColor: "#f5a623",
    featured: false,
    company: "Safex Chemicals",
    badge: "2 Enterprise Platforms",
    caseStudy: {
      myRole: "Lead UX Designer",
      timeline: "Jun 2022 — Dec 2023",
      tools: ["Figma", "Adobe XD", "Miro", "FigJam"],
      teamNote: "Worked with Safex IT team and senior management stakeholders",
      overview:
        "Two enterprise platforms built simultaneously — a training LMS for 500+ Safex employees in India, and a custom SAP web interface for Briar Chemicals (Norwich, UK), a newly acquired subsidiary.",
      problem:
        "Two companies, two countries, both running critical operations on paper and Excel.",
      painPoints: [
        "Zero digital training records — compliance audit would fail",
        "SAP live but abandoned — default interface too complex for plant operators",
        "Work notifications, stock transfers, QC sign-offs all tracked in Excel",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Interviewed HR at Safex India and shadowed plant engineers at Briar Chemicals to map workflows end-to-end.",
        },
        {
          phase: "Define",
          what: "Scoped LMS as 6 modules and SAP Web as 3 role-gated modules (Engineering, Logistics, QC).",
        },
        {
          phase: "Design",
          what: "Two distinct visual languages: warm and approachable for LMS, data-dense and precise for the SAP interface.",
        },
        {
          phase: "Deliver",
          what: "Tested with 8 LMS users and 5 plant staff, then delivered full Figma handoff to both IT teams.",
        },
      ],
      solutionHighlights: [],
      portals: [
        {
          id: "safex-lms",
          title: "Safex LMS",
          subtitle: "Company-Wide Training & Compliance Platform",
          context: "Internal training platform for Safex Chemicals India — 500+ employees, replacing printed booklets.",
          problem:
            "Compliance training was entirely offline with no records, no auditability, and no way for HR to report status.",
          painPoints: [
            "Zero digital record — a compliance audit would fail",
            "No course catalog — employees didn't know what training existed",
            "HR had no visibility into department-level completion rates",
          ],
          solutionHighlights: [
            "Dashboard: personalised greeting + 4 KPI cards + department completion chart",
            "Training Library: 9 courses across Safety, Compliance, Technical, HR",
            "Video player with progress tracking + inline quiz engine per module",
            "COMPLETED / IN PROGRESS / NOT STARTED badges on every course card",
          ],
          outcomes: [
            { metric: "500+", label: "Employees at launch" },
            { metric: "9",    label: "Courses digitised" },
            { metric: "4",    label: "Course categories" },
            { metric: "88%",  label: "Avg quiz score" },
          ],
          images: [
            { src: "/images/safex-lms/lms-dashboard.webp", alt: "Employee dashboard",       caption: "SafeXLMS · Dashboard" },
            { src: "/images/safex-lms/lms-library.webp",   alt: "Training library",          caption: "SafeXLMS · Library" },
            { src: "/images/safex-lms/lms-progress.webp",  alt: "My Progress tracker",       caption: "SafeXLMS · Progress" },
          ],
        },
        {
          id: "briar-sap",
          title: "SAP Web Interface",
          subtitle: "Custom ERP · Briar Chemicals, Norwich UK",
          context: "Briar Chemicals was newly acquired by Safex. SAP was adopted as the ERP, but plant teams needed a purpose-built interface — not the default SAP UI.",
          problem:
            "SAP was live but unused. Plant teams continued on Excel — the default interface was too complex for non-technical operators.",
          painPoints: [
            "Work notification status invisible — open vs. completed tracked in spreadsheets",
            "Stock transfers handled by phone, logged manually",
            "No role-based access — everyone saw everything",
          ],
          solutionHighlights: [
            "KPI dashboard: live counts across Engineering, Logistics, QC",
            "Engineering: work notification lifecycle + BOM + outstanding reservations",
            "Logistics: stock transfer approvals + low-stock alerts",
            "4 role-gated access levels: Engineer, Logistics, QC, Admin",
          ],
          outcomes: [
            { metric: "3",    label: "ERP modules" },
            { metric: "4",    label: "Role-gated access levels" },
            { metric: "↓70%", label: "Notification tracking time" },
            { metric: "0",    label: "Paper approvals remaining" },
          ],
          images: [
            { src: "/images/safex-lms/erp-dashboard.webp",       alt: "SAP Web Interface dashboard",   caption: "SAP Web · Dashboard", full: true },
            { src: "/images/safex-lms/sap-engineering.webp",     alt: "Engineering module",             caption: "SAP Web · Engineering" },
            { src: "/images/safex-lms/sap-notifications.webp",   alt: "Work notification report",       caption: "SAP Web · Notifications" },
            { src: "/images/safex-lms/sap-stock-transfers.webp", alt: "Logistics stock transfers",      caption: "SAP Web · Logistics" },
          ],
        },
      ],
      outcomes: [
        { metric: "500+", label: "Employees on LMS" },
        { metric: "9",    label: "Courses digitised" },
        { metric: "3",    label: "SAP modules built" },
        { metric: "↓70%", label: "Notification tracking time" },
      ],
      images: [],
      links: {},
    },
  },

  // ── 5. Safex Group Websites ───────────────────────────────
  {
    id: "safex-websites",
    title: "Safex Group Websites",
    projectType: "enterprise",
    year: "2022–2023",
    category: "Web Design · Brand Identity",
    description:
      "Full UX and visual identity overhaul for 5 Safex group companies — from agri-chemicals to pharma and specialty products. Each site rebuilt with a unified design language while preserving individual brand character.",
    tags: ["Web Design", "Brand Identity", "UX", "Multi-site", "Responsive"],
    gradient: "linear-gradient(135deg, #0f1a00 0%, #243d00 50%, #0f1a00 100%)",
    accentColor: "#8bc34a",
    featured: false,
    company: "Safex Chemicals",
    badge: "5 Live Sites",
    caseStudy: {
      myRole: "UI/UX Designer & Visual Identity",
      timeline: "Jun 2022 — Dec 2023",
      tools: ["Figma", "Adobe Illustrator", "Photoshop"],
      teamNote: "Collaborated with Safex IT team and group marketing leads",
      overview:
        "Five Safex group company websites redesigned simultaneously — one coherent visual system, five distinct brand identities spanning agri-chemicals, organics, specialty chemicals, and pharma.",
      problem:
        "Five subsidiaries looked like five unrelated companies — no shared identity, no mobile support, and no clear way for B2B buyers to navigate the group structure.",
      painPoints: [
        "5 sites, 5 visual languages — zero group coherence",
        "No mobile responsiveness despite majority B2B mobile traffic",
        "Buried contact and inquiry paths — no conversion flow",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Audited all 5 existing sites and benchmarked competitors across agri-chemicals and pharma sectors.",
        },
        {
          phase: "Define",
          what: "Established a group design system: shared header/footer, typography scale, color family, and rebuilt IA per site.",
        },
        {
          phase: "Design",
          what: "All 5 sites in Figma on the shared system — unique hero and brand color per site, common component library and responsive grid.",
        },
        {
          phase: "Deliver",
          what: "Delivered full responsive Figma specs per site and coordinated with IT for implementation — all 5 now live.",
        },
      ],
      solutionHighlights: [],
      portals: [
        {
          id: "safex-chemicals",
          title: "Safex Chemicals",
          subtitle: "Parent Company · Crop Protection & Agri-Chemicals",
          context: "Flagship brand of the Safex group — crop protection, weedicides, fungicides, and fertilisers across India.",
          problem: "The parent site looked generic and didn't surface the product catalog or establish group credibility.",
          painPoints: [
            "No product hierarchy — crops, weedicides, fertilisers all buried",
            "Homepage didn't establish group scale or credibility",
          ],
          solutionHighlights: [
            "Hero with product spotlight and clear brand positioning",
            "Crops grid: Rice, Wheat, Cotton, Sugarcane — product discovery by crop type",
            "Dedicated weedicides and fertilisers category pages",
          ],
          outcomes: [
            { metric: "Live", label: "safexchemicals.com" },
            { metric: "4",    label: "Product category pages" },
          ],
          images: [
            { src: "/images/safex-sites/safex-hero.webp",  alt: "safexchemicals.com — Hero section with product spotlight", caption: "Hero", full: true },
            { src: "/images/safex-sites/safex-crops.webp", alt: "Crops grid (Rice, Wheat, Cotton, Sugarcane)",              caption: "Crops" },
          ],
        },
        {
          id: "shogun-organics",
          title: "Shogun Organics",
          subtitle: "Organic Farming & Bio-Stimulants",
          context: "Shogun Organics produces bio-stimulant and organic agri-products for sustainable farming.",
          problem: "The brand's scientific credibility wasn't coming through — it looked like any generic organics brand.",
          painPoints: [
            "No messaging around technical or scientific positioning",
            "Product pages lacked MSDS, specs, and detailed information",
          ],
          solutionHighlights: [
            "'Building a Healthier Community' brand narrative in the hero",
            "Agrochemical AI section — scientific differentiation",
            "Product detail pages with MSDS downloads and full technical specs",
            "Infrastructure showcase: Advanced Technical Production Unit",
          ],
          outcomes: [
            { metric: "Live", label: "shogunorganics.com" },
            { metric: "5",    label: "Screens designed" },
          ],
          images: [
            { src: "/images/safex-sites/shogun-hero.webp",           alt: "Hero: Building a Healthier Community",         caption: "Hero" },
            { src: "/images/safex-sites/shogun-product-detail.webp", alt: "Product detail with MSDS and technical specs", caption: "Product Detail" },
          ],
        },
        {
          id: "indoswiss",
          title: "IndoSwiss",
          subtitle: "Specialty Chemicals & Pharma Raw Materials",
          context: "IndoSwiss supplies specialty chemicals and pharma raw materials to B2B buyers across India.",
          problem: "B2B buyers couldn't find local representatives or navigate the product range.",
          painPoints: [
            "No distributor network visibility — reps impossible to find",
            "Product catalog inaccessible with no filtering or hierarchy",
          ],
          solutionHighlights: [
            "'Accessible. Affordable. Efficient.' brand positioning",
            "Find a Representative — interactive network page",
            "Clean product catalogue with accessible navigation",
          ],
          outcomes: [
            { metric: "Live", label: "indoswiss.in" },
            { metric: "3",    label: "Screens designed" },
          ],
          images: [
            { src: "/images/safex-sites/indoswiss-hero.webp",     alt: "Hero: Farmers in field",                      caption: "Hero" },
            { src: "/images/safex-sites/indoswiss-products.webp", alt: "Accessible. Affordable. Efficient. products", caption: "Products" },
          ],
        },
        {
          id: "smithnsmith",
          title: "Smith N Smith",
          subtitle: "Specialty Products",
          context: "Smith N Smith is a niche specialty products brand within the Safex group.",
          problem: "Bare-bones site with no brand character and products impossible to discover.",
          painPoints: [
            "No visual identity — looked like an internal placeholder",
            "Product categories (herbicides, fungicides) had no dedicated pages",
          ],
          solutionHighlights: [
            "'We Are Smith N Smith' hero with clear brand voice",
            "Icon-based home navigation for product categories",
            "Product grids with herbicides and specialist product pages",
          ],
          outcomes: [
            { metric: "Live", label: "smithnsmith.net" },
            { metric: "4",    label: "Screens designed" },
          ],
          images: [
            { src: "/images/safex-sites/smithnsmith-hero.webp",     alt: "Hero: We Are Smith N Smith", caption: "Hero" },
            { src: "/images/safex-sites/smithnsmith-products.webp", alt: "Products grid",              caption: "Products" },
          ],
        },
        {
          id: "briar-chemicals-web",
          title: "Briar Chemicals",
          subtitle: "Industrial & Specialty Chemicals · Norwich, UK",
          context: "Briar Chemicals (Norwich, UK) is the Safex group's UK subsidiary — industrial chemicals and custom synthesis for global clients.",
          problem: "The existing site didn't communicate Briar's 50+ year heritage or custom synthesis capability.",
          painPoints: [
            "No messaging around expertise or heritage",
            "Media, careers, and capabilities had no dedicated presence",
          ],
          solutionHighlights: [
            "'Your dependable partner for custom synthesis' hero positioning",
            "Technologies page: 50+ years of expertise showcased",
            "Latest media and careers section for talent and press",
          ],
          outcomes: [
            { metric: "Live", label: "briarchemicals.com" },
            { metric: "3",    label: "Screens designed" },
          ],
          images: [
            { src: "/images/safex-sites/briar-hero.webp",         alt: "Hero: Your dependable partner for custom synthesis", caption: "Hero" },
            { src: "/images/safex-sites/briar-technologies.webp", alt: "Technologies: 50+ years experience",                caption: "Technologies" },
          ],
        },
      ],
      outcomes: [
        { metric: "5",      label: "Live sites redesigned" },
        { metric: "100%",   label: "Mobile responsive" },
        { metric: "1",      label: "Unified design system" },
        { metric: "Live",   label: "All sites verifiable" },
      ],
      images: [],
      links: {
        sites: [
          { label: "safexchemicals.com",  url: "https://www.safexchemicals.com" },
          { label: "shogunorganics.com",  url: "https://www.shogunorganics.com" },
          { label: "indoswiss.in",        url: "https://www.indoswiss.in" },
          { label: "smithnsmith.net",     url: "https://www.smithnsmith.net" },
          { label: "briarchemicals.com",  url: "https://www.briarchemicals.com" },
        ],
      },
    },
  },

  // ── 6. Tarot Card Deck ─────────────────────────────────────
  {
    id: "tarot",
    title: "Healing Urja — Tarot Deck",
    projectType: "creative",
    year: "2019–2020",
    category: "Illustration · Brand Identity",
    description:
      "A hand-crafted 78-card Tarot deck — each card uniquely illustrated with symbolic imagery, custom typography, and a cohesive mystical visual language.",
    tags: ["Illustration", "Procreate", "Brand Identity", "Typography"],
    gradient: "linear-gradient(135deg, #1a0020 0%, #3a0050 50%, #1a0020 100%)",
    accentColor: "#ff6b9d",
    featured: false,
    company: "Healing Urja (Freelance)",
    caseStudy: {
      myRole: "Illustrator & Brand Designer",
      timeline: "Sep 2019 — Apr 2020",
      tools: ["Procreate", "Adobe Illustrator", "Adobe Photoshop"],
      overview:
        "A 78-card bespoke Tarot deck commissioned by Healing Urja, a spiritual wellness brand. Each card was individually illustrated with symbolic imagery rooted in traditional Tarot archetypes, reimagined with a contemporary Indian aesthetic. The project included card illustrations, back design, box packaging, and brand guidelines.",
      problem: "The client needed a complete Tarot deck that balanced mystical symbolism with a fresh, modern illustration style — distinct from generic stock decks on the market.",
      painPoints: [
        "78 cards required — each unique, yet visually cohesive as a set",
        "Symbolism needed to honor traditional Tarot while feeling fresh and contemporary",
        "Physical print specs: bleed, safe zones, CMYK color accuracy at small card size",
      ],
      processHighlights: [
        { phase: "Research", what: "Deep study of Rider-Waite Tarot symbolism and mythology. Developed a visual style guide: palette, linework weight, typography rules." },
        { phase: "Illustration", what: "Procreate for hand-drawn feel, Illustrator for typographic elements. Each card went through 2-3 rounds of revision." },
        { phase: "System", what: "Ensured visual coherence across all 78 cards — shared color palette, border design, and iconographic language." },
        { phase: "Print", what: "Prepared print-ready files at 300 DPI with CMYK color profiles. Packaged final assets for physical production." },
      ],
      solutionHighlights: [
        "78 unique hand-illustrated cards with cohesive visual language",
        "Custom typography treatment for card names and suit labels",
        "Box packaging and booklet design",
        "Contemporary Indian aesthetic while honoring Tarot tradition",
      ],
      outcomes: [
        { metric: "78", label: "Unique cards illustrated" },
        { metric: "Printed", label: "Physical deck in production" },
        { metric: "Complete", label: "Brand system delivered" },
      ],
      images: [
        { src: "/images/freelance/tarot-1.webp", alt: "Tarot card — The Fool" },
        { src: "/images/freelance/tarot-2.webp", alt: "Tarot card spread" },
        { src: "/images/freelance/tarot-box.webp", alt: "Tarot deck box packaging" },
      ],
      links: {
        behance: personal.behance,
      },
    },
  },

  // ── 6. Liberty Shoes ───────────────────────────────────────
  {
    id: "liberty",
    title: "Liberty Shoes Campaigns",
    projectType: "freelance",
    year: "2021–2022",
    category: "Brand Design · Motion",
    description:
      "Multi-platform brand campaigns — motion graphics, social content, GIFs, and large-format print assets driving a 25% engagement lift.",
    tags: ["Campaign Design", "Motion", "Brand", "GIF", "Print"],
    gradient: "linear-gradient(135deg, #1a0800 0%, #3d1800 50%, #1a0800 100%)",
    accentColor: "#ff9b47",
    featured: false,
    company: "Liberty Shoes",
    caseStudy: {
      myRole: "Graphic Visualizer",
      timeline: "Apr 2021 — Mar 2022",
      tools: ["Adobe Illustrator", "Photoshop", "After Effects", "InDesign"],
      overview:
        "A year of brand design at Liberty Shoes — one of India's largest footwear brands. Designed seasonal campaign creatives, social media content, GIF animations, banners, and large-format print materials while maintaining strict brand guideline compliance.",
      problem: "Liberty Shoes needed consistent, high-quality creative output across digital and print channels with fast turnaround times and strict brand guideline compliance.",
      painPoints: [
        "High volume of creative assets required across multiple seasonal campaigns",
        "Tight deadlines with multiple simultaneous campaign tracks",
        "Strict brand guideline compliance required across all touchpoints",
      ],
      processHighlights: [
        { phase: "Brand", what: "Deep study of Liberty's brand guidelines. Built reusable templates to speed up production." },
        { phase: "Design", what: "Campaign-specific visual concepts, illustration, typography layout." },
        { phase: "Motion", what: "GIF animations and short-form motion content for social media." },
        { phase: "Delivery", what: "Packaged assets for digital, social, and large-format print." },
      ],
      solutionHighlights: [
        "Seasonal campaign visual system: summer, winter, festive collections",
        "Motion graphics and GIF animations for social media engagement",
        "Template system reducing asset production time by 40%",
        "Large-format print assets: banners, hoardings, in-store displays",
      ],
      outcomes: [
        { metric: "+25%", label: "Campaign engagement lift" },
        { metric: "Multi", label: "Seasonal campaigns delivered" },
        { metric: "↓40%", label: "Asset production time via templates" },
      ],
      images: [
        { src: "/images/freelance/liberty-1.webp", alt: "Liberty Shoes campaign creative" },
        { src: "/images/freelance/liberty-2.webp", alt: "Social media campaign" },
      ],
      links: {
        behance: personal.behance,
      },
    },
  },

  // ── 7. ALMA Magazine ───────────────────────────────────────
  {
    id: "alma",
    title: "ALMA Magazine",
    projectType: "creative",
    year: "2022",
    category: "Editorial · Illustration",
    description:
      "A year-long creative collaboration producing conceptual illustrations and editorial characters — surreal storytelling with refined visual aesthetics.",
    tags: ["Editorial", "Character Design", "Illustration", "Storytelling"],
    gradient: "linear-gradient(135deg, #001a1a 0%, #003535 50%, #001a1a 100%)",
    accentColor: "#4cc9f0",
    featured: false,
    company: "ALMA Magazine (Freelance)",
    caseStudy: {
      myRole: "Freelance Illustrator",
      timeline: "Jan 2022 — Dec 2022",
      tools: ["Procreate", "Adobe Illustrator", "Adobe Photoshop"],
      overview:
        "ALMA Magazine is a contemporary print publication. Over a year, I produced editorial illustrations accompanying feature articles — conceptual imagery, character designs, and full-spread illustrations that interpreted stories through a visual lens.",
      problem: "Each article required a custom illustration that captured the essence of the story — sometimes abstract, sometimes character-driven — while fitting the magazine's refined aesthetic.",
      painPoints: [
        "Each illustration needed to interpret a text-based story visually",
        "Consistent style across issues while allowing creative variation per story",
        "Print-ready output at high resolution with CMYK accuracy",
      ],
      processHighlights: [
        { phase: "Brief", what: "Read each article, extracted key metaphors and visual themes." },
        { phase: "Concept", what: "Thumbnail sketches for 2-3 directional concepts per article." },
        { phase: "Illustration", what: "Final illustration in Procreate with Illustrator refinements." },
        { phase: "Print", what: "300 DPI CMYK export at publication size." },
      ],
      solutionHighlights: [
        "Conceptual editorial illustrations spanning surrealism, portraiture, and abstract storytelling",
        "Character design series for recurring columns",
        "Full-spread feature illustrations",
      ],
      outcomes: [
        { metric: "12+", label: "Editorial illustrations published" },
        { metric: "Print", label: "Published in physical magazine" },
        { metric: "Ongoing", label: "Repeat client collaboration" },
      ],
      images: [
        { src: "/images/freelance/alma-1.webp", alt: "ALMA Magazine illustration — feature spread" },
        { src: "/images/freelance/alma-2.webp", alt: "ALMA Magazine — character illustration" },
      ],
      links: {
        behance: personal.behance,
      },
    },
  },

  // ── 8. Brand Identity 01 ──────────────────────────────────
  {
    id: "brand-01",
    title: "Brand Identity — Client A",
    projectType: "creative",
    year: "2023",
    category: "Brand Identity · Packaging",
    description:
      "Complete brand identity system — logo suite, color palette, typography, brand guidelines, and packaging design delivered as a client-ready brand kit.",
    tags: ["Branding", "Logo Design", "Packaging", "Brand Guidelines"],
    gradient: "linear-gradient(135deg, #1a1200 0%, #3a2800 60%, #1a1200 100%)",
    accentColor: "#c9a96e",
    featured: false,
    company: "Freelance",
    caseStudy: {
      myRole: "Brand Designer",
      timeline: "2023",
      tools: ["Adobe Illustrator", "Photoshop", "InDesign"],
      overview:
        "Full brand identity system designed for a freelance client — covering logo design, visual identity, color system, typography selection, packaging, and a complete brand guidelines document.",
      problem: "Client needed a cohesive, professional brand identity from scratch — logo to packaging.",
      painPoints: [
        "No existing visual identity — starting from zero",
        "Brand needed to work across digital and physical print touchpoints",
        "Packaging required CMYK accuracy and print-ready output",
      ],
      processHighlights: [
        { phase: "Discovery", what: "Brand workshops to define values, audience, tone, and competitive landscape." },
        { phase: "Identity", what: "Logo concept exploration → refinement to final lockup with full suite of variations." },
        { phase: "System", what: "Color palette, typography, spacing rules, and usage guidelines documented." },
        { phase: "Packaging", what: "Applied brand to packaging — print-ready files with dieline, CMYK profiles." },
      ],
      solutionHighlights: [
        "Logo suite — primary, secondary, icon mark, monochrome variants",
        "Brand guidelines PDF with color values, typography, and usage rules",
        "Packaging design — flat and 3D mockup",
        "Social media templates aligned to brand system",
      ],
      outcomes: [
        { metric: "Full", label: "Brand kit delivered" },
        { metric: "Print", label: "Packaging production-ready" },
      ],
      images: [
        { src: "/images/branding/brand-01/cover.webp", alt: "Brand Identity — cover" },
        { src: "/images/branding/brand-01/logo.webp",  alt: "Logo suite" },
        { src: "/images/branding/brand-01/packaging.webp", alt: "Packaging design" },
      ],
      links: {
        pdf: "/branding/brand-kit-01.pdf",
      },
    },
  },

  // ── 9. Brand Identity 02 ──────────────────────────────────
  {
    id: "brand-02",
    title: "Brand Identity — Client B",
    projectType: "creative",
    year: "2023",
    category: "Brand Identity · Visual System",
    description:
      "Visual identity and brand system — logo, color tokens, typography, stationery, and digital brand guidelines for a second freelance client.",
    tags: ["Branding", "Logo Design", "Visual Identity", "Typography"],
    gradient: "linear-gradient(135deg, #0a0f1a 0%, #152040 60%, #0a0f1a 100%)",
    accentColor: "#7c9fd4",
    featured: false,
    company: "Freelance",
    caseStudy: {
      myRole: "Brand Designer",
      timeline: "2023",
      tools: ["Adobe Illustrator", "Photoshop", "InDesign"],
      overview:
        "Brand identity system for a second freelance client — logo design, color system, typography, stationery design, and brand guidelines document.",
      problem: "Client required a distinct, memorable identity that could scale from business cards to large-format print.",
      painPoints: [
        "Identity needed to communicate trustworthiness and professionalism",
        "Multi-format delivery: digital screens + physical print",
      ],
      processHighlights: [
        { phase: "Discovery", what: "Client briefs and mood board alignment." },
        { phase: "Identity", what: "Logo directions, refinement, final delivery." },
        { phase: "System", what: "Full brand guidelines with do/don't usage rules." },
      ],
      solutionHighlights: [
        "Logo suite with primary and alternate lockups",
        "Stationery design — business card, letterhead",
        "Brand guidelines PDF",
      ],
      outcomes: [
        { metric: "Full", label: "Brand system delivered" },
        { metric: "Multi", label: "Format applications covered" },
      ],
      images: [
        { src: "/images/branding/brand-02/cover.webp", alt: "Brand Identity 02 — cover" },
        { src: "/images/branding/brand-02/logo.webp",  alt: "Logo suite" },
      ],
      links: {
        pdf: "/branding/brand-kit-02.pdf",
      },
    },
  },

  // ── 10. Brand Identity 03 ─────────────────────────────────
  {
    id: "brand-03",
    title: "Brand Identity — Client C",
    projectType: "creative",
    year: "2024",
    category: "Brand Identity · Packaging",
    description:
      "Brand identity and product packaging — logo, brand palette, packaging dieline design, and print-ready brand kit for a third freelance client.",
    tags: ["Branding", "Packaging Design", "Logo Design", "Print"],
    gradient: "linear-gradient(135deg, #120a1a 0%, #2a1540 60%, #120a1a 100%)",
    accentColor: "#b07cc9",
    featured: false,
    company: "Freelance",
    caseStudy: {
      myRole: "Brand & Packaging Designer",
      timeline: "2024",
      tools: ["Adobe Illustrator", "Photoshop", "InDesign"],
      overview:
        "Complete brand and packaging project for a third freelance client — from logo concept through to production-ready packaging files.",
      problem: "Client needed end-to-end brand and packaging design ready for product launch.",
      painPoints: [
        "Packaging required dieline accuracy for physical production",
        "Brand needed to feel premium yet accessible",
      ],
      processHighlights: [
        { phase: "Discovery", what: "Product brief, target market research, mood board." },
        { phase: "Brand", what: "Logo, color, type — aligned to product positioning." },
        { phase: "Packaging", what: "Dieline design, label layout, print-ready output." },
      ],
      solutionHighlights: [
        "Logo and full brand identity system",
        "Packaging dieline with front/back/side panels",
        "300 DPI CMYK print-ready files",
      ],
      outcomes: [
        { metric: "Print", label: "Ready for production" },
        { metric: "Full", label: "Brand + packaging kit" },
      ],
      images: [
        { src: "/images/branding/brand-03/cover.webp",    alt: "Brand Identity 03 — cover" },
        { src: "/images/branding/brand-03/packaging.webp", alt: "Packaging design" },
      ],
      links: {
        pdf: "/branding/brand-kit-03.pdf",
      },
    },
  },

  // ── 11. Namami Gange Wall Mural ────────────────────────────
  {
    id: "mural",
    title: "Namami Gange — Wall Mural",
    projectType: "creative",
    year: "2018",
    category: "Public Art · Social Impact",
    description:
      "A large-scale mural painted in Dehradun as part of the Government of India's Namami Gange campaign — monumental environmental public art.",
    tags: ["Mural", "Public Art", "Social Impact", "Environmental"],
    gradient: "linear-gradient(135deg, #001a08 0%, #003515 50%, #001a08 100%)",
    accentColor: "#4ade80",
    featured: false,
    company: "Govt. of India — Namami Gange",
    caseStudy: {
      myRole: "Illustrator & Mural Artist",
      timeline: "2018",
      tools: ["Wall paint", "Brushes", "Hand-drawn sketches"],
      overview:
        "Participated as an awareness volunteer for Namami Gange, a flagship Government of India programme to rejuvenate the Ganga river. Painted a large-scale mural in Dehradun communicating the importance of river conservation and environmental preservation.",
      problem: "Raising public awareness about river conservation through visual public art in urban spaces.",
      painPoints: [
        "Large-scale execution — translating a small sketch to a wall spanning several meters",
        "Outdoor durability — paint selection and technique for weather resistance",
        "Public impact — imagery needed to be immediately readable to all audiences",
      ],
      processHighlights: [
        { phase: "Concept", what: "Developed the mural concept around river life, conservation symbols, and cultural motifs." },
        { phase: "Sketch", what: "Scale drawings and grid transfer for accurate large-format execution." },
        { phase: "Paint", what: "On-site mural painting over multiple sessions." },
      ],
      solutionHighlights: [
        "Large-scale public mural in Dehradun, Uttarakhand",
        "Environmental conservation messaging through visual storytelling",
        "Government of India commissioned project",
      ],
      outcomes: [
        { metric: "Public", label: "Visible to thousands of Dehradun residents" },
        { metric: "Govt.", label: "Commissioned by GoI Namami Gange programme" },
      ],
      images: [
        { src: "/images/freelance/mural.jpg", alt: "Namami Gange wall mural in Dehradun" },
      ],
      links: {},
    },
  },
];

// ─── Certifications ────────────────────────────────────────
export const certifications = [
  {
    title: "Persuasive UX Strategy",
    issuer: "IIT Delhi",
    level: "Advanced Certification",
    icon: "🏛️",
    highlight: true,
  },
  {
    title: "Human-Centered Design for Inclusive Innovation",
    issuer: "University of Toronto",
    level: "Certification",
    icon: "🎓",
    highlight: false,
  },
  {
    title: "Get Started with Figma",
    issuer: "Coursera",
    level: "Course",
    icon: "📐",
    highlight: false,
  },
  {
    title: "Mixed Media Animation in Procreate",
    issuer: "Domestika",
    level: "Course",
    icon: "🎨",
    highlight: false,
  },
];

// ─── Filtered project sets ─────────────────────────────────
export const enterpriseProjects = projects.filter((p) => p.projectType === "enterprise");
export const creativeProjects   = projects.filter((p) => p.projectType === "creative");
export const freelanceProjects  = projects.filter((p) => p.projectType === "freelance");

// ─── Nav links ─────────────────────────────────────────────
export const navLinks = [
  { label: "About",      href: "#about"     },
  { label: "Work",       href: "#work"      },
  { label: "Creative",   href: "#creative"  },
  { label: "Skills",     href: "#skills"    },
  { label: "Process",    href: "#process"   },
  { label: "Contact",    href: "#contact"   },
];
