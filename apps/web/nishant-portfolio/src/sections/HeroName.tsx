import { useRef, type CSSProperties, type ReactElement } from "react";
import { useHeroNameFx } from "../hooks/useHeroNameFx";

const HERO_ROLES = ["Frontend Engineering", "Design Systems", "AI Dev Tooling", "LLM Evaluation"] as const;

// Farthest layer first so each nearer layer paints over it.
const EXTRUDE_STEPS = [3, 2, 1] as const;

const FIRST_STYLE: CSSProperties = { display: "block", paddingTop: "0.1em", paddingBottom: "0.1em", paddingLeft: "0.1em", marginTop: "-0.1em", marginBottom: "-0.05em" };
const LAST_STYLE: CSSProperties = { display: "block", paddingBottom: "0.22em", paddingRight: "0.1em", marginBottom: "-0.22em", marginRight: "-0.1em" };

// Accent copies stacked behind the real glyphs; aria-hidden and unselectable,
// so the text stays one copy. Their offsets are driven in useHeroNameFx.
function Extrude({ text }: { text: string }): ReactElement {
  return (
    <span className="hero-extrude" aria-hidden="true">
      {EXTRUDE_STEPS.map((i) => (
        <span key={i} data-i={i} data-hi={i > 2 ? "" : undefined} style={{ "--i": i } as CSSProperties}>{text}</span>
      ))}
    </span>
  );
}

function RoleDots({ scramble }: { scramble: boolean }): ReactElement {
  return (
    <>
      {HERO_ROLES.map((role, i) => (
        <span key={role} style={{ display: "contents" }}>
          {i > 0 && <span className="hero-role-dot" />}
          {scramble
            ? <span className="hero-role-word" data-text={role}>{role}</span>
            : <span>{role}</span>}
        </span>
      ))}
    </>
  );
}

// The visual name. Decorative duplicates (outline, extrusion, spotlight copy)
// live inside, so the whole block is aria-hidden and Hero renders a clean <h1>.
export function HeroName(): ReactElement {
  const blockRef = useRef<HTMLDivElement>(null);
  useHeroNameFx(blockRef);

  return (
    <div ref={blockRef} className="hero-name-block" aria-hidden="true">
      <span className="hero-name-first" style={{ ...FIRST_STYLE, overflow: "hidden" }}>
        <span className="hero-name-depth hero-name-depth-first">Nishant</span>
        <span className="hero-name-first-inner" style={{ display: "block" }}>
          Nishant
          <Extrude text="Nishant" />
        </span>
      </span>

      <span className="hero-role-row"><RoleDots scramble /></span>

      <span className="hero-name-last" style={{ ...LAST_STYLE, overflow: "hidden" }}>
        <span className="hero-name-depth hero-name-depth-last">Chaudhary</span>
        <span className="hero-name-last-inner" style={{ display: "block" }}>
          Chaudhary
          <Extrude text="Chaudhary" />
        </span>
      </span>

      {/* Spotlight: fixed-size masked window moved by transform; its bright
          copy of the whole name is counter-translated to stay aligned. */}
      <span className="hero-spot">
        <span className="hero-spot-inner">
          <span className="hero-name-first" style={FIRST_STYLE}>Nishant</span>
          <span className="hero-role-row" style={{ visibility: "hidden" }}><RoleDots scramble={false} /></span>
          <span className="hero-name-last" style={LAST_STYLE}>Chaudhary</span>
        </span>
      </span>
    </div>
  );
}
