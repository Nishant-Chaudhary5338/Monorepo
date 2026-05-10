import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "gsap-vendor":   ["gsap", "@gsap/react"],
          "three-vendor":  ["three", "@react-three/fiber", "@react-three/drei"],
          "react-vendor":  ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    target: "es2020",
    minify: "esbuild",
  },

  optimizeDeps: {
    include: ["gsap", "react", "react-dom", "react-router-dom"],
  },

  server: {
    port: 5181,
  },
});
