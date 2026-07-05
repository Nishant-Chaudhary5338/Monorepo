import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Without this, Vite's dep-scanner globs every *.html under the project
  // root (including the static, unwired prototypes in design-mockups/) to
  // seed its dependency pre-bundle. Those reference `three` via an import
  // map the scanner can't resolve, so the scan aborts/partially completes —
  // observed as a broken pre-bundled react-dom (duplicate-copy "Invalid
  // hook call" errors) rather than an obvious failure.
  optimizeDeps: {
    entries: ["index.html"],
  },
  build: {
    target: "es2020",
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
    modulePreload: {
      // Vite's default modulePreload eagerly preloads every chunk reachable
      // from the entry, including React.lazy()'d route chunks — so the home
      // page was shipping the markdown/remark/rehype bundle (151KB gzipped,
      // 76% unused per Lighthouse) even though only /writing/:slug and
      // /work/:slug ever touch it. Exclude the lazy-route-only chunks.
      resolveDependencies(_filename: string, deps: string[]): string[] {
        return deps.filter((d) => !d.includes("markdown-vendor") && !d.includes("content-page"));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes("gsap")) return "gsap";
          if (id.includes("/node_modules/react-dom/") || id.includes("/node_modules/react-router")) return "vendor";
          if (id.includes("/pages/ArticlePage") || id.includes("/pages/CaseStudyPage")) return "content-page";
          if (
            id.includes("/node_modules/react-markdown/") ||
            id.includes("/node_modules/remark") ||
            id.includes("/node_modules/rehype") ||
            id.includes("/node_modules/highlight.js/") ||
            id.includes("/node_modules/hast") ||
            id.includes("/node_modules/unified") ||
            id.includes("/node_modules/micromark")
          ) return "markdown-vendor";
        },
      },
    },
  },
});
