export interface TechStackIcon {
  name: string;
  modelPath: string;
  scale: number;
  rotation: [number, number, number];
}

export interface TechStackImg {
  name: string;
  imgPath: string;
}

export const techStackIcons: TechStackIcon[] = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "TypeScript",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Node.js",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Three.js / 3D",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Git & CI/CD",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

export const techStackImgs: TechStackImg[] = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "TypeScript",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Node.js",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Three.js / 3D",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Git & CI/CD",
    imgPath: "/images/logos/git.svg",
  },
];

export interface CounterItem {
  value: number;
  suffix: string;
  label: string;
}

export const counterItems: CounterItem[] = [
  { value: 60, suffix: "s", label: "Plugin onboarding — down from days" },
  { value: 65, suffix: "%", label: "Frontend workflows automated via MCP" },
  { value: 30, suffix: "+", label: "Engineers trained on AI-assisted dev" },
  { value: 6, suffix: "", label: "Product teams on shared headless UI" },
];
