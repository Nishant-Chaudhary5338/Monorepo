export const NAV_ITEMS = ["Nexus", "Vault", "Prologue", "About", "Contact"] as const;

export const TOTAL_VIDEOS = 4;

export const getVideoSrc = (index: number): string => `videos/hero-${index}.mp4`;