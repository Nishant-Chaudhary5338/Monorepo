export interface Ability {
  imgPath: string;
  title: string;
  desc: string;
}

export const abilities: Ability[] = [
  {
    imgPath: "/images/seo.png",
    title: "AI-Driven Automation",
    desc: "Built custom MCP tools and Monorepo systems that automate 60-70% of repetitive frontend tasks, accelerating development speed by 3x.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reusable UI Frameworks",
    desc: "Architecting headless, modular component systems with design tokens, Storybook, and TypeScript contracts for scalable design systems.",
  },
  {
    imgPath: "/images/time.png",
    title: "Performance Engineering",
    desc: "Optimizing React apps with code splitting, lazy loading, virtualization, and caching — achieving 40% faster load times and 30% better data fetching.",
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