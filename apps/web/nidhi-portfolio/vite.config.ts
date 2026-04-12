import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Raise warning threshold — GSAP is intentionally large
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // GSAP goes into its own cached chunk — changes independently of app code
          if (id.includes("gsap")) return "gsap";
          // React runtime split from app code
          if (id.includes("react-dom") || id.includes("react-router")) return "vendor";
          // Heavy case study page data stays out of main bundle
          if (id.includes("pages/CaseStudy")) return "case-study";
        },
      },
    },

    // Enable gzip-friendly output
    target: "es2020",
    minify: "esbuild",
  },

  // Pre-bundle deps for faster dev
  optimizeDeps: {
    include: ["gsap", "react", "react-dom", "react-router-dom"],
  },
});
