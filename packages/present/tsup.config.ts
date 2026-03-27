import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/core/index.ts",
    "src/state/index.ts",
    "src/animation/index.ts",
    "src/gestures/index.ts",
    "src/scroll/index.ts",
    "src/router/index.ts",
    "src/plugins/index.ts",
    "src/ui/index.ts",
    "src/themes/index.ts",
    "src/utils/index.ts",
    "src/types/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
