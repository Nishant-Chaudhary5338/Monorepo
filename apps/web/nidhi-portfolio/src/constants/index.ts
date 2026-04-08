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
  resumeUrl: "/Nidhi-resume2026.pdf",
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
  { value: 15, suffix: "K+", label: "Real Users Impacted" },
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
};

export type CaseStudyOutcome = {
  metric: string;
  label: string;
};

export type CaseStudyImage = {
  src: string;
  alt: string;
  caption?: string;
  full?: boolean; // full-width image
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
        "Golden Farms (internally KIWI — Kisan Window) is a B2B agricultural e-commerce mobile app developed for Safex Chemicals India. It lets distributors and retailers browse products, place bulk orders, track delivery, upload trade permits, and access agri-expert support — entirely in Hindi or English. I led the end-to-end UX from initial user research with rural distributors to launch and post-launch iteration.",
      problem:
        "Safex's B2B ordering was completely manual — phone calls, WhatsApp, spreadsheets. Distributors in Tier-2/3 cities struggled with delayed orders, unclear pricing, permit confusion, and no visibility into delivery status. The business had zero digital presence for this distribution layer.",
      painPoints: [
        "No digital ordering — every order placed via phone/WhatsApp with errors and delays",
        "Permit & compliance documents required for each order, but no structured upload flow existed",
        "Rural distributors (primary users) had low digital literacy — needed simple, bilingual UX",
        "Product catalog was not accessible — no search, no category structure, no stock visibility",
        "Zero order tracking — distributors had no idea when their order would arrive",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Field research with 12 Safex distributors across UP and Haryana — in-person interviews, task observation, contextual inquiry. Mapped current state ordering journey revealing 7 pain point clusters.",
        },
        {
          phase: "Define",
          what: "Created 3 user personas (rural retailer, urban distributor, first-time user), information architecture for 5 core flows (onboarding, catalog, ordering, permit upload, tracking), and a prioritized feature matrix.",
        },
        {
          phase: "Design",
          what: "14 rounds of wireframe iteration. Key decisions: simplified 3-step checkout, permit upload with camera integration, bilingual toggle, large touch targets (48dp minimum) for rural accessibility.",
        },
        {
          phase: "Deliver",
          what: "Usability testing with 8 distributors pre-launch. Iterated on permit flow and onboarding based on findings. Handed off with a 120+ screen Figma file + annotated dev specs.",
        },
      ],
      solutionHighlights: [
        "One-tap reorder — distributors can replicate their last order in 2 taps",
        "Smart permit upload — camera capture + OCR prompt for required fields",
        "Bilingual on-the-fly toggle (Hindi ↔ English) without re-navigation",
        "Inline stock availability with restock ETA to reduce follow-up calls",
        "Order timeline with push notifications at each status change",
      ],
      outcomes: [
        { metric: "15K+", label: "Active users on Play Store & App Store" },
        { metric: "80%", label: "Reduction in manual order calls" },
        { metric: "4.2★", label: "Average app store rating" },
        { metric: "Live", label: "Nidhi's name credited inside the app" },
      ],
      images: [
        { src: "/images/golden-farms/playstore.png",      alt: "Golden Farms — Play Store listing (4.2★, 10K+ downloads)", caption: "Play Store · Agcare Technologies Private Limited", full: true },
        { src: "/images/golden-farms/appstore.png",       alt: "Golden Farms — App Store listing (5.0★)", caption: "App Store · Utility · Developer: Songlift" },
        { src: "/images/golden-farms/language.webp",      alt: "Onboarding — Language selection screen (English / Hindi / Bangla)", caption: "Onboarding · Language Selection" },
        { src: "/images/golden-farms/login.webp",         alt: "Login screen — OTP-based mobile number authentication", caption: "Authentication · OTP Login" },
        { src: "/images/golden-farms/home.webp",          alt: "Home dashboard — Ledger balance, quick actions, tutorial", caption: "Dashboard · Home Screen" },
        { src: "/images/golden-farms/products.webp",      alt: "Product catalog — Filtered by Weedicides, Fungicides, Insecticides, PGRs, Fertilisers", caption: "Product Catalog · All Products" },
        { src: "/images/golden-farms/product-detail.webp", alt: "Product detail — Crop/pest/dosage table with pricing", caption: "Product Detail · Dosage & Pricing" },
      ],
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
    category: "Enterprise UX · SaaS Dashboard",
    description:
      "End-to-end UX for Samsung's internal QA automation platform — a drag-drop dashboard, AI-assisted test authoring, and scheduling system used by global content operations teams.",
    tags: ["Enterprise UX", "SaaS", "Dashboard", "Design Systems", "User Research"],
    gradient: "linear-gradient(135deg, #0d0a2e 0%, #1a1060 50%, #0d0a2e 100%)",
    accentColor: "#9d72ff",
    featured: false,
    company: "Samsung Electronics",
    badge: "Used by Samsung Global Teams",
    caseStudy: {
      myRole: "Senior UX Designer & Researcher",
      timeline: "Dec 2023 — Present",
      tools: ["Figma", "FigJam", "Miro", "Storybook", "ProtoPie"],
      teamNote: "Collaboration with Samsung's global content ops and QA engineering teams",
      overview:
        "TVPlus is Samsung's free ad-supported streaming service available on Samsung Smart TVs globally. The TVPlus Test Suite is the internal QA automation platform used by Samsung's content operations and QA teams to author, schedule, and monitor automated tests for TVPlus content and features. I redesigned the entire UX — from the test authoring flow to the real-time monitoring dashboard.",
      problem:
        "The existing test suite had no centralized dashboard, test authoring was scattered across multiple tools, and QA teams spent excessive time on manual status checks and scheduling conflicts. The interface was engineer-built, with no UX consideration, leading to high error rates and onboarding friction for new team members.",
      painPoints: [
        "No unified dashboard — QA engineers used 3 separate tools to create, schedule, and monitor tests",
        "Test authoring was CLI-based for non-technical content ops staff who couldn't code",
        "No real-time status visibility — engineers had to ping devs to know if tests passed or failed",
        "Scheduling conflicts were common with no conflict detection or resolution UI",
        "New team members took 2+ weeks to onboard due to tool complexity",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Stakeholder interviews with 8 QA engineers and 4 content ops leads. Workflow shadowing sessions. Heuristic evaluation of the existing tool identified 23 critical usability issues.",
        },
        {
          phase: "Define",
          what: "User journey maps for 3 personas (QA Engineer, Content Ops Lead, Admin). Defined MVP feature set with stakeholders. Prioritized test authoring and real-time dashboard as Phase 1.",
        },
        {
          phase: "Design",
          what: "Component-first design in Figma — built a small design system for the tool. Drag-drop dashboard with customizable widget grid. No-code test authoring with step builder and parameter selectors.",
        },
        {
          phase: "Deliver",
          what: "Prototype testing with QA team. Iterated on scheduling interface after conflict detection was flagged as confusing. Handed off with Storybook components and annotated specs.",
        },
      ],
      solutionHighlights: [
        "Unified drag-drop dashboard — all test metrics, pass/fail rates, and schedules in one place",
        "No-code test authoring — step builder with dropdown selectors enables content ops (non-engineers) to write tests",
        "AI-assisted chatbot for test search, Q&A on test results, and quick test execution",
        "Real-time monitoring feed with status badges and alert escalation",
        "Admin portal for team management, permissions, and audit logs",
      ],
      outcomes: [
        { metric: "Global", label: "Samsung content ops teams as users" },
        { metric: "↓60%", label: "Reduction in test authoring time" },
        { metric: "↑3x", label: "Faster onboarding for new team members" },
        { metric: "Phase 2", label: "Mobile view in active development" },
      ],
      images: [
        { src: "/images/tvplus/dashboard.png", alt: "TVPlus Test Suite dashboard" },
        { src: "/images/tvplus/test-authoring.png", alt: "Test authoring interface" },
        { src: "/images/tvplus/scheduling.png", alt: "Test scheduling view" },
        { src: "/images/tvplus/chatbot.png", alt: "AI-assisted chatbot interface" },
      ],
      links: {},
      disclaimer:
        "Screens have been recreated to protect confidential information. All metrics and outcomes are referenced with permission.",
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
      "A scalable design system built in Figma (tokens, components, patterns) and deployed as a live Storybook — adopted across 3+ internal Samsung products.",
    tags: ["Design System", "Figma Tokens", "Storybook", "Components", "Documentation"],
    gradient: "linear-gradient(135deg, #0a1520 0%, #0f2540 50%, #0a1520 100%)",
    accentColor: "#4cc9f0",
    featured: false,
    company: "Samsung Electronics",
    badge: "Live Storybook",
    caseStudy: {
      myRole: "Lead Design System Designer (Figma)",
      timeline: "Jan 2024 — Present",
      tools: ["Figma", "Figma Variables", "Figma Auto-Layout", "Storybook", "Design Tokens W3C"],
      teamNote: "Design: Nidhi Chhimwal | Engineering/Storybook: Nishant Chaudhary (FE Dev)",
      overview:
        "As Samsung's internal products grew, design inconsistency became a bottleneck — teams were rebuilding components from scratch, inconsistent color tokens caused visual fragmentation, and handoffs between design and engineering were error-prone. I designed the Samsung Design System from the ground up: token architecture, component library, usage guidelines, and worked with the engineering counterpart to deploy it as a live Storybook.",
      problem:
        "Multiple internal Samsung teams were designing in isolation — each product had different button styles, color palettes, spacing systems, and text styles. This led to fragmented UX, slow delivery, and high maintenance costs as each team maintained their own component set.",
      painPoints: [
        "No shared token system — teams hardcoded colors, inconsistent across products",
        "Component duplication — every team built their own Button, Card, Modal from scratch",
        "Design-to-engineering handoff was manual and error-prone with no single source of truth",
        "Dark mode was inconsistently implemented across different products",
        "New designers had no documentation to onboard from",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Audit of 3 existing Samsung internal product UIs — catalogued 180+ unique components, 12 different button styles, and 6 conflicting color systems. Conducted team interviews to understand adoption blockers.",
        },
        {
          phase: "Define",
          what: "Defined token taxonomy: 4 tiers (primitive → semantic → component → theme). Prioritized component set of 40 core components for Phase 1. Created contribution and governance model.",
        },
        {
          phase: "Design",
          what: "Built in Figma with Variables for semantic tokens. Components with 5-state variants, interactive properties, and auto-layout. Full dark + light mode support. Annotated every component with usage guidelines.",
        },
        {
          phase: "Deliver",
          what: "Design tokens exported as W3C JSON. Collaborated with FE developer to build Storybook with live component previews and code snippets. Conducted design system office hours for adoption.",
        },
      ],
      solutionHighlights: [
        "4-tier token system: primitive → semantic → component → theme (supports dark/light switching)",
        "40+ components in Phase 1: documented, accessible, and variant-complete in Figma",
        "Live Storybook — developers can copy component code directly, no ambiguity in specs",
        "Figma Variables integration — token updates propagate to all component instances instantly",
        "Governance model: component request process, contribution guidelines, versioning",
      ],
      outcomes: [
        { metric: "3+", label: "Samsung products adopted the system" },
        { metric: "40+", label: "Components in Phase 1 Storybook" },
        { metric: "↓40%", label: "Design-to-dev handoff time" },
        { metric: "Live", label: "Storybook deployed and accessible" },
      ],
      images: [
        { src: "/images/samsung-ds/token-overview.png", alt: "Design token overview in Figma" },
        { src: "/images/samsung-ds/components.png", alt: "Component library" },
        { src: "/images/samsung-ds/storybook.png", alt: "Live Storybook" },
        { src: "/images/samsung-ds/dark-light.png", alt: "Dark and light mode theming" },
      ],
      links: {
        storybook: "https://fluffy-churros-b798ad.netlify.app/?path=/docs/components-button--docs",
      },
      disclaimer:
        "Screens have been recreated to protect confidential information. Storybook is deployed with dummy data.",
    },
  },

  // ── 4. Safex LMS + Admin Portal ───────────────────────────
  {
    id: "safex-lms",
    title: "Safex LMS & Admin Portal",
    projectType: "enterprise",
    year: "2022–2023",
    category: "Enterprise UX · Web Platform",
    description:
      "A dual-platform design project — corporate Learning Management System for 500+ Safex employees, and a B2B Admin Portal managing orders, distributor verification, and India-wide inventory.",
    tags: ["Enterprise UX", "LMS", "Admin Portal", "B2B", "Web App"],
    gradient: "linear-gradient(135deg, #1a0a00 0%, #3a1800 50%, #1a0a00 100%)",
    accentColor: "#f5a623",
    featured: false,
    company: "Safex Chemicals",
    badge: "Internal Enterprise Tool",
    caseStudy: {
      myRole: "Lead UX Designer",
      timeline: "Jun 2022 — Dec 2023",
      tools: ["Figma", "Adobe XD", "Miro", "FigJam"],
      teamNote: "Worked with Safex IT team and senior management stakeholders",
      overview:
        "Safex Chemicals needed two interconnected enterprise platforms: an LMS for company-wide employee training (compliance courses, policy docs, quizzes), and an Admin Portal for B2B operations — managing distributors, orders, permit verification, and state-wise inventory across India. I designed both platforms from research to delivery, adapting complex enterprise workflows into clean, efficient interfaces.",
      problem:
        "Safex's training was conducted offline (physical booklets, classroom sessions) with no tracking, no completion records, and no way to update content. The B2B Admin Portal didn't exist — operations were managed through Excel sheets, phone calls, and manual document verification, causing massive inefficiency as the distributor network scaled.",
      painPoints: [
        "No digital training system — compliance training had zero completion tracking",
        "New employee onboarding required in-person sessions — not scalable",
        "B2B order management was entirely manual — Excel + phone = errors and delays",
        "Distributor verification required physical visits for permit checks",
        "No state-wise view of inventory or demand patterns",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Stakeholder interviews with HR, operations, and IT teams. Mapped current training and order workflows. Identified 3 primary user roles: Employee, LMS Admin, B2B Operations Manager.",
        },
        {
          phase: "Define",
          what: "Defined separate IA for LMS and Admin Portal. LMS: 5 core flows (login, course catalog, video player, quiz, profile). Admin: 6 modules (dashboard, orders, distributors, verification, inventory, reports).",
        },
        {
          phase: "Design",
          what: "Built both platforms with a shared design language. LMS used a warm, approachable aesthetic. Admin Portal was data-dense with table-first design, powerful filters, and bulk actions for efficiency.",
        },
        {
          phase: "Deliver",
          what: "Usability testing with 10 employees (LMS) and 5 operations managers (Admin Portal). Key iterations: simplified quiz interface and bulk order approval flow. Complete Figma handoff with design tokens.",
        },
      ],
      solutionHighlights: [
        "LMS: Video-first course player with chapter sidebar, note-taking, and inline quiz prompts",
        "LMS: Editorial board section for company news and policy announcements",
        "Admin: State-wise distributor map with filterable order density and inventory levels",
        "Admin: Document verification queue with approve/reject workflows and audit trail",
        "Admin: Bulk order management with CSV export and status tracking",
      ],
      outcomes: [
        { metric: "500+", label: "Employees on the LMS" },
        { metric: "100%", label: "Compliance training now tracked digitally" },
        { metric: "↓70%", label: "Distributor verification time" },
        { metric: "India", label: "Nationwide distributor network managed" },
      ],
      images: [
        { src: "/images/safex-lms/lms-dashboard.png",      alt: "SafeXLMS — Employee dashboard (Good morning Nidhi, 12 courses, 8 completed, dept chart)", caption: "SafeXLMS · Employee Dashboard" },
        { src: "/images/safex-lms/lms-library.png",         alt: "SafeXLMS — Training library: 9 courses (Fire Safety, Chemical Handling, ISO 45001…)", caption: "SafeXLMS · Training Library" },
        { src: "/images/safex-lms/lms-progress.png",        alt: "SafeXLMS — My Progress: 88% overall score, 58% completion across courses", caption: "SafeXLMS · My Progress" },
        { src: "/images/safex-lms/erp-dashboard.png",       alt: "Admin Portal — Main dashboard: notifications, pending approvals, stock transfers, modules", caption: "Admin Portal (SAP) · Dashboard", full: true },
        { src: "/images/safex-lms/sap-engineering.png",     alt: "Admin Portal — Engineering modules: Bills of Material (1,688 items), Outstanding Reservations (24)", caption: "Admin Portal (SAP) · Engineering" },
        { src: "/images/safex-lms/sap-notifications.png",   alt: "Admin Portal — Work Notification Report: 15 maintenance tasks with OPEN/IN PROGRESS/CLOSED status", caption: "Admin Portal (SAP) · Notifications" },
        { src: "/images/safex-lms/sap-stock-transfers.png", alt: "Admin Portal — Logistics: 1,840 materials, 23 pending transfers, 7 low stock alerts", caption: "Admin Portal (SAP) · Stock Transfers" },
      ],
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
        "Safex Chemicals is a diversified agri-chemicals group with 5 subsidiary companies spanning crop protection, organic farming, specialty chemicals, and pharma raw materials. Each company had an outdated, inconsistent web presence with no shared design language. I redesigned all 5 group websites — establishing a unified visual system while giving each brand its own identity within the family.",
      problem:
        "The Safex group's web presence was fragmented: each subsidiary had a different design built at different times, with inconsistent typography, conflicting color systems, and no mobile responsiveness. New B2B customers couldn't navigate the group structure, and the sites didn't reflect the scale or credibility of the business.",
      painPoints: [
        "5 separate sites with no shared design language — felt like 5 unrelated companies",
        "No mobile responsiveness — majority of B2B visitors browse on mobile",
        "Inconsistent brand hierarchy — unclear which entity was parent, which was subsidiary",
        "Outdated visual design not reflecting the group's enterprise scale",
        "No clear conversion paths — contact, inquiry, and product pages buried",
      ],
      processHighlights: [
        {
          phase: "Discover",
          what: "Audited all 5 existing sites — catalogued inconsistencies in color, typography, navigation patterns, and content structure. Competitor benchmarking across agri-chemicals and pharma sector websites.",
        },
        {
          phase: "Define",
          what: "Defined a group design system: shared header/footer patterns, typography scale, color family (each brand gets a primary color within a coherent palette), and a common grid. IA redesign for each site.",
        },
        {
          phase: "Design",
          what: "Designed all 5 sites in Figma with the shared system as the foundation. Each site has a unique hero and brand color — but same component library, navigation logic, and responsive grid.",
        },
        {
          phase: "Deliver",
          what: "Delivered complete Figma files per site with responsive specs. Coordinated with IT team for implementation. All 5 sites now live.",
        },
      ],
      solutionHighlights: [
        "safexchemicals.com — Parent company: crop protection, agri-chemicals flagship site",
        "shogunorganics.com — Organic farming and bio-stimulants brand",
        "indoswiss.in — Specialty chemicals and pharma raw materials",
        "briarchemicals.com — Industrial and specialty chemical products",
        "smithnsmith.net — Niche specialty products brand",
      ],
      outcomes: [
        { metric: "5",      label: "Live sites redesigned and launched" },
        { metric: "100%",   label: "Mobile responsive across all sites" },
        { metric: "Unified", label: "Group visual identity established" },
        { metric: "Live",   label: "All sites verifiable at their URLs" },
      ],
      images: [
        // Safex Chemicals
        { src: "/images/safex-sites/safex-hero.png",              alt: "safexchemicals.com — Hero section with product spotlight", caption: "safexchemicals.com · Hero", full: true },
        { src: "/images/safex-sites/safex-crops.png",             alt: "safexchemicals.com — Crops grid (Rice, Wheat, Cotton, Sugarcane…)", caption: "safexchemicals.com · Crops" },
        { src: "/images/safex-sites/safex-weedicides.png",        alt: "safexchemicals.com — Weedicides product listing", caption: "safexchemicals.com · Products" },
        { src: "/images/safex-sites/safex-fertilisers.png",       alt: "safexchemicals.com — Fertilisers section", caption: "safexchemicals.com · Fertilisers" },
        // Shogun Organics
        { src: "/images/safex-sites/shogun-hero.png",             alt: "shogunorganics.com — Hero: Building a Healthier Community", caption: "shogunorganics.com · Hero" },
        { src: "/images/safex-sites/shogun-ai.png",               alt: "shogunorganics.com — Agrochemical A.I. section", caption: "shogunorganics.com · AI Section" },
        { src: "/images/safex-sites/shogun-product-detail.png",   alt: "shogunorganics.com — Product detail: D-trans Allethrin with MSDS", caption: "shogunorganics.com · Product Detail" },
        { src: "/images/safex-sites/shogun-product-detail-2.png", alt: "shogunorganics.com — Product detail: Allethrin", caption: "shogunorganics.com · Product Detail" },
        { src: "/images/safex-sites/shogun-infra.png",            alt: "shogunorganics.com — Infrastructure: Advanced Technical Production Unit", caption: "shogunorganics.com · Infrastructure" },
        // IndoSwiss
        { src: "/images/safex-sites/indoswiss-hero.png",          alt: "indoswiss.in — Hero: Farmers in field", caption: "indoswiss.in · Hero" },
        { src: "/images/safex-sites/indoswiss-products.png",      alt: "indoswiss.in — Accessible. Affordable. Efficient. products page", caption: "indoswiss.in · Products" },
        { src: "/images/safex-sites/indoswiss-network.png",       alt: "indoswiss.in — Find a Representative network page", caption: "indoswiss.in · Network" },
        // Smith N Smith
        { src: "/images/safex-sites/smithnsmith-hero.png",        alt: "smithnsmith.net — Hero: We Are Smith N Smith", caption: "smithnsmith.net · Hero" },
        { src: "/images/safex-sites/smithnsmith-home.png",        alt: "smithnsmith.net — Home navigation icons", caption: "smithnsmith.net · Home" },
        { src: "/images/safex-sites/smithnsmith-products.png",    alt: "smithnsmith.net — Products grid", caption: "smithnsmith.net · Products" },
        { src: "/images/safex-sites/smithnsmith-herbicides.png",  alt: "smithnsmith.net — Herbicides product listing", caption: "smithnsmith.net · Herbicides" },
        // Briar Chemicals
        { src: "/images/safex-sites/briar-hero.png",              alt: "briarchemicals.com — Hero: Your dependable partner for custom synthesis", caption: "briarchemicals.com · Hero" },
        { src: "/images/safex-sites/briar-technologies.png",      alt: "briarchemicals.com — Technologies page: 50+ years experience", caption: "briarchemicals.com · Technologies" },
        { src: "/images/safex-sites/briar-media.png",             alt: "briarchemicals.com — Latest media posts & careers", caption: "briarchemicals.com · Media" },
      ],
      links: {
        live: "https://www.safexchemicals.com",
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
        { src: "/images/freelance/tarot-1.png", alt: "Tarot card — The Fool" },
        { src: "/images/freelance/tarot-2.png", alt: "Tarot card spread" },
        { src: "/images/freelance/tarot-box.png", alt: "Tarot deck box packaging" },
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
        { src: "/images/freelance/liberty-1.png", alt: "Liberty Shoes campaign creative" },
        { src: "/images/freelance/liberty-2.png", alt: "Social media campaign" },
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
        { src: "/images/freelance/alma-1.png", alt: "ALMA Magazine illustration — feature spread" },
        { src: "/images/freelance/alma-2.png", alt: "ALMA Magazine — character illustration" },
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
        { src: "/images/branding/brand-01/cover.png", alt: "Brand Identity — cover" },
        { src: "/images/branding/brand-01/logo.png",  alt: "Logo suite" },
        { src: "/images/branding/brand-01/packaging.png", alt: "Packaging design" },
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
        { src: "/images/branding/brand-02/cover.png", alt: "Brand Identity 02 — cover" },
        { src: "/images/branding/brand-02/logo.png",  alt: "Logo suite" },
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
        { src: "/images/branding/brand-03/cover.png",    alt: "Brand Identity 03 — cover" },
        { src: "/images/branding/brand-03/packaging.png", alt: "Packaging design" },
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
