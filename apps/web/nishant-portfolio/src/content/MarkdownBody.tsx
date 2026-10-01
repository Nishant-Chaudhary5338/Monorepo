import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { headingId } from "./markdown";

interface MarkdownBodyProps {
  markdown: string;
  // Articles embed <figure> blocks; case studies are plain markdown.
  allowHtml?: boolean;
}

// Unsplash URLs carry their size in w/h params; passing them through as
// width/height reserves the space and avoids layout shift.
function sizeFromUrl(src: string | undefined): { width?: number; height?: number } {
  try {
    const url = new URL(src ?? "");
    const w = url.searchParams.get("w");
    const h = url.searchParams.get("h");
    return { width: w ? Number(w) : undefined, height: h ? Number(h) : undefined };
  } catch {
    return {};
  }
}

export function MarkdownBody({ markdown, allowHtml = false }: MarkdownBodyProps): ReactNode {
  return (
    <div className="prose-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={allowHtml ? [rehypeRaw, rehypeHighlight] : [rehypeHighlight]}
        components={{
          h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
          img: ({ src, alt }) => (
            <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" {...sizeFromUrl(src)} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
