import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { eyebrow } from "../lib/styles";
import type { TocEntry } from "./markdown";

interface TocProps {
  entries: TocEntry[];
  activeId: string;
}

const item = cn(
  "block py-1.5 pl-3 font-mono text-xs border-l",
  "transition-colors duration-150 hover:text-fg",
);
const toggle = cn(
  "flex w-full items-center justify-between px-4 py-3",
  "font-mono text-xs text-fg-2 border border-line rounded-md",
);

function TocLinks({ entries, activeId, onPick }: TocProps & { onPick?: () => void }): ReactNode {
  return entries.map((entry) => {
    const active = entry.id === activeId;
    return (
      <a
        key={entry.id}
        href={`#${entry.id}`}
        onClick={onPick}
        aria-current={active ? "location" : undefined}
        className={cn(item, entry.level === 3 && "pl-6", active ? "text-accent border-accent" : "text-fg-3 border-line")}
      >
        {entry.text}
      </a>
    );
  });
}

export function TocSidebar(props: TocProps): ReactNode {
  return (
    <nav aria-label="Contents" className="sticky top-20 hidden max-h-toc overflow-y-auto xl:block">
      <p className={cn(eyebrow, "mb-3")}>Contents</p>
      <TocLinks {...props} />
    </nav>
  );
}

export function TocDisclosure(props: TocProps): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8 xl:hidden">
      <button type="button" className={toggle} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>Contents ({props.entries.length})</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <nav aria-label="Contents" className="mt-2 px-1">
          <TocLinks {...props} onPick={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
