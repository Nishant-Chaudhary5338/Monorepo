import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    minify: "esbuild",
    // Split vendor libs for better caching + smaller initial bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("framer-motion"))   return "framer";
          if (id.includes("react-router"))    return "router";
          if (id.includes("react-dom"))       return "vendor";
          if (id.includes("react-hook-form")) return "forms";
          if (id.includes("zod"))             return "forms";
        },
      },
    },
    // Warn on large chunks
    chunkSizeWarningLimit: 400,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "react-router-dom"],
  },
  server: {
    port: 5181,
  },
});
