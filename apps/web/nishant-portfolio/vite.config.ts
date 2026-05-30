import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

/**
 * Vite plugin that moves Vite's internal __vite__preload helper out of
 * three-vendor into a tiny dedicated chunk (~500 B).
 *
 * Problem: @react-three/fiber has internal dynamic imports, so Rollup
 * assigns __vite__preload to three-vendor (938 KB). Every lazy chunk
 * (main runtime, ArticlePage, CaseStudyPage) then statically imports
 * three-vendor just to get that one helper — even on article pages that
 * don't use Three.js at all.
 *
 * Fix: after the bundle is written, extract the preload helper code into
 * a standalone `_preload.js` file and rewrite all static imports of `_`
 * from three-vendor to come from that file instead.
 */
function extractPreloadHelper(): Plugin {
  let outDir = "dist";

  return {
    name: "extract-preload-helper",
    apply: "build",

    configResolved(config) {
      outDir = config.build.outDir ?? "dist";
    },

    writeBundle(_, bundle) {
      // ── 1. Find three-vendor chunk (contains "modulepreload" and exports _) ──
      let threeVendorFile = "";
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (!chunk.code.includes('"modulepreload"')) continue;
        if (!/ as _[,}]/.test(chunk.code)) continue;
        threeVendorFile = fileName;
        break;
      }
      if (!threeVendorFile) return;

      const threeVendorChunk = bundle[threeVendorFile] as { code: string };
      const code = threeVendorChunk.code;

      // ── 2. Extract preload helper code ─────────────────────────────────────
      // The helper is a single `const` declaration right after the React imports:
      //   const WS="modulepreload",XS=function...,$v={},lL=function...{...};
      // Strategy: find the last `const ` before `"modulepreload"`, then walk
      // forward counting braces to find the matching semicolon at depth 0.

      const mpIdx = code.indexOf('"modulepreload"');
      if (mpIdx === -1) return;

      const beforeMp = code.substring(0, mpIdx);
      const constStart = beforeMp.lastIndexOf("const ");
      if (constStart === -1) return;

      let depth = 0;
      let inStr = false;
      let strChar = "";
      let endIdx = constStart;

      for (let i = constStart; i < code.length; i++) {
        const c = code[i];
        if (inStr) {
          if (c === "\\") { i++; continue; }
          if (c === strChar) inStr = false;
        } else if (c === '"' || c === "'" || c === "`") {
          inStr = true;
          strChar = c;
        } else if (c === "{") {
          depth++;
        } else if (c === "}") {
          depth--;
        } else if (c === ";" && depth === 0) {
          endIdx = i;
          break;
        }
      }

      const preloadDecl = code.substring(constStart, endIdx + 1);

      // Derive the local name of the exported preload function.
      // Export line looks like: export{...,lL as _,...}
      const exportMatch = code.match(/export\{[^}]+\}/);
      if (!exportMatch) return;

      // Find which local name maps to `_`
      const asUnderscoreMatch = exportMatch[0].match(/([A-Za-z_$][A-Za-z0-9_$]*) as _/);
      if (!asUnderscoreMatch) return;
      const preloadLocalName = asUnderscoreMatch[1]; // e.g. "lL"

      // Verify our extracted block actually contains this name
      if (!preloadDecl.includes(preloadLocalName)) return;

      // ── 3. Write the tiny _preload.js chunk ────────────────────────────────
      const helperContent = `${preloadDecl}\nexport{${preloadLocalName} as _};\n`;
      const helperRelPath = "assets/_preload.js";
      const helperAbsPath = path.resolve(outDir, helperRelPath);
      fs.writeFileSync(helperAbsPath, helperContent, "utf8");

      // ── 4. Rewrite all chunks that import `_` from three-vendor ───────────
      const threeVendorBasename = path.basename(threeVendorFile); // e.g. three-vendor-xxx.js
      const helperBasename = "_preload.js";

      const rewriteImport = (src: string) =>
        src.replace(
          new RegExp(`import\\{([^}]*)\\}from"\\./${threeVendorBasename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
          (match, imports: string) => {
            const parts = imports.split(",").map((s) => s.trim());
            // Find the part where the EXPORTED name is `_` (i.e. `_` or `_ as alias`)
            const preloadPart = parts.find((p) => p === "_" || p.startsWith("_ "));
            const rest = parts.filter((p) => p !== preloadPart);

            let result = "";
            if (preloadPart) {
              result += `import{${preloadPart}}from"./${helperBasename}";`;
            }
            if (rest.length > 0) {
              result += `import{${rest.join(",")}}from"./${threeVendorBasename}"`;
            }
            return result || match;
          }
        );

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (fileName === threeVendorFile) continue;
        if (!chunk.code.includes(`from"./${threeVendorBasename}"`)) continue;

        const newCode = rewriteImport(chunk.code);
        if (newCode === chunk.code) continue;

        const absPath = path.resolve(outDir, fileName);
        fs.writeFileSync(absPath, newCode, "utf8");
      }

      // ── 5. Remove `_ as preloadLocalName` from three-vendor's exports ──────
      const newThreeCode = code
        .replace(/ as _[,}]/, (m) => (m.endsWith("}") ? "}" : ""))
        .replace(new RegExp(`${preloadLocalName} as _[,}]`), (m) =>
          m.endsWith("}") ? "}" : ""
        );

      if (newThreeCode !== code) {
        fs.writeFileSync(path.resolve(outDir, threeVendorFile), newThreeCode, "utf8");
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), extractPreloadHelper()],
  build: {
    // Target modern browsers — eliminates legacy polyfills (~2 KiB savings per chunk)
    target: "esnext",
    cssCodeSplit: true,
    modulePreload: {
      // Exclude heavy lazy-only chunks from the initial HTML preload list.
      // three-vendor and gsap-vendor are only needed for the home route; preloading
      // them on every page (including articles) wastes ~300 KB on every non-home route.
      resolveDependencies(_filename: string, deps: string[]): string[] {
        return deps.filter(
          (d) => !d.includes("three-vendor") && !d.includes("gsap-vendor")
        );
      },
    },
    rollupOptions: {
      output: {
        // Function form: react paths are matched first so @react-three/fiber can't
        // absorb react/jsx-runtime into three-vendor, which would cause a static
        // three-vendor import in the entry chunk on every route (including articles).
        manualChunks(id: string): string | undefined {
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react-router") ||
            id.includes("/node_modules/scheduler/")
          ) return "react-vendor";
          if (
            id.includes("/node_modules/three/") ||
            id.includes("/node_modules/@react-three/") ||
            id.includes("/node_modules/postprocessing/")
          ) return "three-vendor";
          if (
            id.includes("/node_modules/gsap/") ||
            id.includes("/node_modules/@gsap/")
          ) return "gsap-vendor";
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
    chunkSizeWarningLimit: 600,
  },
});
