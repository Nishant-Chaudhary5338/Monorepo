export interface CoverSet {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

const WIDTHS = [640, 1024, 1600] as const;
const ASPECT = 840 / 1600;

/** `key` is the file stem under /covers: an article slug, or `work-<slug>` for a case study. */
export function coverSet(key: string): CoverSet {
  return {
    src: `/covers/${key}-1024.webp`,
    srcSet: WIDTHS.map((w) => `/covers/${key}-${w}.webp ${w}w`).join(", "),
    sizes: "100vw",
    width: 1600,
    height: Math.round(1600 * ASPECT),
  };
}
