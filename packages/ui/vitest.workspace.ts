import { defineWorkspace } from "vitest/node"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineWorkspace([
  // ── Unit tests (existing jsdom setup) ──────────────────────────────────────
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
      include: ["components/**/*.test.{ts,tsx}"],
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
    },
  },

  // ── Storybook interaction tests (browser mode via Playwright) ──────────────
  {
    plugins: [
      storybookTest({
        configDir: join(__dirname, ".storybook"),
        storybookUrl: "http://localhost:6006",
      }),
    ],
    test: {
      name: "storybook",
      browser: {
        enabled: true,
        headless: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
      setupFiles: [".storybook/vitest.setup.ts"],
    },
  },
])
