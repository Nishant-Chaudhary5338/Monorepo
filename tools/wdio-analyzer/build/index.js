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
import * as fs from "fs";
import * as path from "path";
function scanFiles(target, exts) {
  const results = [];
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (exts.some((e) => target.endsWith(e))) results.push(target);
    return results;
  }
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", "build", "dist", ".git"].includes(entry.name)) continue;
        walk(fullPath);
      } else if (exts.some((e) => entry.name.endsWith(e))) {
        results.push(fullPath);
      }
    }
  }
  walk(target);
  return results;
}
function readLines(filePath) {
  return fs.readFileSync(filePath, "utf-8").split("\n");
}
var SELECTOR_PATTERNS = [
  {
    pattern: /\[data-testid=['"]([^'"]+)['"]\]|\[data-testid=([^\]]+)\]/,
    strategy: "data-testid",
    score: 9
  },
  {
    pattern: /\[data-test-id=['"]([^'"]+)['"]\]|\[data-test=['"]([^'"]+)['"]\]/,
    strategy: "data-test-id / data-test",
    score: 9
  },
  {
    pattern: /\[aria-label=['"]([^'"]+)['"]\]/,
    strategy: "aria-label",
    score: 8
  },
  {
    pattern: /\[role=['"]([^'"]+)['"]\]/,
    strategy: "aria-role",
    score: 7
  },
  {
    pattern: /^#[a-zA-Z][\w-]*$/,
    strategy: "id",
    score: 7,
    recommendation: "Safe if the ID is not dynamically generated. Verify it is stable across renders."
  },
  {
    pattern: /\[name=['"]([^'"]+)['"]\]/,
    strategy: "name attribute",
    score: 6
  },
  {
    pattern: /\[placeholder=['"]([^'"]+)['"]\]/,
    strategy: "placeholder",
    score: 5,
    recommendation: "Prefer data-testid \u2014 placeholders change with UX copy."
  },
  {
    pattern: /\/\/[^"'\s]*text\(\)/,
    strategy: "XPath text()",
    score: 4,
    recommendation: "Brittle: breaks when copy changes. Use aria-label or data-testid."
  },
  {
    pattern: /^\.[a-zA-Z][\w-]*(\s+\.[a-zA-Z][\w-]*)*/,
    strategy: "CSS class",
    score: 3,
    recommendation: "CSS classes change with styling refactors. Switch to data-testid."
  },
  {
    pattern: /[a-z]+\s+[a-z]|[a-z]+\s*>\s*[a-z]/,
    strategy: "Nested CSS / tag chain",
    score: 2,
    recommendation: "Very brittle. Any DOM restructure breaks this selector. Add data-testid to the element."
  }
];
function classifySelector(selectorStr) {
  for (const { pattern, strategy, score, recommendation } of SELECTOR_PATTERNS) {
    if (pattern.test(selectorStr)) {
      return { strategy, score, recommendation };
    }
  }
  return {
    strategy: "unknown / complex",
    score: 1,
    recommendation: "Could not classify selector. Review manually and add data-testid if possible."
  };
}
var SELECTOR_RE = /\$\$?\(['"`]([^'"`]+)['"`]\)/g;
function findSelectors(lines, filePath) {
  const findings = [];
  lines.forEach((line, idx) => {
    let match;
    const re = new RegExp(SELECTOR_RE.source, "g");
    while ((match = re.exec(line)) !== null) {
      const selector = match[1];
      const { strategy, score, recommendation } = classifySelector(selector);
      findings.push({
        file: filePath,
        line: idx + 1,
        selector,
        strategy,
        score,
        recommendation
      });
    }
  });
  return findings;
}
var ANTI_PATTERN_RULES = [
  {
    id: "no-browser-pause",
    pattern: /browser\.pause\s*\(\s*\d+\s*\)/,
    severity: "error",
    message: "`browser.pause()` is a hard-coded wait. It makes tests slow and flaky.",
    fix: "Replace with `await el.waitForDisplayed()`, `await el.waitForClickable()`, or `browser.waitUntil()`."
  },
  {
    id: "no-browser-sleep",
    pattern: /browser\.sleep\s*\(\s*\d+\s*\)/,
    severity: "error",
    message: "`browser.sleep()` is deprecated and causes brittle waits.",
    fix: "Use `await browser.waitUntil(() => condition, { timeout: N })` instead."
  },
  {
    id: "missing-await",
    pattern: /(?<!await\s)(?<!\w)\$\$?\(['"]/,
    severity: "warning",
    message: "WebdriverIO element commands return Promises. Missing `await` causes silent test failures.",
    fix: "Add `await` before `$()` / `$$()` calls and all element interactions."
  },
  {
    id: "raw-selector-in-spec",
    pattern: /(?:describe|it|before|after)[\s\S]*?\$\$?\(['"]/,
    severity: "warning",
    message: "Selectors defined directly inside spec files bypass the Page Object Model.",
    fix: "Move all selectors and element interactions into a Page Object class."
  },
  {
    id: "magic-timeout",
    pattern: /\{\s*timeout\s*:\s*\d{4,}\s*\}/,
    severity: "info",
    message: "Magic number timeout detected. Hard-coded numbers are hard to maintain.",
    fix: "Extract to a named constant: `const TIMEOUTS = { MEDIUM: 10_000 }` then use `{ timeout: TIMEOUTS.MEDIUM }`."
  },
  {
    id: "console-log-in-spec",
    pattern: /console\.(log|warn|info)\s*\(/,
    severity: "info",
    message: "`console.log` left in spec file. Pollutes test output.",
    fix: "Remove debug logs before committing. Use a dedicated logger or WDIO's built-in logging."
  },
  {
    id: "no-aftereach-teardown",
    pattern: /beforeEach\s*\(async/,
    severity: "info",
    message: "A `beforeEach` hook is present but no `afterEach` teardown was found. Dirty state can leak between tests.",
    fix: "Add an `afterEach` hook to clean up state (e.g. clear cookies, reset mock data)."
  },
  {
    id: "multiple-browser-url-in-it",
    pattern: /it\s*\([\s\S]*?browser\.url[\s\S]*?browser\.url/,
    severity: "warning",
    message: "Multiple `browser.url()` calls inside one `it()` block suggests poor test isolation.",
    fix: "Each `it()` should test one scenario. Move navigation to `beforeEach` or split into separate tests."
  },
  {
    id: "hardcoded-url",
    pattern: /browser\.url\s*\(\s*['"]https?:\/\//,
    severity: "warning",
    message: "Hardcoded absolute URL inside test. Will break in different environments.",
    fix: "Use `browser.url(page.path)` via the Page Object, or read from `browser.options.baseUrl`."
  },
  {
    id: "expect-without-await",
    pattern: /(?<!await\s)expect\s*\(\s*(?:await\s*)?\$\$?\(/,
    severity: "error",
    message: "Calling `expect()` on an un-awaited element chain. The assertion runs on a Promise, not the resolved element.",
    fix: "Use `await expect(el).toBeDisplayed()` \u2014 always await the outer `expect()` call."
  }
];
function detectAntiPatterns(lines, filePath) {
  const findings = [];
  const fullContent = lines.join("\n");
  for (const rule of ANTI_PATTERN_RULES) {
    if (rule.id === "no-aftereach-teardown") {
      if (rule.pattern.test(fullContent) && !/afterEach/.test(fullContent)) {
        findings.push({
          file: filePath,
          line: 0,
          code: "(file-level)",
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix
        });
      }
      continue;
    }
    if (rule.id === "multiple-browser-url-in-it") {
      if (rule.pattern.test(fullContent)) {
        findings.push({
          file: filePath,
          line: 0,
          code: "(file-level)",
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix
        });
      }
      continue;
    }
    lines.forEach((line, idx) => {
      if (rule.pattern.test(line)) {
        findings.push({
          file: filePath,
          line: idx + 1,
          code: line.trim(),
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix
        });
      }
    });
  }
  return findings;
}
function extractPomMembers(pomSource) {
  const getters = [];
  const methods = [];
  const getterRe = /^\s*get\s+(\w+)\s*\(\)/gm;
  let m;
  while ((m = getterRe.exec(pomSource)) !== null) {
    getters.push(m[1]);
  }
  const methodRe = /^\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\S+)?\s*\{/gm;
  while ((m = methodRe.exec(pomSource)) !== null) {
    const name = m[1];
    if (["constructor", "registerTools", "run", "shutdown"].includes(name)) continue;
    if (name.startsWith("_")) continue;
    if (getters.includes(name)) continue;
    methods.push(name);
  }
  return { getters, methods };
}
function findUsagesInSpecs(names, specFiles) {
  const used = /* @__PURE__ */ new Set();
  for (const specFile of specFiles) {
    const content = fs.readFileSync(specFile, "utf-8");
    for (const name of names) {
      if (new RegExp(`\\.${name}\\b`).test(content)) {
        used.add(name);
      }
    }
  }
  return used;
}
function applyAutoFixes(lines) {
  const changes = [];
  const fixed = lines.map((line, idx) => {
    const lineNum = idx + 1;
    if (/browser\.pause\s*\(\d+\)/.test(line)) {
      const replacement = line.replace(
        /browser\.pause\s*\((\d+)\)/g,
        "await browser.waitUntil(() => true, { timeout: $1 }) /* TODO: replace with a real condition */"
      );
      changes.push(`Line ${lineNum}: Replaced browser.pause() with browser.waitUntil()`);
      return replacement;
    }
    if (/\{\s*timeout\s*:\s*(\d{4,})\s*\}/.test(line)) {
      changes.push(`Line ${lineNum}: Magic timeout \u2014 consider extracting to TIMEOUTS constant`);
    }
    if (/console\.(log|warn|info)\s*\(/.test(line)) {
      changes.push(`Line ${lineNum}: Removed console.${line.match(/console\.(\w+)/)?.[1] ?? "log"}()`);
      return line.replace(/^\s*console\.(log|warn|info)\s*\([^)]*\);?\s*$/, "");
    }
    return line;
  });
  return { lines: fixed.filter((l) => l !== void 0), changes };
}
var WdioAnalyzerServer = class extends McpServerBase {
  constructor() {
    super({ name: "wdio-analyzer", version: "1.0.0" });
  }
  registerTools() {
    this.addTool(
      "analyze_selectors",
      "Scan WebdriverIO test files and score every selector for robustness (1-10). Returns per-file findings with strategy classification and improvement recommendations.",
      {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Absolute path to a single .ts / .js file to analyze"
          },
          dirPath: {
            type: "string",
            description: "Absolute path to a directory \u2014 all .ts / .js files are scanned recursively"
          }
        }
      },
      async (args) => this.handleAnalyzeSelectors(args)
    );
    this.addTool(
      "detect_anti_patterns",
      "Scan test files for known WebdriverIO anti-patterns: browser.pause(), missing await, raw selectors in specs, magic timeouts, console.log leftovers, missing teardown, and more. Returns findings grouped by severity.",
      {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Absolute path to a single file"
          },
          dirPath: {
            type: "string",
            description: "Absolute path to a directory to scan recursively"
          }
        }
      },
      async (args) => this.handleDetectAntiPatterns(args)
    );
    this.addTool(
      "audit_pom_coverage",
      "Compare a Page Object Model class against a directory of spec files. Reports which public getters and methods are covered, which are dead code, and which are called in specs but missing from the POM (typos / stale refs).",
      {
        type: "object",
        properties: {
          pomFile: {
            type: "string",
            description: "Absolute path to the Page Object class file (e.g. LoginPage.ts)"
          },
          specDir: {
            type: "string",
            description: "Absolute path to the directory containing spec files"
          }
        },
        required: ["pomFile", "specDir"]
      },
      async (args) => this.handleAuditPomCoverage(args)
    );
    this.addTool(
      "suggest_refactor",
      "Read a WebdriverIO test file, apply automated fixes for detected anti-patterns (pause \u2192 waitUntil, remove console.log, etc.), and return the refactored source with a change summary. Pass dryRun=false to write to disk.",
      {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description: "Absolute path to the test file to refactor"
          },
          dryRun: {
            type: "boolean",
            description: "When true (default) returns the refactored source without writing to disk"
          }
        },
        required: ["filePath"]
      },
      async (args) => this.handleSuggestRefactor(args)
    );
  }
  async handleAnalyzeSelectors(args) {
    try {
      const target = args.filePath ?? args.dirPath;
      if (!target) return this.error(new Error("Provide filePath or dirPath"));
      if (!fs.existsSync(target)) return this.error(new Error(`Path not found: ${target}`));
      const files = scanFiles(target, [".ts", ".js"]);
      const allFindings = [];
      for (const file of files) {
        const lines = readLines(file);
        allFindings.push(...findSelectors(lines, file));
      }
      const scores = allFindings.map((f) => f.score);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const fragile = allFindings.filter((f) => f.score <= 4);
      const moderate = allFindings.filter((f) => f.score >= 5 && f.score <= 6);
      const robust = allFindings.filter((f) => f.score >= 7);
      const byFile = files.reduce((acc, f) => {
        acc[f] = allFindings.filter((s) => s.file === f);
        return acc;
      }, {});
      return this.success({
        summary: {
          filesScanned: files.length,
          totalSelectors: allFindings.length,
          averageScore: Math.round(avgScore * 10) / 10,
          robustCount: robust.length,
          moderateCount: moderate.length,
          fragileCount: fragile.length,
          overallHealth: avgScore >= 7 ? "good" : avgScore >= 5 ? "needs work" : "poor"
        },
        scoreGuide: {
          9: "data-testid / data-test",
          8: "aria-label",
          7: "id / aria-role",
          6: "name attribute",
          5: "placeholder",
          4: "XPath text()",
          3: "CSS class",
          2: "Nested tag chain",
          1: "Unknown / complex"
        },
        fragileSelectors: fragile.map((f) => ({
          file: path.relative(process.cwd(), f.file),
          line: f.line,
          selector: f.selector,
          score: f.score,
          strategy: f.strategy,
          recommendation: f.recommendation
        })),
        allFindings: allFindings.map((f) => ({
          file: path.relative(process.cwd(), f.file),
          line: f.line,
          selector: f.selector,
          score: f.score,
          strategy: f.strategy,
          recommendation: f.recommendation
        }))
      });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleDetectAntiPatterns(args) {
    try {
      const target = args.filePath ?? args.dirPath;
      if (!target) return this.error(new Error("Provide filePath or dirPath"));
      if (!fs.existsSync(target)) return this.error(new Error(`Path not found: ${target}`));
      const files = scanFiles(target, [".ts", ".js"]);
      const allFindings = [];
      for (const file of files) {
        const lines = readLines(file);
        allFindings.push(...detectAntiPatterns(lines, file));
      }
      const errors = allFindings.filter((f) => f.severity === "error");
      const warnings = allFindings.filter((f) => f.severity === "warning");
      const infos = allFindings.filter((f) => f.severity === "info");
      return this.success({
        summary: {
          filesScanned: files.length,
          totalFindings: allFindings.length,
          errors: errors.length,
          warnings: warnings.length,
          info: infos.length,
          clean: allFindings.length === 0
        },
        findings: {
          errors: errors.map((f) => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix
          })),
          warnings: warnings.map((f) => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix
          })),
          info: infos.map((f) => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix
          }))
        }
      });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleAuditPomCoverage(args) {
    try {
      const { pomFile, specDir } = args;
      if (!fs.existsSync(pomFile)) return this.error(new Error(`POM file not found: ${pomFile}`));
      if (!fs.existsSync(specDir)) return this.error(new Error(`Spec directory not found: ${specDir}`));
      const pomSource = fs.readFileSync(pomFile, "utf-8");
      const { getters, methods } = extractPomMembers(pomSource);
      const specFiles = scanFiles(specDir, [".spec.ts", ".spec.js", ".test.ts", ".test.js"]);
      if (specFiles.length === 0) {
        return this.error(new Error(`No spec files found in: ${specDir}`));
      }
      const allMembers = [...getters, ...methods];
      const usedSet = findUsagesInSpecs(allMembers, specFiles);
      const coveredGetters = getters.filter((g) => usedSet.has(g));
      const uncoveredGetters = getters.filter((g) => !usedSet.has(g));
      const coveredMethods = methods.filter((m) => usedSet.has(m));
      const uncoveredMethods = methods.filter((m) => !usedSet.has(m));
      const allSpecContent = specFiles.map((f) => fs.readFileSync(f, "utf-8")).join("\n");
      const calledRe = /\.(\w+)\b/g;
      const specCalls = /* @__PURE__ */ new Set();
      let sm;
      while ((sm = calledRe.exec(allSpecContent)) !== null) {
        specCalls.add(sm[1]);
      }
      const phantomCalls = [...specCalls].filter(
        (c) => !allMembers.includes(c) && c.length > 3 && !/^(then|catch|finally|length|push|map|filter|find|forEach|toString|valueOf)$/.test(c)
      );
      const total = allMembers.length;
      const covered = coveredGetters.length + coveredMethods.length;
      const coveragePercent = total > 0 ? Math.round(covered / total * 100) : 0;
      return this.success({
        pomFile: path.relative(process.cwd(), pomFile),
        specFilesAnalyzed: specFiles.map((f) => path.relative(process.cwd(), f)),
        coverage: {
          percent: coveragePercent,
          health: coveragePercent >= 80 ? "good" : coveragePercent >= 50 ? "moderate" : "low",
          coveredMembers: covered,
          totalMembers: total
        },
        getters: {
          covered: coveredGetters,
          uncovered: uncoveredGetters
        },
        methods: {
          covered: coveredMethods,
          uncovered: uncoveredMethods
        },
        phantomCalls: phantomCalls.slice(0, 20)
      });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleSuggestRefactor(args) {
    try {
      const { filePath, dryRun = true } = args;
      if (!fs.existsSync(filePath)) return this.error(new Error(`File not found: ${filePath}`));
      const original = fs.readFileSync(filePath, "utf-8");
      const lines = original.split("\n");
      const antiBefore = detectAntiPatterns(lines, filePath);
      const { lines: fixedLines, changes } = applyAutoFixes(lines);
      const fixedSource = fixedLines.join("\n");
      const antiAfter = detectAntiPatterns(fixedLines, filePath);
      if (!dryRun) {
        fs.writeFileSync(filePath, fixedSource, "utf-8");
      }
      return this.success({
        filePath: path.relative(process.cwd(), filePath),
        dryRun,
        written: !dryRun,
        changes,
        findingsBefore: antiBefore.length,
        findingsAfter: antiAfter.length,
        remainingFindings: antiAfter.map((f) => ({
          line: f.line,
          pattern: f.pattern,
          message: f.message,
          fix: f.fix
        })),
        refactoredSource: fixedSource
      });
    } catch (err) {
      return this.error(err);
    }
  }
};
new WdioAnalyzerServer().run().catch(console.error);
