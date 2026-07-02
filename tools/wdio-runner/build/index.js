#!/usr/bin/env node

// ../_shared/utils/error-utils.js
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// ../_shared/mcp-server/McpServerBase.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode as ErrorCode2, ListToolsRequestSchema, McpError as McpError2 } from "@modelcontextprotocol/sdk/types.js";

// ../_shared/mcp-server/ToolRegistry.js
var ToolRegistry = class {
  tools = /* @__PURE__ */ new Map();
  /**
   * Register a new tool
   */
  register(name, description, inputSchema, handler) {
    if (this.tools.has(name)) {
      throw new Error(`Tool already registered: ${name}`);
    }
    this.tools.set(name, {
      definition: {
        name,
        description,
        inputSchema
      },
      handler
    });
  }
  /**
   * Get a tool definition by name
   */
  getDefinition(name) {
    return this.tools.get(name)?.definition;
  }
  /**
   * Get a tool handler by name
   */
  getHandler(name) {
    return this.tools.get(name)?.handler;
  }
  /**
   * Check if a tool is registered
   */
  has(name) {
    return this.tools.has(name);
  }
  /**
   * Get all tool definitions (for ListTools handler)
   */
  getAllDefinitions() {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }
  /**
   * Get all registered tool names
   */
  getToolNames() {
    return Array.from(this.tools.keys());
  }
  /**
   * Get the number of registered tools
   */
  get size() {
    return this.tools.size;
  }
  /**
   * Unregister a tool
   */
  unregister(name) {
    return this.tools.delete(name);
  }
  /**
   * Clear all registered tools
   */
  clear() {
    this.tools.clear();
  }
};

