export interface ExpMetric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface ExpLink {
  label: string;
  href: string;
}

export interface ExpCard {
  title: string;
  company: string;
  date: string;
  location: string;
  current?: boolean;
  links?: ExpLink[];
  metrics: ExpMetric[];
  // Bullets say what was built; the numbers live in `metrics`, so each one
  // appears once on the card.
  highlights: string[];
  techStack: string[];
}

export const expCards: ExpCard[] = [
  {
    title: "Senior Frontend Engineer",
    company: "Samsung Electronics",
    date: "Jul 2024 – Present",
    location: "New Delhi, India",
    current: true,
    links: [
      { label: "Case study: shared UI library", href: "/work/ui-component-library" },
      { label: "Case study: dashboard library", href: "/work/headless-dashboard-library" },
    ],
    metrics: [
      { value: 1, prefix: "<", suffix: " min", label: "to add a new app, down from hours" },
      { value: 65, prefix: "~", suffix: "%", label: "of routine frontend work automated" },
      { value: 30, suffix: "+", label: "engineers trained across 5 teams" },
      { value: 6, label: "product squads on the platform" },
    ],
    highlights: [
      "Built a plugin-based micro-frontend platform on Vite Module Federation, so teams add apps at runtime instead of redeploying the shell",
      "Led the move from CRA and Webpack to Vite and Turborepo, alongside a shared design system that brought component reuse close to 60%",
      "Built an AI-assisted workflow of 20+ custom MCP servers for scaffolding, refactoring and code standards, and taught other teams to use it",
      "Lead a team of five on the TVPlus Test Suite, the web app used to write, schedule and monitor automated tests on remote TV farms",
      "Replaced five legacy portals with one app for incident dashboards, logging and metadata",
      "Built an HLS.js video player with web and service workers for adaptive streaming and caching, cutting LCP by 30%",
    ],
    techStack: ["React", "TypeScript", "Vite", "Monorepo", "MCP Tools", "HLS.js", "Tailwind CSS"],
  },
  {
    title: "AI Model Evaluation & Benchmark Authoring",
    company: "Handshake · micro1 · Snorkel AI · Turing",
    date: "2026 – Present",
    location: "Remote, alongside Samsung",
    current: true,
    links: [
      { label: "How I write tasks frontier coding agents fail", href: "/writing/how-i-write-tasks-frontier-coding-agents-fail" },
      { label: "Grading the grader", href: "/writing/grading-the-grader-rubrics-and-verifiers" },
    ],
    metrics: [
      { value: 4, label: "evaluation platforms" },
    ],
    highlights: [
      "Write adversarial benchmark tasks for frontier coding agents: real engineering problems an expert can solve, where a strong model fails for a genuine reason, not a trick",
      "Design the rubrics, verifiers and grading guidance behind those tasks, and test them against reward hacking so a pass actually means the work is right",
      "Read model trajectories and pass@k results to find where and why agents fail, then turn that into the next task's design",
      "Review and repair SWE tasks built from real pull requests as an expert contributor, and author rubric-graded document editing and generation tasks",
      "Write model-breaking engineering problem statements with clear success criteria and an independent way to check them",
    ],
    techStack: ["Python", "Docker", "pytest", "Rubric Design", "pass@k", "Red-teaming", "LLM Evaluation"],
  },
  {
    title: "Web Developer",
    company: "Safex Chemicals India Pvt Ltd",
    date: "Mar 2023 – Jun 2024",
    location: "Delhi, India",
    metrics: [
      { value: 25000, suffix: "+", label: "B2B users served" },
      { value: 22, prefix: "~", suffix: "%", label: "more repeat orders" },
      { value: 30, prefix: "~", suffix: "%", label: "fewer support tickets" },
      { value: 2.5, suffix: "s", label: "load time, down from 4.2s" },
    ],
    highlights: [
      "Built a B2B ordering platform in React and Node with order tracking, bulk ordering and analytics",
      "Cut initial load time with code splitting, lazy loading, memoisation and bundle work",
      "Built a SAP-connected portal for 500+ staff across eight departments, replacing three legacy systems",
      "Added Azure AD and Google sign-in with role-based access across six user roles",
      "Built a training platform with video lessons and quizzes for 1,500+ employees",
    ],
    techStack: ["React", "Azure AD", "MSAL", "OAuth 2.0", "SAP", "Node.js", "Express"],
  },
  {
    title: "Frontend Engineer",
    company: "DevsLane",
    date: "Nov 2021 – Mar 2023",
    location: "Noida, India",
    metrics: [
      { value: 8, suffix: "+", label: "client products shipped" },
      { value: 40, suffix: "+", label: "components in the shared library" },
    ],
    highlights: [
      "Turned Figma and XD designs into pixel-perfect production apps for client teams",
      "Built the Storybook component library the team standardised on",
      "Brought the UI up to WCAG 2.1 AA: semantic markup, keyboard navigation and visible focus",
      "Ran the CodeYogi coding programme for 200+ students: planned cohorts, led the mentors and built the learning platform",
    ],
    techStack: ["React", "JavaScript", "Storybook", "REST APIs", "Figma", "CSS"],
  },
];
