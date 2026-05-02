export interface CaseStudyMeta {
  slug: string;
  title: string;
  role: string;
  years: string;
  stack: string;
  status: string;
  description: string;
}

export const caseStudyMeta: CaseStudyMeta[] = [
  {
    slug: "headless-dashboard-library",
    title: "Headless Dashboard Library",
    role: "Solo lead frontend engineer",
    years: "2024 – Present",
    stack: "React 19 · Zustand · dnd-kit · re-resizable · Framer Motion · Recharts · Nivo · TypeScript strict",
    status: "In production · 4 apps · ~12 product teams",
    description: "A headless composition framework that handles layout, drag-drop, resize, widget registration, persistence, polling, and widget-to-widget events. 11 built-in widgets, 9,026 lines of TypeScript.",
  },
  {
    slug: "ui-component-library",
    title: "Shared UI Component Library",
    role: "Solo lead frontend engineer",
    years: "2024 – Present",
    stack: "React 19 · Radix UI · Tailwind CSS v4 · CVA · TanStack Table · TypeScript strict",
    status: "In production · 4 apps · ~12 product teams",
    description: "A 45-component React library with zero forks across 12 teams. Custom 12-step design token system, type-safe variants via CVA, 79 test files, 47 Storybook stories.",
  },
];