// ../_shared/mcp-server/McpServerBase.js
var McpServerBase = class {
  server;
  registry;
  config;
  constructor(config) {
    this.config = config;
    this.registry = new ToolRegistry();
    this.server = new Server({ name: config.name, version: config.version }, { capabilities: { tools: {} } });
    this.setupHandlers();
    this.setupErrorHandlers();
    this.registerTools();
  }
  /**
   * Register a tool with the server
   */
  addTool(name, description, inputSchema, handler) {
    this.registry.register(name, description, inputSchema, handler);
  }
  /**
   * Set up ListTools and CallTool request handlers
   */
  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.registry.getAllDefinitions()
    }));
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const handler = this.registry.getHandler(name);
      if (!handler) {
        throw new McpError2(ErrorCode2.MethodNotFound, `Unknown tool: ${name}`);
      }
      try {
        return await handler(args);
      } catch (error) {
        if (error instanceof McpError2) {
          throw error;
        }
        const message = error instanceof Error ? error.message : String(error);
        throw new McpError2(ErrorCode2.InternalError, `Tool execution failed: ${message}`);
      }
    });
  }
  /**
   * Set up error handlers
   */
  setupErrorHandlers() {
    this.server.onerror = (error) => {
      console.error(`[${this.config.name}] MCP Error:`, error);
    };
    process.on("SIGINT", async () => {
      await this.shutdown();
    });
  }
  /**
   * Create a success response
   */
  success(data) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true, ...data }, null, 2)
        }
      ]
    };
  }
  /**
   * Create an error response
   */
  error(error) {
    const errorObj = this.formatError(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: false, error: errorObj }, null, 2)
        }
      ],
      isError: true
    };
  }
  /**
   * Format an error for the response
   */
  formatError(error) {
    if (error instanceof McpError2) {
      return {
        code: String(error.code),
        message: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (error instanceof Error) {
      return {
        code: error.constructor.name || "Error",
        message: error.message,
        suggestion: this.getSuggestion(error),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return {
      code: "UNKNOWN_ERROR",
      message: String(error),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Get helpful suggestions for common errors
   */
  getSuggestion(error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("enoent") || msg.includes("no such file")) {
      return "Ensure the file or directory exists and the path is correct.";
    }
    if (msg.includes("eacces") || msg.includes("permission denied")) {
      return "Check file permissions or run with appropriate privileges.";
    }
    if (msg.includes("eexist") || msg.includes("already exists")) {
      return "The resource already exists. Use a different name or delete the existing one.";
    }
    return void 0;
  }
  /**
   * Start the server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`${this.config.name} MCP server v${this.config.version} running on stdio`);
  }
  /**
   * Gracefully shutdown the server
   */
  async shutdown() {
    await this.server.close();
    process.exit(0);
  }
};

// src/index.ts
import { spawn } from "child_process";
import { createRequire } from "module";
var CHROMEDRIVER_PORT = 9515;
function resolveChromedriver() {
  try {
    const req = createRequire(import.meta.url);
    const cd = req("chromedriver");
    if (cd?.path) return cd.path;
  } catch {
  }
  return "chromedriver";
}
async function startChromedriver() {
  const bin = resolveChromedriver();
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, [`--port=${CHROMEDRIVER_PORT}`, "--log-level=OFF"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let started = false;
    const timeout = setTimeout(() => {
      if (!started) reject(new Error("Chromedriver did not start within 5 seconds"));
    }, 5e3);
    proc.stdout?.on("data", (chunk) => {
      if (!started && chunk.toString().includes("started")) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.stderr?.on("data", (chunk) => {
      const msg = chunk.toString();
      if (!started && msg.includes("Starting") || msg.includes("started")) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start chromedriver (${bin}): ${err.message}. Is Chrome installed?`));
    });
    setTimeout(() => {
      if (!started) {
        started = true;
        clearTimeout(timeout);
        resolve(proc);
      }
    }, 1500);
  });
}
async function createBrowserSession(viewport) {
  const cdProcess = await startChromedriver();
  const { remote } = await import("webdriverio");
  const browser = await remote({
    hostname: "127.0.0.1",
    port: CHROMEDRIVER_PORT,
    path: "/",
    logLevel: "silent",
    capabilities: {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "--headless=new",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          `--window-size=${viewport?.width ?? 1280},${viewport?.height ?? 800}`
        ]
      }
    }
  });
  return { browser, cdProcess };
}
async function destroySession(session) {
  try {
    await session.browser.deleteSession();
  } catch {
  }
  try {
    session.cdProcess.kill("SIGTERM");
  } catch {
  }
}
var PERF_SCRIPT = `
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
var LCP_SCRIPT = `
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
var SELECTOR_EXTRACTION_SCRIPT = `
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
var WdioRunnerServer = class extends McpServerBase {
  constructor() {
    super({ name: "wdio-runner", version: "1.0.0" });
  }
  registerTools() {
    this.addTool(
      "navigate_and_screenshot",
      "Launch headless Chrome via WebdriverIO, navigate to a URL, take a full-page screenshot (returned as base64 PNG), and capture page title and load time. Requires Chrome + chromedriver.",
      {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: 'URL to navigate to (e.g. "https://example.com" or "http://localhost:3000")'
          },
          viewport: {
            type: "object",
            description: "Optional browser viewport dimensions",
            properties: {
              width: { type: "number" },
              height: { type: "number" }
            }
          }
        },
        required: ["url"]
      },
      async (args) => this.handleScreenshot(args)
    );
    this.addTool(
      "extract_selectors",
      "Navigate to a URL and scrape the live DOM for all interactive elements (inputs, buttons, links, selects). Returns a list of elements with their best available selector and a TypeScript POM snippet ready to paste.",
      {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to scrape (must be accessible from this machine)"
          },
          strategy: {
            type: "string",
            enum: ["data-testid", "aria", "best"],
            description: '"best" (default) returns the highest-scoring selector per element regardless of strategy'
          }
        },
        required: ["url"]
      },
      async (args) => this.handleExtractSelectors(args)
    );
    this.addTool(
      "run_smoke_test",
      "Navigate to a URL and run a list of assertions via WebdriverIO. Supports: title match, element_visible, element_text, element_count, url_contains, no_console_errors. Returns pass/fail per assertion with actual values.",
      {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to test"
          },
          assertions: {
            type: "array",
            description: "List of assertions to run",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["title", "element_visible", "element_text", "element_count", "url_contains", "no_console_errors"]
                },
                selector: { type: "string", description: "CSS / attribute selector (required for element_* assertions)" },
                expected: { type: "string", description: "Expected value (title text, element text, URL fragment)" },
                count: { type: "number", description: "Expected element count (for element_count assertion)" }
              },
              required: ["type"]
            }
          }
        },
        required: ["url", "assertions"]
      },
      async (args) => this.handleRunSmokeTest(args)
    );
    this.addTool(
      "measure_performance",
      "Navigate to a URL (1-3 runs) and capture Core Web Vitals via the browser Performance API: TTFB, DOMContentLoaded, Load, FCP, LCP, DOM node count. Returns averaged metrics with a health score.",
      {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to benchmark"
          },
          runs: {
            type: "number",
            description: "Number of measurement runs to average (1-3, default 1)"
          }
        },
        required: ["url"]
      },
      async (args) => this.handleMeasurePerformance(args)
    );
  }
  async handleScreenshot(args) {
    let session = null;
    try {
      const { url, viewport } = args;
      const t0 = Date.now();
      session = await createBrowserSession(viewport);
      await session.browser.url(url);
      await session.browser.waitUntil(
        async () => await session.browser.execute(() => document.readyState) === "complete",
        { timeout: 15e3, timeoutMsg: "Page did not reach readyState=complete" }
      );
      const loadTimeMs = Date.now() - t0;
      const title = await session.browser.getTitle();
      const currentUrl = await session.browser.getUrl();
      const screenshot = await session.browser.takeScreenshot();
      return this.success({
        url,
        resolvedUrl: currentUrl,
        title,
        loadTimeMs,
        viewport: viewport ?? { width: 1280, height: 800 },
        screenshot_base64: screenshot,
        note: "screenshot_base64 is a PNG encoded as base64. Decode to view or save as .png"
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }
  async handleExtractSelectors(args) {
    let session = null;
    try {
      const { url, strategy = "best" } = args;
      session = await createBrowserSession();
      await session.browser.url(url);
      await session.browser.waitUntil(
        async () => await session.browser.execute(() => document.readyState) === "complete",
        { timeout: 15e3, timeoutMsg: "Page did not load" }
      );
      const elements = await session.browser.execute(SELECTOR_EXTRACTION_SCRIPT);
      const filtered = strategy === "best" ? elements : strategy === "data-testid" ? elements.filter((e) => e.score >= 9) : strategy === "aria" ? elements.filter((e) => e.score >= 7 && e.score <= 8) : elements;
      const getters = filtered.slice(0, 20).map((el) => {
        const prop = toCamelCase(
          el.text?.replace(/[^a-zA-Z0-9 ]/g, "").trim() || el.selector.replace(/[^\w]/g, "_").replace(/^_+|_+$/g, "") || el.tag
        );
        return `  get ${prop}() {
    return $('${el.selector}');
  }`;
      }).join("\n\n");
      const pomSnippet = filtered.length > 0 ? `// Generated page object getters \u2014 paste into your POM class
${getters}` : "// No interactive elements found matching the strategy";
      return this.success({
        url,
        elementsFound: filtered.length,
        strategy,
        elements: filtered,
        pomSnippet
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }
  async handleRunSmokeTest(args) {
    let session = null;
    try {
      const { url, assertions } = args;
      session = await createBrowserSession();
      await session.browser.url(url);
      await session.browser.waitUntil(
        async () => await session.browser.execute(() => document.readyState) === "complete",
        { timeout: 15e3, timeoutMsg: "Page did not load" }
      );
      const results = [];
      for (const assertion of assertions) {
        const t0 = Date.now();
        let passed = false;
        let actual;
        let error;
        try {
          switch (assertion.type) {
            case "title": {
              actual = await session.browser.getTitle();
              passed = assertion.expected ? actual.includes(assertion.expected) : actual.length > 0;
              break;
            }
            case "element_visible": {
              if (!assertion.selector) throw new Error("selector required for element_visible");
              const el = await session.browser.$(assertion.selector);
              passed = await el.isDisplayed();
              actual = passed ? "visible" : "not visible";
              break;
            }
            case "element_text": {
              if (!assertion.selector) throw new Error("selector required for element_text");
              const el = await session.browser.$(assertion.selector);
              actual = await el.getText();
              passed = assertion.expected ? actual.includes(assertion.expected) : actual.length > 0;
              break;
            }
            case "element_count": {
              if (!assertion.selector) throw new Error("selector required for element_count");
              const els = await session.browser.$$(assertion.selector);
              actual = String(els.length);
              passed = assertion.count !== void 0 ? els.length === assertion.count : els.length > 0;
              break;
            }
            case "url_contains": {
              actual = await session.browser.getUrl();
              passed = assertion.expected ? actual.includes(assertion.expected) : true;
              break;
            }
            case "no_console_errors": {
              const logs = await session.browser.getLogs("browser").catch(() => []);
              const errors = logs.filter((l) => l.level === "SEVERE");
              passed = errors.length === 0;
              actual = errors.length === 0 ? "no errors" : `${errors.length} error(s): ${errors.map((e) => e.message).join("; ")}`;
              break;
            }
            default:
              throw new Error(`Unknown assertion type: ${assertion.type}`);
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
          durationMs: Date.now() - t0
        });
      }
      const passedCount = results.filter((r) => r.passed).length;
      const failedCount = results.length - passedCount;
      return this.success({
        url,
        passed: passedCount,
        failed: failedCount,
        total: results.length,
        allPassed: failedCount === 0,
        results
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }
  async handleMeasurePerformance(args) {
    let session = null;
    try {
      const { url, runs = 1 } = args;
      const clampedRuns = Math.min(Math.max(runs, 1), 3);
      const allMetrics = [];
      session = await createBrowserSession();
      for (let i = 0; i < clampedRuns; i++) {
        await session.browser.url(url);
        await session.browser.waitUntil(
          async () => await session.browser.execute(() => document.readyState) === "complete",
          { timeout: 15e3, timeoutMsg: "Page did not load" }
        );
        const base = await session.browser.execute(PERF_SCRIPT);
        const lcpMs = await session.browser.executeAsync(
          `(function(done) { ${LCP_SCRIPT.replace("(function() {", "").replace("})();", "")} .then(done); })(...arguments)`
        );
        allMetrics.push({ ...base, lcpMs });
      }
      const avg = (key) => {
        const vals = allMetrics.map((m) => m[key]).filter((v) => v !== null && typeof v === "number");
        if (vals.length === 0) return null;
        return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      };
      const averaged = {
        ttfbMs: avg("ttfbMs") ?? 0,
        domContentLoadedMs: avg("domContentLoadedMs") ?? 0,
        loadMs: avg("loadMs") ?? 0,
        lcpMs: avg("lcpMs"),
        fcpMs: avg("fcpMs"),
        domNodes: avg("domNodes") ?? 0,
        resources: avg("resources") ?? 0
      };
      const lcpHealth = averaged.lcpMs === null ? "unknown" : averaged.lcpMs <= 2500 ? "good" : averaged.lcpMs <= 4e3 ? "needs improvement" : "poor";
      const fcpHealth = averaged.fcpMs === null ? "unknown" : averaged.fcpMs <= 1800 ? "good" : averaged.fcpMs <= 3e3 ? "needs improvement" : "poor";
      return this.success({
        url,
        runs: clampedRuns,
        metrics: {
          ttfb: { ms: averaged.ttfbMs, health: averaged.ttfbMs <= 800 ? "good" : "slow" },
          domContentLoaded: { ms: averaged.domContentLoadedMs },
          load: { ms: averaged.loadMs },
          lcp: { ms: averaged.lcpMs, health: lcpHealth, target: "\u2264 2500ms (good)" },
          fcp: { ms: averaged.fcpMs, health: fcpHealth, target: "\u2264 1800ms (good)" },
          domNodes: { count: averaged.domNodes, health: averaged.domNodes <= 1500 ? "good" : "high (consider lazy rendering)" },
          resources: { count: averaged.resources }
        },
        rawRuns: allMetrics
      });
    } catch (err) {
      return this.error(err);
    } finally {
      if (session) await destroySession(session);
    }
  }
};
function toCamelCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/^\d+/, "").slice(0, 40) || "element";
}
new WdioRunnerServer().run().catch(console.error);
