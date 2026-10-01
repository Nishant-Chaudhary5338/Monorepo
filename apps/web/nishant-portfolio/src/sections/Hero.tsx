import type { ReactNode } from "react";
import { personalInfo } from "../constants";
import { useGeoCV } from "../hooks/useGeoCV";
import { cn } from "../lib/cn";
import { buttonPrimary, buttonSecondary, container, eyebrow, meta, textLink } from "../lib/styles";

const headline = cn(
  "mt-5 max-w-headline text-hero font-medium tracking-display text-fg",
  "motion-safe:animate-wipe anim-delay-1",
);
const lead = cn(
  "mt-6 max-w-lead text-md text-fg-2",
  "motion-safe:animate-wipe anim-delay-2",
);
const actions = cn(
  "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
  "motion-safe:animate-fade anim-delay-3",
);

const CV_LABEL = { idle: "Download CV", loading: "Downloading", done: "Downloaded" } as const;

export default function Hero(): ReactNode {
  const { downloadCV, status } = useGeoCV();

  return (
    <section id="top" aria-label="Introduction" className={cn(container, "pt-20 pb-16 lg:pt-28")}>
      <p className={cn(eyebrow, "motion-safe:animate-wipe")}>
        {personalInfo.name} · {personalInfo.title}, {personalInfo.company} · {personalInfo.location}
      </p>
      <h1 className={headline}>{personalInfo.headline}</h1>
      <p className={lead}>{personalInfo.lead}</p>
      <p className={cn(meta, "mt-6 motion-safe:animate-fade anim-delay-3")}>{personalInfo.availabilityShort}</p>

      <div className={actions}>
        <a href="#work" className={buttonPrimary}>See the work</a>
        <button type="button" className={buttonSecondary} onClick={downloadCV} disabled={status === "loading"}>
          {CV_LABEL[status]}
        </button>
        <a href={`mailto:${personalInfo.email}`} className={cn(textLink, "self-start text-sm sm:ml-2 sm:self-auto")}>
          Email me
        </a>
      </div>
    </section>
  );
}
