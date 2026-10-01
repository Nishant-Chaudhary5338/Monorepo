export interface CounterItem {
  value: number;
  suffix: string;
  label: string;
}

// Career-level numbers only; per-role numbers live on the Experience cards
// so nothing on the page is repeated.
export const counterItems: CounterItem[] = [
  { value: 5, suffix: "", label: "Years of production React and TypeScript" },
  { value: 3, suffix: "", label: "Open-source npm packages" },
  { value: 4, suffix: "", label: "AI evaluation platforms" },
  { value: 4.1, suffix: "k", label: "npm downloads in the past year" },
];
