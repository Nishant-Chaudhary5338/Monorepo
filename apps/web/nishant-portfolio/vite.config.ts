import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteMeta } from "./vite.site";
import { markdownCompiled } from "./vite.markdown";

export default defineConfig(({ mode }) => ({
  plugins: [markdownCompiled(), react(), tailwindcss(), siteMeta(loadEnv(mode, __dirname, "VITE_").VITE_SITE_URL)],
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
      // from the entry, including React.lazy()'d route chunks, which the home
      // page never needs. Exclude the lazy-route-only chunk.
      resolveDependencies(_filename: string, deps: string[]): string[] {
        return deps.filter((d) => !d.includes("content-page"));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes("gsap")) return "gsap";
          // react and scheduler must share react-dom's chunk: split apart, a clean
          // npm install builds a bundle whose react-dom initialises against an
          // undefined React and renders a blank page.
          if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) return "vendor";
          if (id.includes("/src/pages/") || id.includes("/src/content/")) return "content-page";
        },
      },
    },
  },
}));
