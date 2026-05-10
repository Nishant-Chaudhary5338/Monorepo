export interface ApproachStep {
  num:    string;
  title:  string;
  timing: string;
  body:   string;
}

export const approachSteps: ApproachStep[] = [
  {
    num:    "01",
    title:  "LISTEN",
    timing: "2 weeks. Diagnostic.",
    body:   "Audit existing accounts, find conversion leaks, understand the funnel end-to-end.",
  },
  {
    num:    "02",
    title:  "PLAN",
    timing: "1 week. Architecture.",
    body:   "Design the campaign + funnel architecture, set the metrics we'll measure, draft creative briefs.",
  },
  {
    num:    "03",
    title:  "RUN",
    timing: "2–12 weeks. Execute.",
    body:   "Launch campaigns, ship landing pages, build the tracking infrastructure.",
  },
  {
    num:    "04",
    title:  "ITERATE",
    timing: "Ongoing. Compound.",
    body:   "Weekly optimisation, A/B tests, attribution audits, monthly reporting cadence.",
  },
];
