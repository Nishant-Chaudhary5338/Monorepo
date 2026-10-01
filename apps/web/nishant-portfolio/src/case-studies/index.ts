export interface CaseStudyMeta {
  slug: string;
  name: string;
  title: string;
  role: string;
  years: string;
  stack: string;
  status: string;
  summary: string;
  description: string;
}

export const caseStudyMeta: CaseStudyMeta[] = [
  {
    slug: "ui-component-library",
    name: "Shared UI library",
    title: "shared-packages/ui",
    role: "Solo, no designer",
    years: "2024 to now",
    stack: "React 19 · Radix UI · Tailwind CSS v4 · CVA · TanStack Table · TypeScript strict",
    status: "The UI standard for the React monorepo; new teams adopt it when they join",
    summary:
      "**45 React components** on Radix UI and Tailwind CSS v4, built solo. It became the UI standard for the React monorepo, with a data table that respects roles and forms generated from Zod schemas.",
    description:
      "A 45-component React library built solo. It is the shared UI foundation for our monorepo migration and every new team adopts it. Includes a data table with role-based access, forms generated from Zod, and docs written for AI tools as well as people.",
  },
  {
    slug: "headless-dashboard-library",
    name: "Dashboard library",
    title: "interactive-dashboard-library",
    role: "Solo, personal initiative",
    years: "2024 to now",
    stack: "React 19 · Zustand · dnd-kit · re-resizable · Framer Motion · Recharts · Nivo · TypeScript strict",
    status: "In production in monitoring, analytics and customer-facing apps",
    summary:
      "A headless framework for interactive dashboards: drag, drop, resize, widget registration and saved layouts. It took teams from static dashboards to interactive ones, and runs in **4 production apps**.",
    description:
      "A headless framework for interactive dashboards: drag, drop, resize, responsive widget views and live endpoint config. Published as an internal package. Teams went from static dashboards to fully interactive ones.",
  },
];
