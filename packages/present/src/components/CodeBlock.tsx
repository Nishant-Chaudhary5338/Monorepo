import type { CodeBlockProps } from "../types";
import { cn } from "../utils/classnames";

export function CodeBlock({
  code,
  language = "tsx",
  theme = "dark",
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "present-code-block",
        theme === "light" && "present-code-block--light",
        className
      )}
    >
      <div className="present-code-header">
        <div className="present-code-dots">
          <span className="present-code-dot present-code-dot--red" />
          <span className="present-code-dot present-code-dot--yellow" />
          <span className="present-code-dot present-code-dot--green" />
        </div>
        <span className="present-code-lang">{language}</span>
      </div>
      <pre className="present-code-body">
        <code>
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "present-code-line",
                highlightLines.includes(i + 1) &&
                  "present-code-line--highlighted"
              )}
            >
              {showLineNumbers && (
                <span className="present-code-line-number">{i + 1}</span>
              )}
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
