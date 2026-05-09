type IconName =
  | "pool" | "restaurant" | "banquet" | "lawn" | "shield" | "car"
  | "train" | "plane"
  | "sun" | "fork" | "leaf" | "glass" | "star"
  | "ring" | "flower" | "champagne" | "cake" | "building" | "mic" | "people";

type GoldIconProps = {
  name: IconName | string;
  size?: number;
  className?: string;
};

const PATHS: Record<string, React.ReactNode> = {
  pool: (
    <>
      <path d="M2 8c2.5-4 7.5-4 10 0s7.5 4 10 0" />
      <path d="M2 14c2.5-4 7.5-4 10 0s7.5 4 10 0" />
      <path d="M2 20c2.5-4 7.5-4 10 0s7.5 4 10 0" />
    </>
  ),
  restaurant: (
    <>
      <path d="M3 3v6a3 3 0 0 0 6 0V3" />
      <path d="M6 3v20" />
      <path d="M15 3v20" />
      <path d="M15 11h4a3 3 0 0 0 0-6h-4" />
    </>
  ),
  banquet: (
    <>
      <path d="M12 2l2.2 6.8H21l-5.9 4.3 2.2 6.8L12 15.6l-5.3 4.3 2.2-6.8L3 8.8h6.8z" />
    </>
  ),
  lawn: (
    <>
      <path d="M12 22V10" />
      <path d="M12 10C10 10 4 6 3 2c5.5.5 9 4 9 8z" />
      <path d="M12 10c2 0 8-4 9-8-5.5.5-9 4-9 8z" />
      <path d="M5 22h14" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  car: (
    <>
      <path d="M5 17H3a2 2 0 0 1-2-2v-4l2-6h14l2 6v4a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17" r="2.5" />
      <circle cx="16.5" cy="17" r="2.5" />
    </>
  ),
  train: (
    <>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <path d="M8 3v8" />
      <path d="M16 3v8" />
      <path d="M8 17l-2 4" />
      <path d="M16 17l2 4" />
    </>
  ),
  plane: (
    <>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  fork: (
    <>
      <path d="M3 3v6a3 3 0 0 0 6 0V3" />
      <path d="M6 3v20" />
      <path d="M15 3v20" />
      <path d="M15 11h4a3 3 0 0 0 0-6h-4" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  glass: (
    <>
      <path d="M8 22h8" />
      <path d="M7 10h10" />
      <path d="M12 15V22" />
      <path d="M7 2l-2 8h14L17 2z" />
    </>
  ),
  star: (
    <>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </>
  ),
  ring: (
    <>
      <circle cx="12" cy="14" r="7" />
      <path d="M9 2h6l2 5H7L9 2z" />
      <path d="M12 9v5" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="12" cy="18.5" r="2" />
      <circle cx="5.5" cy="12" r="2" />
      <circle cx="18.5" cy="12" r="2" />
      <circle cx="7.4" cy="7.4" r="1.5" />
      <circle cx="16.6" cy="16.6" r="1.5" />
      <circle cx="7.4" cy="16.6" r="1.5" />
      <circle cx="16.6" cy="7.4" r="1.5" />
    </>
  ),
  champagne: (
    <>
      <path d="M8 22h8" />
      <path d="M12 15V22" />
      <path d="M7 2l-2 8h14L17 2z" />
      <path d="M7 10h10" />
      <path d="M10 2l1.5 3" />
      <path d="M14 2l-1.5 3" />
    </>
  ),
  cake: (
    <>
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
      <path d="M2 21h20" />
      <path d="M9 5V3" />
      <path d="M12 8a2 2 0 1 0-4 0" />
    </>
  ),
  building: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18" />
      <path d="M10 10v11" />
      <path d="M8 5V3" />
      <path d="M12 5V3" />
      <path d="M16 5V3" />
      <rect x="13" y="14" width="4" height="7" />
    </>
  ),
  mic: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </>
  ),
  people: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

export default function GoldIcon({ name, size = 24, className = "text-gold" }: GoldIconProps): React.JSX.Element {
  const paths = PATHS[name] ?? PATHS.star;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export type { IconName };
