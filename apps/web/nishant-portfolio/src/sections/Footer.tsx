import type { ReactNode } from "react";
import { personalInfo } from "../constants";
import { useGeoCV } from "../hooks/useGeoCV";
import { cn } from "../lib/cn";
import { container, meta } from "../lib/styles";

const inner = cn(container, "flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between");
const link = "font-mono text-xs text-fg-3 transition-colors duration-150 hover:text-fg";

const EXTERNAL = [
  { name: "LinkedIn", href: personalInfo.linkedin },
  { name: "GitHub", href: personalInfo.github },
  { name: "npm", href: personalInfo.npm },
];

export default function Footer(): ReactNode {
  const { downloadCV } = useGeoCV();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className={inner}>
        <p className={meta}>© {year} {personalInfo.name} · {personalInfo.location}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="/#work" className={link}>Work</a>
          <a href="/#writing" className={link}>Writing</a>
          {EXTERNAL.map((l) => (
            <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={link}>{l.name}</a>
          ))}
          <button type="button" onClick={downloadCV} className={cn(link, "cursor-pointer")}>Resume</button>
        </nav>
      </div>
    </footer>
  );
}
