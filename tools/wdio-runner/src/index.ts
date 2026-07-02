#!/usr/bin/env node
// ============================================================================
// WDIO RUNNER MCP SERVER
// Live browser automation via WebdriverIO standalone (remote) API.
// Launches headless Chrome, takes screenshots, runs smoke assertions,
// extracts robust selectors from a live DOM, and measures Core Web Vitals.
//
// Prerequisites:
//   • Chrome installed (any recent version)
//   • `chromedriver` npm package included as a dependency (provides the binary)
//   • Or `chromedriver` available on PATH via `brew install chromedriver`
// ============================================================================

import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import { spawn, type ChildProcess } from 'child_process';
import { createRequire } from 'module';

// ============================================================================
// TYPES
// ============================================================================

interface BrowserSession {
  browser: import('webdriverio').Browser;
  cdProcess: ChildProcess;
}

interface AssertionSpec {
  type: 'title' | 'element_visible' | 'element_text' | 'element_count' | 'url_contains' | 'no_console_errors';
  selector?: string;
  expected?: string;
  count?: number;
}

interface AssertionResult {
  type: string;
  selector?: string;
  expected?: string;
  actual?: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

interface PerformanceMetrics {
  ttfbMs: number;
  domContentLoadedMs: number;
  loadMs: number;
  lcpMs: number | null;
  fcpMs: number | null;
  domNodes: number;
  resources: number;
}

interface ScrapedElement {
  tag: string;
  selector: string;
  strategy: string;
  score: number;
  text?: string;
  type?: string;
}

// ============================================================================
// CHROMEDRIVER MANAGEMENT
// ============================================================================

const CHROMEDRIVER_PORT = 9515;

function resolveChromedriver(): string {
  try {
    const req = createRequire(import.meta.url);
    const cd = req('chromedriver') as { path: string };
    if (cd?.path) return cd.path;
  } catch {
    // fall through to PATH
  }
  return 'chromedriver';
}

async function startChromedriver(): Promise<ChildProcess> {
  const bin = resolveChromedriver();

  return new Promise((resolve, reject) => {
    const proc = spawn(bin, [`--port=${CHROMEDRIVER_PORT}`, '--log-level=OFF'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) reject(new Error('Chromedriver did not start within 5 seconds'));
    }, 5000);

    proc.stdout?.on('data', (chunk: Buffer) => {
      if (!started && chunk.toString().includes('started')) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    });

    proc.stderr?.on('data', (chunk: Buffer) => {
      const msg = chunk.toString();
      if (!started && msg.includes('Starting') || msg.includes('started')) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start chromedriver (${bin}): ${err.message}. Is Chrome installed?`));
    });

    // Fallback: resolve after 1.5s regardless (chromedriver may not log 'started' in all versions)
    setTimeout(() => {
      if (!started) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    }, 1500);
  });
}

async function createBrowserSession(viewport?: { width: number; height: number }): Promise<BrowserSession> {
  const cdProcess = await startChromedriver();

  const { remote } = await import('webdriverio');

  const browser = await remote({
    hostname: '127.0.0.1',
    port: CHROMEDRIVER_PORT,
    path: '/',
    logLevel: 'silent',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless=new',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          `--window-size=${viewport?.width ?? 1280},${viewport?.height ?? 800}`,
        ],
      },
    },
  });

  return { browser, cdProcess };
}

async function destroySession(session: BrowserSession): Promise<void> {
  try {
    await session.browser.deleteSession();
  } catch {
    // ignore — session may already be gone
  }
  try {
    session.cdProcess.kill('SIGTERM');
  } catch {
    // ignore
  }
}

// ============================================================================
// PERFORMANCE METRICS (injected into browser context)
// ============================================================================

const PERF_SCRIPT = `
(function() {
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  const fcp = paint.find(p => p.name === 'first-contentful-paint');

  return {
    ttfbMs: Math.round(nav ? nav.responseStart - nav.requestStart : 0),
    domContentLoadedMs: Math.round(nav ? nav.domContentLoadedEventEnd - nav.startTime : 0),
    loadMs: Math.round(nav ? nav.loadEventEnd - nav.startTime : 0),
    fcpMs: fcp ? Math.round(fcp.startTime) : null,
    domNodes: document.querySelectorAll('*').length,
    resources: performance.getEntriesByType('resource').length,
  };
})()
`;

const LCP_SCRIPT = `
(function() {
  return new Promise((resolve) => {
    let lcp = null;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      lcp = entries[entries.length - 1];
    });
    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch(e) {
      resolve(null);
      return;
    }
    setTimeout(() => {
      observer.disconnect();
      resolve(lcp ? Math.round(lcp.startTime) : null);
    }, 2000);
  });
})()
`;

// ============================================================================
// SELECTOR EXTRACTION (injected into browser context)
// ============================================================================

const SELECTOR_EXTRACTION_SCRIPT = `
(function() {
  const INTERACTIVE = ['input', 'button', 'a', 'select', 'textarea', 'label'];
  const seen = new Set();
  const results = [];

  function score(el) {
    if (el.getAttribute('data-testid') || el.getAttribute('data-test-id')) return { sel: '[data-testid="' + (el.getAttribute('data-testid') || el.getAttribute('data-test-id')) + '"]', score: 9, strategy: 'data-testid' };
    if (el.getAttribute('data-test'))  return { sel: '[data-test="' + el.getAttribute('data-test') + '"]', score: 9, strategy: 'data-test' };
    if (el.getAttribute('aria-label')) return { sel: '[aria-label="' + el.getAttribute('aria-label') + '"]', score: 8, strategy: 'aria-label' };
    if (el.id && !/^\\d/.test(el.id))   return { sel: '#' + el.id, score: 7, strategy: 'id' };
    if (el.getAttribute('name'))        return { sel: '[name="' + el.getAttribute('name') + '"]', score: 6, strategy: 'name' };
    if (el.getAttribute('placeholder')) return { sel: '[placeholder="' + el.getAttribute('placeholder') + '"]', score: 5, strategy: 'placeholder' };
    const cls = Array.from(el.classList).find(c => !/^(is-|has-|active|disabled|hover|focus|open|close)/.test(c));
    if (cls) return { sel: '.' + cls, score: 3, strategy: 'css-class' };
    return { sel: el.tagName.toLowerCase(), score: 1, strategy: 'tag' };
  }

  INTERACTIVE.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => {
      const { sel, score: s, strategy } = score(el);
      if (seen.has(sel)) return;
      seen.add(sel);
      results.push({
        tag: el.tagName.toLowerCase(),
        selector: sel,
        strategy: strategy,
        score: s,
        text: el.textContent ? el.textContent.trim().substring(0, 60) : undefined,
        type: el.getAttribute('type') || undefined,
      });
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 50);
})()
`;

// ============================================================================
// MCP SERVER
// ============================================================================

class WdioRunnerServer extends McpServerBase {
  constructor() {
    super({ name: 'wdio-runner', version: '1.0.0' });
  }

  protected registerTools(): void {
    this.addTool(
      'navigate_and_screenshot',
      'Launch headless Chrome via WebdriverIO, navigate to a URL, take a full-page screenshot (returned as base64 PNG), and capture page title and load time. Requires Chrome + chromedriver.',
      {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL to navigate to (e.g. "https://example.com" or "http://localhost:3000")',
          },
          viewport: {
            type: 'object',
            description: 'Optional browser viewport dimensions',
            properties: {
              width: { type: 'number' },
              height: { type: 'number' },
            },
          },
        },
        required: ['url'],
      },
      async (args) => this.handleScreenshot(args)
    );

    this.addTool(
      'extract_selectors',
      'Navigate to a URL and scrape the live DOM for all interactive elements (inputs, buttons, links, selects). Returns a list of elements with their best available selector and a TypeScript POM snippet ready to paste.',
      {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL to scrape (must be accessible from this machine)',
          },
          strategy: {
            type: 'string',
            enum: ['data-testid', 'aria', 'best'],
            description: '"best" (default) returns the highest-scoring selector per element regardless of strategy',
          },
        },
        required: ['url'],
      },
      async (args) => this.handleExtractSelectors(args)
    );

    this.addTool(
      'run_smoke_test',
      'Navigate to a URL and run a list of assertions via WebdriverIO. Supports: title match, element_visible, element_text, element_count, url_contains, no_console_errors. Returns pass/fail per assertion with actual values.',
      {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL to test',
          },
          assertions: {
            type: 'array',
            description: 'List of assertions to run',
            items: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['title', 'element_visible', 'element_text', 'element_count', 'url_contains', 'no_console_errors'],
                },
                selector: { type: 'string', description: 'CSS / attribute selector (required for element_* assertions)' },
                expected: { type: 'string', description: 'Expected value (title text, element text, URL fragment)' },
                count: { type: 'number', description: 'Expected element count (for element_count assertion)' },
              },
              required: ['type'],
            },
          },
        },
        required: ['url', 'assertions'],
      },
      async (args) => this.handleRunSmokeTest(args)
    );

    this.addTool(
      'measure_performance',
      'Navigate to a URL (1-3 runs) and capture Core Web Vitals via the browser Performance API: TTFB, DOMContentLoaded, Load, FCP, LCP, DOM node count. Returns averaged metrics with a health score.',
      {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL to benchmark',
          },
          runs: {
            type: 'number',
            description: 'Number of measurement runs to average (1-3, default 1)',
          },
        },
        required: ['url'],
      },
      async (args) => this.handleMeasurePerformance(args)
    );
  }

  private async handleScreenshot(args: any): Promise<ToolResult> {
    let session: BrowserSession | null = null;
    try {
      const { url, viewport } = args;
      const t0 = Date.now();

      session = await createBrowserSession(viewport);
      await session.browser.url(url);

      // Wait for page to settle
      await session.browser.waitUntil(
        async () => (await session!.browser.execute(() => document.readyState)) === 'complete',
        { timeout: 15_000, timeoutMsg: 'Page did not reach readyState=complete' }
      );

      const loadTimeMs = Date.now() - t0;
      const title = await session.browser.getTitle();
      const currentUrl = await session.browser.getUrl();
      const screenshot = await session.browser.takeScreenshot(); // base64 PNG

      return this.success({
        url,
        resolvedUrl: currentUrl,
        title,
        loadTimeMs,
        viewport: viewport ?? { width: 1280, height: 800 },
        screenshot_base64: screenshot,
        note: 'screenshot_base64 is a PNG encoded as base64. Decode to view or save as .png',
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }

  private async handleExtractSelectors(args: any): Promise<ToolResult> {
    let session: BrowserSession | null = null;
    try {
      const { url, strategy = 'best' } = args;

      session = await createBrowserSession();
      await session.browser.url(url);
      await session.browser.waitUntil(
        async () => (await session!.browser.execute(() => document.readyState)) === 'complete',
        { timeout: 15_000, timeoutMsg: 'Page did not load' }
      );

      const elements = (await session.browser.execute(SELECTOR_EXTRACTION_SCRIPT)) as ScrapedElement[];

      // Filter by strategy
      const filtered = strategy === 'best'
        ? elements
        : strategy === 'data-testid'
        ? elements.filter(e => e.score >= 9)
        : strategy === 'aria'
        ? elements.filter(e => e.score >= 7 && e.score <= 8)
        : elements;

      // Generate POM snippet
      const getters = filtered
        .slice(0, 20)
        .map(el => {
          const prop = toCamelCase(
            el.text?.replace(/[^a-zA-Z0-9 ]/g, '').trim() ||
            el.selector.replace(/[^\w]/g, '_').replace(/^_+|_+$/g, '') ||
            el.tag
          );
          return `  get ${prop}() {\n    return $('${el.selector}');\n  }`;
        })
        .join('\n\n');

      const pomSnippet = filtered.length > 0
        ? `// Generated page object getters — paste into your POM class\n${getters}`
        : '// No interactive elements found matching the strategy';

      return this.success({
        url,
        elementsFound: filtered.length,
        strategy,
        elements: filtered,
        pomSnippet,
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }

  private async handleRunSmokeTest(args: any): Promise<ToolResult> {
    let session: BrowserSession | null = null;
    try {
      const { url, assertions }: { url: string; assertions: AssertionSpec[] } = args;

      session = await createBrowserSession();
      await session.browser.url(url);
      await session.browser.waitUntil(
        async () => (await session!.browser.execute(() => document.readyState)) === 'complete',
        { timeout: 15_000, timeoutMsg: 'Page did not load' }
      );

      const results: AssertionResult[] = [];

      for (const assertion of assertions) {
        const t0 = Date.now();
        let passed = false;
        let actual: string | undefined;
        let error: string | undefined;

        try {
          switch (assertion.type) {
            case 'title': {
              actual = await session.browser.getTitle();
              passed = assertion.expected
                ? actual.includes(assertion.expected)
                : actual.length > 0;
              break;
            }
            case 'element_visible': {
              if (!assertion.selector) throw new Error('selector required for element_visible');
              const el = await session.browser.$(assertion.selector);
              passed = await el.isDisplayed();
              actual = passed ? 'visible' : 'not visible';
              break;
            }
            case 'element_text': {
              if (!assertion.selector) throw new Error('selector required for element_text');
              const el = await session.browser.$(assertion.selector);
              actual = await el.getText();
              passed = assertion.expected ? actual.includes(assertion.expected) : actual.length > 0;
              break;
            }
            case 'element_count': {
              if (!assertion.selector) throw new Error('selector required for element_count');
              const els = await session.browser.$$(assertion.selector);
              actual = String(els.length);
              passed = assertion.count !== undefined ? els.length === assertion.count : els.length > 0;
              break;
            }
            case 'url_contains': {
              actual = await session.browser.getUrl();
              passed = assertion.expected ? actual.includes(assertion.expected) : true;
              break;
            }
            case 'no_console_errors': {
              const logs = await session.browser.getLogs('browser').catch(() => []);
              const errors = logs.filter((l: any) => l.level === 'SEVERE');
              passed = errors.length === 0;
              actual = errors.length === 0 ? 'no errors' : `${errors.length} error(s): ${errors.map((e: any) => e.message).join('; ')}`;
              break;
            }
            default:
              throw new Error(`Unknown assertion type: ${(assertion as any).type}`);
          }
        } catch (err) {
          passed = false;
          error = err instanceof Error ? err.message : String(err);
        }

        results.push({
          type: assertion.type,
          selector: assertion.selector,
          expected: assertion.expected,
          actual,
          passed,
          error,
          durationMs: Date.now() - t0,
        });
      }

      const passedCount = results.filter(r => r.passed).length;
      const failedCount = results.length - passedCount;

      return this.success({
        url,
        passed: passedCount,
        failed: failedCount,
        total: results.length,
        allPassed: failedCount === 0,
        results,
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }

  private async handleMeasurePerformance(args: any): Promise<ToolResult> {
    let session: BrowserSession | null = null;
    try {
      const { url, runs = 1 } = args;
      const clampedRuns = Math.min(Math.max(runs, 1), 3);
      const allMetrics: PerformanceMetrics[] = [];

      session = await createBrowserSession();

      for (let i = 0; i < clampedRuns; i++) {
        await session.browser.url(url);
        await session.browser.waitUntil(
          async () => (await session!.browser.execute(() => document.readyState)) === 'complete',
          { timeout: 15_000, timeoutMsg: 'Page did not load' }
        );

        const base = (await session.browser.execute(PERF_SCRIPT)) as Omit<PerformanceMetrics, 'lcpMs'>;
        const lcpMs = (await session.browser.executeAsync(
          `(function(done) { ${LCP_SCRIPT.replace('(function() {', '').replace('})();', '')} .then(done); })(...arguments)`
        )) as number | null;

        allMetrics.push({ ...base, lcpMs });
      }

      const avg = (key: keyof PerformanceMetrics): number | null => {
        const vals = allMetrics.map(m => m[key]).filter((v): v is number => v !== null && typeof v === 'number');
        if (vals.length === 0) return null;
        return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      };

      const averaged: PerformanceMetrics = {
        ttfbMs: avg('ttfbMs') ?? 0,
        domContentLoadedMs: avg('domContentLoadedMs') ?? 0,
        loadMs: avg('loadMs') ?? 0,
        lcpMs: avg('lcpMs'),
        fcpMs: avg('fcpMs'),
        domNodes: avg('domNodes') ?? 0,
        resources: avg('resources') ?? 0,
      };

      const lcpHealth =
        averaged.lcpMs === null ? 'unknown'
        : averaged.lcpMs <= 2500 ? 'good'
        : averaged.lcpMs <= 4000 ? 'needs improvement'
        : 'poor';

      const fcpHealth =
        averaged.fcpMs === null ? 'unknown'
        : averaged.fcpMs <= 1800 ? 'good'
        : averaged.fcpMs <= 3000 ? 'needs improvement'
        : 'poor';

      return this.success({
        url,
        runs: clampedRuns,
        metrics: {
          ttfb: { ms: averaged.ttfbMs, health: averaged.ttfbMs <= 800 ? 'good' : 'slow' },
          domContentLoaded: { ms: averaged.domContentLoadedMs },
          load: { ms: averaged.loadMs },
          lcp: { ms: averaged.lcpMs, health: lcpHealth, target: '≤ 2500ms (good)' },
          fcp: { ms: averaged.fcpMs, health: fcpHealth, target: '≤ 1800ms (good)' },
          domNodes: { count: averaged.domNodes, health: averaged.domNodes <= 1500 ? 'good' : 'high (consider lazy rendering)' },
          resources: { count: averaged.resources },
        },
        rawRuns: allMetrics,
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }
}

// ============================================================================
// UTILITY
// ============================================================================

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase())
    .replace(/^\d+/, '')
    .slice(0, 40) || 'element';
}

new WdioRunnerServer().run().catch(console.error);
