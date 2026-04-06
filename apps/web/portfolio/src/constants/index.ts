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
};

// ─── Hero role slider ──────────────────────────────────────
export const heroRoles = [
  "Senior UI/UX Designer",
  "UX Researcher & Strategist",
  "Illustrator & Brand Designer",
];

// ─── Stats ─────────────────────────────────────────────────
export const stats = [
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 3, suffix: "", label: "Fortune-tier Companies" },
  { value: 15, suffix: "K+", label: "Users Impacted" },
  { value: 20, suffix: "+", label: "Projects Delivered" },
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
      "Figma Plugins",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Procreate",
      "Adobe XD",
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
      "Framer AI",
      "AI-Assisted Prototyping",
      "Design Tokens (W3C)",
      "Prompt Engineering for Design",
      "Generative UI Exploration",
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
      { value: "3", label: "Enterprise Products" },
      { value: "LMS", label: "Portal Shipped" },
      { value: "↑25%", label: "Engagement Lift" },
    ],
    highlights: [
      "Designed intuitive UX for internal enterprise tools — intranet portal and LMS — used across global Samsung teams",
      "Led UI/UX and brand identity for Smith n Smith, delivering a fully responsive website with a cohesive visual system",
      "Designed social media creatives, reels, and brand kits for Spectra Hospitality (hotels & wellness startups)",
      "Conducted end-to-end user research and usability testing to drive evidence-based design decisions",
      "Partnered with cross-functional teams (product, engineering, marketing) to align design strategy with business objectives",
    ],
    tags: ["Figma", "User Research", "Design Systems", "LMS UX", "Brand Identity"],
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
      { value: "3", label: "Brand Websites" },
      { value: "15K+", label: "Farmers Reached" },
      { value: "Android", label: "App Shipped" },
    ],
    highlights: [
      "Designed the KIWI (Kisan Window) Android app for 15,000+ farmers — bilingual UX with rural accessibility at its core",
      "Launched 3 brand websites with enhanced UX, visual identity, and conversion-focused design",
      "Produced motion graphics for brand narratives and product launch campaigns",
      "Collaborated with product, dev, and marketing teams across the full design-to-delivery pipeline",
      "Designed packaging for Kiwi Kisan Window product line — blending sustainability with shelf-impact",
    ],
    tags: ["Mobile UX", "Android App", "Brand Websites", "Motion Graphics", "Packaging"],
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
      "Built reusable design templates improving team consistency and delivery speed",
      "Collaborated with marketing teams managing multiple campaign tracks under tight deadlines",
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
      "Delivered high-quality visuals in close collaboration with marketing and account teams",
    ],
    tags: ["Social Media", "Illustrator", "Procreate", "Photoshop", "InDesign"],
  },
];

// ─── Freelance & Creative Work ─────────────────────────────
export const freelanceWork = [
  {
    title: "Tarot Card Deck — Healing Urja",
    description: "78-card deck with symbolic illustration in Procreate & Illustrator",
    period: "Sep 2019 – Apr 2020",
  },
  {
    title: "ALMA Magazine Illustrations",
    description: "Editorial illustrations and characters for contemporary print magazine",
    period: "Jan – Dec 2022",
  },
  {
    title: "Packaging Design — Prasuma India",
    description: "Print-ready labels and brand kits for FMCG brand",
    period: "May – Aug 2019",
  },
  {
    title: "Namami Gange Wall Mural (Govt. of India)",
    description: "Large-scale public mural in Dehradun for environmental awareness",
    period: "2018",
  },
  {
    title: "AIESEC — Global Village Event",
    description: "Event branding: logo, visual identity, and promotional campaign",
    period: "Jul – Aug 2018",
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

// ─── Work / Projects ───────────────────────────────────────
export const projects = [
  {
    id: "kiwi",
    title: "KIWI — Kisan Window",
    category: "Mobile App · UX Design",
    description:
      "A bilingual Android app empowering 15,000+ Indian farmers with expert agricultural advice, product insights, and market connections — designed with rural accessibility at its core.",
    tags: ["Mobile UX", "Research-led", "Android", "Accessibility"],
    gradient: "linear-gradient(135deg, #1a0a35 0%, #3d1a7a 50%, #1a0a35 100%)",
    accentColor: "#9d72ff",
    featured: true,
    company: "Safex Chemicals",
  },
  {
    id: "samsung",
    title: "Samsung LMS & Intranet Portal",
    category: "Enterprise UX · Design Systems",
    description:
      "End-to-end UX for Samsung's internal LMS and intranet portal — research-driven, accessible, and built on a scalable component system for global teams.",
    tags: ["Enterprise UX", "Design Systems", "Figma", "User Research"],
    gradient: "linear-gradient(135deg, #0a1a00 0%, #1a3500 50%, #0a1a00 100%)",
    accentColor: "#f5a623",
    featured: false,
    company: "Samsung Electronics",
  },
  {
    id: "tarot",
    title: "Tarot Deck — Healing Urja",
    category: "Illustration · Brand Identity",
    description:
      "A hand-crafted 78-card Tarot deck — each card uniquely illustrated with symbolic imagery, custom typography, and a cohesive mystical visual language.",
    tags: ["Illustration", "Procreate", "Brand Identity"],
    gradient: "linear-gradient(135deg, #1a0020 0%, #3a0050 50%, #1a0020 100%)",
    accentColor: "#ff6b9d",
    featured: false,
    company: "Healing Urja",
  },
  {
    id: "alma",
    title: "ALMA Magazine",
    category: "Editorial · Illustration",
    description:
      "A year-long creative collaboration producing conceptual illustrations and editorial characters — surreal storytelling with refined visual aesthetics.",
    tags: ["Editorial", "Character Design", "Illustration"],
    gradient: "linear-gradient(135deg, #001a1a 0%, #003535 50%, #001a1a 100%)",
    accentColor: "#4cc9f0",
    featured: false,
    company: "ALMA Magazine",
  },
  {
    id: "liberty",
    title: "Liberty Shoes Campaigns",
    category: "Brand Design · Motion",
    description:
      "Multi-platform brand campaigns — motion graphics, social content, GIFs, and large-format print assets driving a 25% engagement lift.",
    tags: ["Campaign Design", "Motion", "Brand"],
    gradient: "linear-gradient(135deg, #1a0800 0%, #3d1800 50%, #1a0800 100%)",
    accentColor: "#ff9b47",
    featured: false,
    company: "Liberty Shoes",
  },
  {
    id: "namami",
    title: "Namami Gange Wall Mural",
    category: "Public Art · Social Impact",
    description:
      "A large-scale mural painted in Dehradun as part of the Government of India's campaign — monumental environmental public art.",
    tags: ["Mural", "Public Art", "Social Impact"],
    gradient: "linear-gradient(135deg, #001a08 0%, #003515 50%, #001a08 100%)",
    accentColor: "#4ade80",
    featured: false,
    company: "Govt. of India",
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

// ─── Nav links ─────────────────────────────────────────────
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
