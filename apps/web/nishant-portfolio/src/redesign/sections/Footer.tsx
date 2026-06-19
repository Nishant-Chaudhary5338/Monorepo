import type { ReactElement } from "react";
import { personalInfo } from "../../constants";

export function Footer(): ReactElement {
  return (
    <footer className="mx-footer">
      <div className="mx-footer__links">
        <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={`mailto:${personalInfo.email}`}>Email ↗</a>
      </div>
      <div className="mx-footer__meta">
        <span>Nishant Chaudhary — New Delhi, India</span>
        <span>© 2026 · Built with React Three Fiber</span>
      </div>
    </footer>
  );
}
