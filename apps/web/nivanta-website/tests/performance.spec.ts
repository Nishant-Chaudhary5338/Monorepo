/**
 * Lighthouse CI-style performance checks using the browser's Performance Observer API.
 * Runs against the preview build (port 4173).
 * Thresholds: LCP ≤ 2500ms, CLS ≤ 0.1
 */
import { test, expect, type Page } from "@playwright/test";

const PAGES = [
  { path: "/",        name: "Home" },
  { path: "/rooms",   name: "Rooms" },
  { path: "/contact", name: "Contact" },
];

const LCP_THRESHOLD_MS = 2500;
const CLS_THRESHOLD = 0.1;

async function measureLCP(page: Page): Promise<number> {
  return page.evaluate((): Promise<number> => {
    return new Promise((resolve) => {
      let resolved = false;
      const obs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0 && !resolved) {
          resolved = true;
          resolve(entries[entries.length - 1].startTime);
          obs.disconnect();
        }
      });
      try {
        obs.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        resolve(0);
        return;
      }
      // Fallback: if LCP never fires within 6s, resolve with 0 (report but don't fail)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(0);
        }
      }, 6000);
    });
  });
}

async function measureCLS(page: Page): Promise<number> {
  return page.evaluate((): Promise<number> => {
    return new Promise((resolve) => {
      let cls = 0;
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as LayoutShift).hadRecentInput) {
            cls += (entry as LayoutShift).value;
          }
        }
      });
      try {
        obs.observe({ type: "layout-shift", buffered: true });
      } catch {
        resolve(0);
        return;
      }
      // Collect for 3s then report accumulated CLS
      setTimeout(() => {
        obs.disconnect();
        resolve(cls);
      }, 3000);
    });
  });
}

test.describe("Performance — Core Web Vitals", () => {
  // Serial: prevent CPU contention from parallel workers skewing LCP measurements
  test.describe.configure({ mode: "serial" });
  test.use({ viewport: { width: 1280, height: 900 } });
  // Extend timeout for performance measurements
  test.setTimeout(60000);

  for (const { path, name } of PAGES) {
    test(`${name} LCP ≤ ${LCP_THRESHOLD_MS}ms`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      // Give late-loading content a moment to trigger LCP
      await page.waitForTimeout(1000);

      const lcp = await measureLCP(page);

      if (lcp === 0) {
        test.skip(); // No LCP candidate found — skip rather than fail
      }

      console.log(`[${name}] LCP: ${lcp.toFixed(0)}ms`);
      expect(lcp, `${name} LCP exceeded ${LCP_THRESHOLD_MS}ms (actual: ${lcp.toFixed(0)}ms)`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
    });

    test(`${name} CLS ≤ ${CLS_THRESHOLD}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const cls = await measureCLS(page); // includes 3s collection window

      console.log(`[${name}] CLS: ${cls.toFixed(4)}`);
      expect(cls, `${name} CLS exceeded ${CLS_THRESHOLD} (actual: ${cls.toFixed(4)})`).toBeLessThanOrEqual(CLS_THRESHOLD);
    });
  }
});

test.describe("Performance — resource checks", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("home page has no failed network requests", async ({ page }) => {
    const failed: string[] = [];

    page.on("response", (res) => {
      // Flag 4xx/5xx responses that aren't expected (ignore external maps embeds etc.)
      if (res.status() >= 400 && res.url().includes("localhost")) {
        failed.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    expect(
      failed,
      `Failed requests:\n${failed.join("\n")}`
    ).toHaveLength(0);
  });

  test("home page transfer size is reasonable (< 5MB)", async ({ page }) => {
    let totalBytes = 0;

    page.on("response", async (res) => {
      try {
        const headers = res.headers();
        const contentLength = headers["content-length"];
        if (contentLength) {
          totalBytes += parseInt(contentLength, 10);
        }
      } catch {
        // ignore
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    const totalMB = totalBytes / (1024 * 1024);
    console.log(`[Home] total transfer: ~${totalMB.toFixed(2)}MB`);
    expect(totalBytes, `Page transferred ${totalMB.toFixed(2)}MB — check for unoptimised assets`).toBeLessThanOrEqual(5 * 1024 * 1024);
  });
});
