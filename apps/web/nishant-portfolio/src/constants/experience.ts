export interface ExpRole {
  company: string;
  title: string;
  date: string;
  location: string;
  highlights: string[];
  stack: string[];
}

export const roles: ExpRole[] = [
  {
    company: "Samsung Electronics",
    title: "Senior Frontend Engineer",
    date: "Jul 2024 to now",
    location: "New Delhi",
    highlights: [
      "Built a plugin-based micro-frontend platform on Vite Module Federation. Adding a new app now takes **under a minute** instead of hours, across six product squads.",
      "Led the move from CRA and Webpack to Vite and Turborepo, alongside a shared design system that brought component reuse across teams **close to 60%**.",
      "Built an AI-assisted workflow of 20+ custom MCP servers that handles **60 to 70%** of routine frontend work, and trained 30+ engineers across five teams to use it.",
      "Lead a **team of five** on the TVPlus Test Suite, the web app used to write, schedule and monitor automated tests on remote TV farms.",
      "Replaced five legacy portals with one app for incident dashboards, logging and metadata, and built its HLS.js video player, which cut LCP by **30%**.",
    ],
    stack: ["React", "TypeScript", "Vite", "Module Federation", "Turborepo", "Tailwind CSS", "HLS.js"],
  },
  {
    company: "Safex Chemicals",
    title: "Web Developer",
    date: "Mar 2023 to Jun 2024",
    location: "Delhi",
    highlights: [
      "Built a B2B ordering platform in React and Node for **25,000+ customers**. Repeat orders went up 22% and support tickets went down about 30%.",
      "Cut initial load time from **4.2s to 2.5s** with code splitting, lazy loading and bundle work.",
      "Built a SAP-connected portal for **500+ staff** across eight departments, with Azure AD and Google sign-in and role-based access.",
      "Built a training platform with video lessons and quizzes for **1,500+ employees**.",
    ],
    stack: ["React", "Node.js", "Express", "Azure AD", "OAuth 2.0", "SAP"],
  },
  {
    company: "DevsLane",
    title: "Frontend Engineer",
    date: "Nov 2021 to Mar 2023",
    location: "Noida",
    highlights: [
      "Shipped **eight client products** from Figma and XD designs.",
      "Built a Storybook library of **40+ accessible components** that the team standardised on.",
      "Brought the UI up to **WCAG 2.1 AA**: semantic markup, keyboard navigation and visible focus.",
      "Ran the CodeYogi coding programme for **200+ students**: planned cohorts, led the mentors and built the learning platform.",
    ],
    stack: ["React", "JavaScript", "Storybook", "REST APIs", "Figma"],
  },
];

export interface SideRole {
  title: string;
  org: string;
  date: string;
  text: string;
}

export const sideRole: SideRole = {
  title: "AI model evaluation",
  org: "Handshake, micro1, Snorkel AI",
  date: "2026 to now",
  text: "Alongside my main role I write evaluation tasks and graded benchmarks for frontier AI models. Seeing where models fail up close shapes how I build AI features and developer tools.",
};
