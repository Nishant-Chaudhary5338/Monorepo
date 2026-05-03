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
    title: "interactive-dashboard-library",
    role: "Solo — personal initiative",
    years: "2024 – Present",
    stack: "React 19 · Zustand · dnd-kit · re-resizable · Framer Motion · Recharts · Nivo · TypeScript strict",
    status: "In production · monitoring, analytics, and customer-facing apps",
    description: "A headless framework for interactive dashboards — drag, drop, resize, responsive widget views, real-time endpoint config. Published as an internal GitHub package. Teams went from static dashboards to fully interactive ones.",
  },
  {
    slug: "ui-component-library",
    title: "shared-packages/ui",
    role: "Solo — no designer",
    years: "2024 – Present",
    stack: "React 19 · Radix UI · Tailwind CSS v4 · CVA · TanStack Table · TypeScript strict",
    status: "UI standard for the React monorepo — every new team adopts it on join",
    description: "45-component React library built solo. The shared UI foundation for our monorepo migration — every new team adopts it as their standard. DataTable with RBAC, AutoForm from Zod, AI-native docs.",
  },
];
