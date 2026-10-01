export interface PersonalInfo {
  name: string;
  title: string;
  company: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  npm: string;
  headline: string;
  lead: string;
  availability: string;
  availabilityShort: string;
  bio: string[];
}

export const personalInfo: PersonalInfo = {
  name: "Nishant Chaudhary",
  title: "Senior Frontend Engineer",
  company: "Samsung Electronics",
  location: "New Delhi, India",
  email: "nishantchaudhary.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/nishant-chaudhary-170719246/",
  github: "https://github.com/Nishant-Chaudhary5338",
  npm: "https://www.npmjs.com/~nishant-chaudhary",
  headline: "I build fast, accessible React and TypeScript apps for large teams.",
  lead:
    "About five years of product work at DevsLane, Safex and Samsung, with most of my attention on accessibility, performance and the small details. Alongside it I build the design systems and AI developer tools that keep big codebases consistent: three open-source npm packages and a merged pull request to Vercel's Turborepo.",
  availability:
    "Open to remote roles with EU teams. I work 12:00 to 21:00 IST, which covers CET core hours.",
  availabilityShort: "Open to remote roles with EU teams · covers CET hours",
  bio: [
    "I'm a frontend engineer with about five years of production React and TypeScript. At Samsung I work on internal platforms that several product teams build on: a micro-frontend shell, a shared design system, and the dashboards and test tools that sit on top of them.",
    "I care most about the parts people notice. Pages should load fast, work with a keyboard and a screen reader, and behave the same way in every team's app. Most of my side work is tooling that makes that easier, and I publish it as open-source npm packages.",
  ],
};
