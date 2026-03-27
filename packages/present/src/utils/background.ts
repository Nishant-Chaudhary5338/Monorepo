import type { SlideBackground } from "../types";

export function backgroundToStyle(
  bg?: SlideBackground
): Record<string, string> {
  if (!bg) return {};

  switch (bg.type) {
    case "color":
      return { backgroundColor: bg.value };

    case "gradient":
      return { background: bg.value };

    case "image":
      return {
        backgroundImage: bg.overlay
          ? `linear-gradient(${bg.overlayColor ?? "rgba(0,0,0,0.5)"}, ${bg.overlayColor ?? "rgba(0,0,0,0.5)"}), url(${bg.value})`
          : `url(${bg.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };

    case "video":
      // Video handled by a <video> element; overlay passed as CSS
      if (bg.overlay) {
        return {
          "--present-video-overlay": bg.overlayColor ?? "rgba(0,0,0,0.5)",
        };
      }
      return {};
  }
}
