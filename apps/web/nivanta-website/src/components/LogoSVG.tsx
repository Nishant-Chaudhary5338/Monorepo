/**
 * SVG recreation of the Silvanza Resort by Nivanta logo.
 * Uses the feather-wave mark from brand guidelines + Cormorant Garamond text.
 *
 * When the client saves the PNG files to /public/, switch Navbar to use:
 *   <img src="/logo-light.png" alt="Silvanza Resort by Nivanta" height={52} className="h-13 w-auto" />
 *
 * PNG placement:
 *   public/logo-light.png  — white bg version (for scrolled navbar, footer dark bg with screen blend)
 *   public/logo-dark.png   — dark green bg version (social media / OG use only)
 */

/** The feather-wave mark from the Silvanza brand guidelines */
export function FeatherMark({ className = "w-16 h-12" }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 90 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 4 sweeping grass/feather blades — outermost (cream) to innermost (dark gold) */}
      {/* Brand colors: cream → gold-pale → gold → gold-dark */}
      <path
        d="M 50 66 Q 24 46 4 4"
        stroke="#E8DDB8"
        strokeWidth="9.5"
        strokeLinecap="round"
        opacity="0.82"
      />
      <path
        d="M 52 66 Q 30 42 16 2"
        stroke="#D4B870"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 55 66 Q 38 37 30 1"
        stroke="#B98F39"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M 58 66 Q 46 32 42 0"
        stroke="#A69045"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Full logo with feather mark — for footer and full-page use */
export function LogoFull({ variant = "light" }: { variant?: "light" | "dark" }): React.JSX.Element {
  const isLight = variant === "light";
  const textColor = isLight ? "#FAF7F0" : "#032105";
  const goldText  = isLight ? "#D4B870" : "#B98F39";
  const byColor   = isLight ? "rgba(212,184,112,0.7)" : "rgba(114,91,41,0.8)";

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      <FeatherMark className="w-20 h-14" />
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: textColor,
          lineHeight: 1.1,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        SILVANZA<br />RESORT
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontSize: "0.8rem",
          color: byColor,
        }}
      >
        by
      </span>
      <span
        style={{
          fontFamily: "'Jost', system-ui, sans-serif",
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.28em",
          color: goldText,
          textTransform: "uppercase",
        }}
      >
        ⊙ NIVANTA
      </span>
    </div>
  );
}

/** Compact wordmark for the navbar */
export function LogoWordmark({ scrolled }: { scrolled: boolean }): React.JSX.Element {
  const primary = scrolled ? "#032105" : "#FAF7F0";
  const gold    = scrolled ? "#B98F39" : "#D4B870";
  const byClr   = scrolled ? "rgba(114,91,41,0.75)" : "rgba(212,184,112,0.7)";

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Feather mark — compact version */}
      <svg
        viewBox="0 0 56 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-9 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M 32 66 Q 14 46 2 4"  stroke="#E8DDB8" strokeWidth="8.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M 35 66 Q 20 42 10 2"  stroke="#D4B870" strokeWidth="7"   strokeLinecap="round"/>
        <path d="M 38 66 Q 28 37 22 1"  stroke="#B98F39" strokeWidth="5.5" strokeLinecap="round"/>
        <path d="M 41 66 Q 36 32 34 0"  stroke="#A69045" strokeWidth="4"   strokeLinecap="round"/>
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: primary,
            textTransform: "uppercase",
            transition: "color 0.5s",
          }}
        >
          Silvanza Resort
        </span>
        <span
          style={{
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.52rem",
            fontWeight: 300,
            letterSpacing: "0.25em",
            color: gold,
            textTransform: "uppercase",
            transition: "color 0.5s",
          }}
        >
          ⊙ by Nivanta
        </span>
      </div>
    </div>
  );
}
