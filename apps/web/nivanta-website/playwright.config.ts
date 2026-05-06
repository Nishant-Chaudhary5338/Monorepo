import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    headless: true,
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: "pnpm preview --port 4173",
    port: 4173,
    reuseExistingServer: false,
    timeout: 30000,
    cwd: ".",
  },
});
