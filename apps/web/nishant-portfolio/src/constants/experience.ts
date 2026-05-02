export interface ExpCard {
  review: string;
  imgPath: string;
  logoPath: string;
  title: string;
  company: string;
  date: string;
  location: string;
  highlights: string[];
  responsibilities: string[];
  techStack: string[];
}

export const expCards: ExpCard[] = [
  {
    review:
      "Nishant's AI-driven development system transformed our engineering workflow. His ability to automate 60-70% of repetitive tasks while maintaining code quality is remarkable. A true architect who thinks about developer experience.",
    imgPath: "/images/logo-work/logo-samsung.png",
    logoPath: "/images/logo1.png",
    title: "Senior Frontend Engineer",
    company: "Samsung Electronics",
    date: "Jul 2024 – Present",
    location: "New Delhi, India",
    highlights: [
      "Plugin onboarding reduced from days to <60s via Vite Module Federation runtime injection",
      "~65% of frontend workflows automated via custom MCP servers on Turborepo",
      "Trained 30+ engineers across 5 Samsung R&D teams on AI-native development",
    ],
    responsibilities: [
      "Architected an AI-driven development system using Monorepo architecture and custom MCP tools, automating UI generation, refactoring, and code standardization — reducing 60–70% of repetitive frontend work and improving development speed by ~3x",
      "Built a reusable headless UI framework for highly interactive dashboards with plug-and-play support for grid layouts, drag-and-drop, dynamic resizing, API polling, theming, and responsive design — reducing dev time by ~60%",
      "Delivered a web-based Test Suite (React + Vite + TypeScript) including admin portal and dashboard for authoring, scheduling, and monitoring automated test cases across server runners and remote DTV farm",
      "Engineered a high-performance browser-based video player using HLS.js with Web and Service Workers for adaptive streaming, intelligent caching, and real-time playback monitoring",
      "Architected a unified SPA replacing five legacy portals, integrating incident dashboards, HLS streaming, structured logging, and metadata services",
    ],
    techStack: ["React", "TypeScript", "Vite", "Monorepo", "MCP Tools", "HLS.js", "Tailwind CSS"],
  },
  {
    review:
      "Nishant delivered a robust SAP web interface and implemented enterprise-grade SSO solutions. His e-commerce platform work serving 25,000+ B2B customers demonstrated exceptional attention to scalability and user experience.",
    imgPath: "/images/logo-work/logo-safex.jpeg",
    logoPath: "/images/logo2.png",
    title: "Web Developer",
    company: "Safex Chemicals India Pvt Ltd",
    date: "Mar 2023 – Jun 2024",
    location: "Delhi, India",
    highlights: [
      "Implemented Azure AD SSO and Google SSO for 25,000+ B2B customers across 8 departments",
      "B2B e-commerce: ~22% lift in repeat orders, ~30% drop in support tickets, load time cut from 4.2s to 2.5s",
      "Consolidated three legacy systems into a single React/Node interface for 500+ users",
    ],
    responsibilities: [
      "Implemented Azure AD SSO (MSAL) and Google SSO (OAuth 2.0) with JWT-based RBAC across 6 user roles for secure, seamless authentication",
      "Developed a SAP web interface integrating the SAP Cloud Platform with React via Node.js + Express backend, streamlining enterprise data workflows",
      "Built a B2B e-commerce platform serving 25,000+ customers — order tracking, bulk ordering, and analytics integration drove ~22% lift in repeat orders and ~30% reduction in support tickets",
      "Engineered an LMS with Firebase-backed video streaming, quiz modules, and real-time interactions for 1,500+ employees",
      "Optimized React applications via lazy loading, code splitting, memoization, and bundle optimization — reducing initial load from 4.2s to 2.5s",
    ],
    techStack: ["React", "Azure AD", "MSAL", "OAuth 2.0", "SAP", "Node.js", "Express"],
  },
  {
    review:
      "Nishant's ability to convert complex Figma designs into pixel-perfect, production-ready applications was impressive. His reusable component libraries accelerated our entire team's development cycles.",
    imgPath: "/images/logo-work/logo2-devslane.jpeg",
    logoPath: "/images/logo3.png",
    title: "Frontend Engineer",
    company: "DevsLane",
    date: "Nov 2021 – Mar 2023",
    location: "Noida, India",
    highlights: [
      "Built responsive, pixel-perfect dashboards from Figma/Adobe XD mockups",
      "Created reusable component libraries with Storybook",
      "Enhanced accessibility with semantic HTML and a11y best practices",
    ],
    responsibilities: [
      "Built responsive, pixel-perfect dashboards in React, converting Figma/Adobe XD mockups into production-ready applications with attention to detail",
      "Integrated REST APIs with secure data handling, validation, and error management, streamlining CRUD operations across multiple modules",
      "Created reusable component libraries with Storybook, enabling faster development cycles and consistent UI across multiple projects",
      "Enhanced accessibility by applying semantic HTML and a11y best practices, improving usability and WCAG compliance standards",
    ],
    techStack: ["React", "JavaScript", "Storybook", "REST APIs", "Figma", "CSS"],
  },
];

export interface ExpLogo {
  name: string;
  imgPath: string;
}

export const expLogos: ExpLogo[] = [
  { name: "Samsung", imgPath: "/images/logo1.png" },
  { name: "Safex", imgPath: "/images/logo2.png" },
  { name: "DevsLane", imgPath: "/images/logo3.png" },
];