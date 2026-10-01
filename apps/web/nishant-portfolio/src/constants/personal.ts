export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  tagline: string;
  bio: string;
}

export const personalInfo: PersonalInfo = {
  name: "Nishant Chaudhary",
  title: "Senior Frontend Engineer",
  location: "New Delhi, India",
  email: "nishantchaudhary.dev@gmail.com",
  phone: "+91 9560025338",
  linkedin: "https://www.linkedin.com/in/nishant-chaudhary-170719246/",
  github: "https://github.com/Nishant-Chaudhary5338",
  tagline: "I build fast, accessible React and TypeScript apps for large teams, plus the design systems and AI tooling behind them. I also design the benchmark tasks, rubrics and verifiers used to evaluate frontier AI models.",
  bio: "Senior Frontend Engineer at Samsung with about five years of production React and TypeScript. I build interfaces that load fast, work with a keyboard and a screen reader, and behave the same way in every team's app, along with the design systems, micro-frontend platforms and MCP tooling behind them. Alongside that I work in AI model evaluation for Handshake, micro1, Snorkel AI and Turing: I write the hard, fair tasks that frontier models get tested on, and the rubrics and verifiers that grade them.",
};
