import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing", "postprocessing"],
          "gsap-vendor": ["gsap", "@gsap/react"],
          "markdown-vendor": ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-raw", "highlight.js"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
