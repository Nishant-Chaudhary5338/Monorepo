export interface Ability {
  imgPath: string;
  title: string;
  desc: string;
}

export const abilities: Ability[] = [
  {
    imgPath: "/images/seo.png",
    title: "Plugin-based Micro-frontends",
    desc: "Replaced redeploy-per-feature with runtime feature injection on Vite Module Federation — independent team deploys, sub-minute plugin onboarding, no shared release trains.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Custom MCP Tooling",
    desc: "Bespoke Model Context Protocol servers for scaffolding, code review, and test generation — automating ~65% of routine frontend work into one-line invocations.",
  },
  {
    imgPath: "/images/time.png",
    title: "Headless Design Systems",
    desc: "Production-grade headless UI libraries powering dashboards across 6 product teams. Drag-drop, dynamic resizing, API polling, and token-driven theming out of the box.",
  },
  {
    imgPath: "/images/ideas.svg",
    title: "AI-Native Team Leadership",
    desc: "Trained 30+ engineers across 5 Samsung R&D teams on Cline, custom MCP tooling, and agentic workflows. Code-review standards and CI/CD infrastructure across a 5-person team.",
  },
];

export interface LogoIcon {
  imgPath: string;
}

export const logoIconsList: LogoIcon[] = [
  { imgPath: "/images/logos/react.png" },
  { imgPath: "/images/logos/node.png" },
  { imgPath: "/images/logos/git.svg" },
  { imgPath: "/images/logos/three.png" },
  { imgPath: "/images/logos/python.svg" },
  { imgPath: "/images/logos/react.png" },
  { imgPath: "/images/logos/node.png" },
  { imgPath: "/images/logos/git.svg" },
  { imgPath: "/images/logos/three.png" },
  { imgPath: "/images/logos/python.svg" },
  { imgPath: "/images/logos/react.png" },
];

// Tech logos used in marquee - these are the actual tech stack
export const techLogos: LogoIcon[] = [
  { imgPath: "/images/logos/react.png" },
  { imgPath: "/images/logos/node.png" },
  { imgPath: "/images/logos/git.svg" },
  { imgPath: "/images/logos/three.png" },
  { imgPath: "/images/logos/python.svg" },
];

export interface SocialLink {
  name: string;
  imgPath: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    imgPath: "/images/linkedin.png",
    url: "https://linkedin.com/in/nishantchaudhary",
  },
  {
    name: "GitHub",
    imgPath: "/images/fb.png",
    url: "https://github.com/nishantchaudhary5338",
  },
  {
    name: "X",
    imgPath: "/images/x.png",
    url: "https://x.com/nishantdev",
  },
];

export const socialImgs = socialLinks;