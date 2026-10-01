import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";
import { monoLink, textLink } from "../lib/styles";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  mono?: boolean;
  className?: string;
}

const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

export function TextLink({ href, children, mono = false, className }: TextLinkProps): ReactNode {
  const style = cn(mono ? monoLink : textLink, className);

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={style}>
        {children} <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return <Link to={href} className={style}>{children}</Link>;
  }
  return <a href={href} className={style}>{children}</a>;
}
