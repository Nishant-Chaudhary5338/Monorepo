import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { TextLink } from "../components/TextLink";
import { cn } from "../lib/cn";
import { container } from "../lib/styles";

interface NotFoundProps {
  what: string;
  back: { label: string; to: string };
}

export default function NotFound({ what, back }: NotFoundProps): ReactNode {
  return (
    <>
      <Navbar back={back} />
      <main className={cn(container, "py-24")}>
        <h1 className="text-xl font-medium text-fg">{what} not found</h1>
        <p className="mt-3 text-base text-fg-2">The link may be old. <TextLink href={back.to}>Back to {back.label.toLowerCase()}</TextLink></p>
      </main>
    </>
  );
}
