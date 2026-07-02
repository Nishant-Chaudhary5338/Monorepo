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
function extractAttr(tag, attr) {
  const re = new RegExp(`${attr}=["']([^"']+)["']`, "i");
  return tag.match(re)?.[1];
}
function parseHtmlForElements(html) {
  const elements = [];
  const interactiveTags = /(input|button|a|select|textarea|label)/i;
  const tagRe = /<(input|button|a|select|textarea)[^>]*>/gi;
  let match;
  while ((match = tagRe.exec(html)) !== null) {
    const raw = match[0];
    const tag = match[1].toLowerCase();
    const el = {
      tag,
      role: tag === "a" ? "link" : tag === "button" ? "button" : tag === "select" ? "combobox" : "textbox",
      testId: extractAttr(raw, "data-testid") ?? extractAttr(raw, "data-test-id") ?? extractAttr(raw, "data-test"),
      ariaLabel: extractAttr(raw, "aria-label"),
      id: extractAttr(raw, "id"),
      name: extractAttr(raw, "name"),
      type: extractAttr(raw, "type"),
      placeholder: extractAttr(raw, "placeholder"),
      cssClass: extractAttr(raw, "class")
    };
    if (tag === "input" && (el.type === "hidden" || el.type === "submit" || el.type === "reset")) continue;
    elements.push(el);
  }
  return elements;
}
function bestSelector(el) {
  if (el.testId) return `[data-testid="${el.testId}"]`;
  if (el.ariaLabel) return `[aria-label="${el.ariaLabel}"]`;
  if (el.id && !/^\d/.test(el.id) && !/[-_]{2}/.test(el.id)) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.placeholder) return `[placeholder="${el.placeholder}"]`;
  if (el.cssClass) {
    const stable = el.cssClass.split(" ").find((c) => !c.match(/^(is-|has-|active|disabled|hover|focus)/));
    if (stable) return `.${stable}`;
  }
  return el.tag;
}
function elementToPropertyName(el) {
  const hint = el.testId ?? el.ariaLabel ?? el.id ?? el.name ?? el.placeholder ?? el.tag;
  return toCamelCase(hint);
}
function toCamelCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());
}
function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}
async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "wdio-scaffolder-mcp/1.0" },
    signal: AbortSignal.timeout(1e4)
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  return res.text();
}
function generateWdioConf(variant, features = []) {
  const hasAllure = variant === "allure" || features.includes("allure");
  const hasParallel = variant === "parallel" || features.includes("parallel");
  const hasBS = variant === "browserstack" || features.includes("browserstack");
  const isFirefox = variant === "firefox";
  const reporters = hasAllure ? `['spec', ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: false }]]` : `['spec']`;
  const capabilities = hasBS ? `[{
    browserName: 'chrome',
    browserVersion: 'latest',
    'bstack:options': {
      os: 'OS X',
      osVersion: 'Ventura',
      buildName: process.env.BUILD_NAME ?? 'local',
      sessionName: 'Smoke Tests',
    },
  }]` : isFirefox ? `[{
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: ['--headless'],
    },
  }]` : `[{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'],
    },
  }]`;
  const hostnameBlock = hasBS ? `
  hostname: 'hub.browserstack.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,` : "";
  const services = hasBS ? `['browserstack']` : isFirefox ? `['geckodriver']` : `['chromedriver']`;
  return `import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: ['./test/specs/**/*.spec.ts'],
  exclude: [],
  maxInstances: ${hasParallel ? 4 : 1},${hostnameBlock}
  capabilities: ${capabilities},
  logLevel: 'warn',
  bail: 0,
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
  services: ${services},
  framework: 'mocha',
  reporters: ${reporters},
  mochaOpts: {
    ui: 'bdd',
    timeout: 60_000,
  },
};
`;
}
function generateBasePage() {
  return `import { browser } from '@wdio/globals';

export abstract class BasePage {
  protected abstract path: string;

  async open(): Promise<void> {
    await browser.url(this.path);
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await browser.waitUntil(
      async () => (await browser.execute(() => document.readyState)) === 'complete',
      { timeout: 10_000, timeoutMsg: 'Page did not reach readyState=complete within 10s' }
    );
  }

  async getTitle(): Promise<string> {
    return browser.getTitle();
  }

  async getCurrentUrl(): Promise<string> {
    return browser.getUrl();
  }

  async scrollToBottom(): Promise<void> {
    await browser.execute(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async waitForNetworkIdle(timeout = 5_000): Promise<void> {
    await browser.pause(500); // brief settle after navigation
  }
}
`;
}
function generatePageObjectClass(pageName, elements) {
  const className = toPascalCase(pageName) + "Page";
  const seen = /* @__PURE__ */ new Set();
  const unique = elements.filter((el) => {
    const prop = elementToPropertyName(el);
    if (seen.has(prop)) return false;
    seen.add(prop);
    return true;
  });
  const getters = unique.map((el) => {
    const prop = elementToPropertyName(el);
    const selector = bestSelector(el);
    return `  get ${prop}() {
    return $('${selector}');
  }`;
  }).join("\n\n");
  const actionMethods = [];
  const inputs = unique.filter((el) => el.tag === "input" && el.type !== "checkbox" && el.type !== "radio");
  const buttons = unique.filter((el) => el.tag === "button");
  if (inputs.length > 0 && buttons.length > 0) {
    const inputFillLines = inputs.map((el) => {
      const prop = elementToPropertyName(el);
      const param = prop.replace(/Input$/, "").replace(/Field$/, "");
      return `    await this.${prop}.setValue(${param});`;
    }).join("\n");
    const params = inputs.map((el) => {
      const prop = elementToPropertyName(el);
      const param = prop.replace(/Input$/, "").replace(/Field$/, "");
      return `${param}: string`;
    }).join(", ");
    const firstButton = elementToPropertyName(buttons[0]);
    const methodName = "submit";
    actionMethods.push(
      `  async ${methodName}(${params}): Promise<void> {
${inputFillLines}
    await this.${firstButton}.click();
  }`
    );
  }
  return `import { $ } from '@wdio/globals';
import { BasePage } from './BasePage.js';

export class ${className} extends BasePage {
  protected path = '/${pageName.toLowerCase()}';

${getters}
${actionMethods.length > 0 ? "\n" + actionMethods.join("\n\n") : ""}
}
`;
}
function generateExamplePage() {
  return `import { $, $$ } from '@wdio/globals';
import { BasePage } from './BasePage.js';

export class ExamplePage extends BasePage {
  protected path = '/';

  get heading() {
    return $('[data-testid="main-heading"]');
  }

  get navLinks() {
    return $$('[data-testid="nav-link"]');
  }

  get searchInput() {
    return $('[aria-label="Search"]');
  }

  get searchButton() {
    return $('[data-testid="search-submit"]');
  }

  get errorMessage() {
    return $('[data-testid="error-message"]');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.setValue(term);
    await this.searchButton.click();
  }
}
`;
}
function generateSpec(feature, pageName, pomMethods) {
  const className = toPascalCase(pageName) + "Page";
  const importPath = `../page-objects/${className}.js`;
  const varName = toCamelCase(pageName) + "Page";
  const itBlocks = pomMethods.length > 0 ? pomMethods.map((m) => `  it('should call ${m} correctly', async () => {
    // TODO: implement assertion for ${m}
    await expect(${varName}.${m.replace(/\(.*\)/, "")}).toBeDisplayed();
  });`).join("\n\n") : `  it('should load the page successfully', async () => {
    await expect(${varName}.heading).toBeDisplayed();
  });

  it('should have a valid page title', async () => {
    const title = await ${varName}.getTitle();
    expect(title).toBeTruthy();
  });

  it('should have the correct URL', async () => {
    const url = await ${varName}.getCurrentUrl();
    expect(url).toContain('${pageName.toLowerCase()}');
  });`;
  return `import { expect } from '@wdio/globals';
import { ${className} } from '${importPath}';

describe('${feature}', () => {
  let ${varName}: ${className};

  before(async () => {
    ${varName} = new ${className}();
  });

  beforeEach(async () => {
    await ${varName}.open();
  });

${itBlocks}
});
`;
}
function generateExampleSpec() {
  return `import { expect } from '@wdio/globals';
import { ExamplePage } from '../page-objects/ExamplePage.js';

const SEARCH_TERM = 'webdriverio';

describe('Example Feature', () => {
  let page: ExamplePage;

  before(async () => {
    page = new ExamplePage();
  });

  beforeEach(async () => {
    await page.open();
  });

  it('should display the main heading', async () => {
    await expect(page.heading).toBeDisplayed();
  });

  it('should perform a search and return results', async () => {
    await page.search(SEARCH_TERM);
    const url = await page.getCurrentUrl();
    expect(url).toContain(SEARCH_TERM);
  });

  it('should not show an error message on initial load', async () => {
    await expect(page.errorMessage).not.toBeDisplayed();
  });
});
`;
}
function generateAssertionHelpers() {
  return `import { expect, $ } from '@wdio/globals';

export const TIMEOUTS = {
  SHORT: 3_000,
  MEDIUM: 10_000,
  LONG: 30_000,
} as const;

export async function expectText(selector: string, text: string): Promise<void> {
  const el = $(selector);
  await el.waitForDisplayed({ timeout: TIMEOUTS.MEDIUM });
  await expect(el).toHaveText(text);
}

export async function expectVisible(selector: string): Promise<void> {
  const el = $(selector);
  await el.waitForDisplayed({ timeout: TIMEOUTS.MEDIUM });
  await expect(el).toBeDisplayed();
}

export async function expectHidden(selector: string): Promise<void> {
  const el = $(selector);
  await expect(el).not.toBeDisplayed();
}

export async function expectUrl(pattern: string | RegExp): Promise<void> {
  await expect(await import('@wdio/globals').then(m => m.browser)).toHaveUrl(pattern);
}

export async function expectAttribute(selector: string, attr: string, value: string): Promise<void> {
  const el = $(selector);
  await expect(el).toHaveAttribute(attr, value);
}
`;
}
function generateTestData() {
  return `export interface UserCredentials {
  email: string;
  password: string;
}

export interface Address {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'SecurePass123!',
  } satisfies UserCredentials,

  invalid: {
    email: 'notanemail',
    password: '123',
  } satisfies UserCredentials,

  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
    password: process.env.ADMIN_PASSWORD ?? 'AdminPass123!',
  } satisfies UserCredentials,
} as const;

export const testAddresses = {
  uk: {
    street: '10 Downing Street',
    city: 'London',
    postcode: 'SW1A 2AA',
    country: 'United Kingdom',
  } satisfies Address,
} as const;

export function randomEmail(): string {
  return \`test_\${Date.now()}@example.com\`;
}

export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
`;
}
function generateProjectPackageJson(projectName, hasAllure, hasBS) {
  const reporters = {
    "@wdio/spec-reporter": "^9.0.0"
  };
  if (hasAllure) {
    reporters["@wdio/allure-reporter"] = "^9.0.0";
    reporters["allure-commandline"] = "^2.29.0";
  }
  const services = {
    "wdio-chromedriver-service": "^9.0.0"
  };
  if (hasBS) services["@wdio/browserstack-service"] = "^9.0.0";
  return JSON.stringify(
    {
      name: projectName,
      version: "1.0.0",
      private: true,
      scripts: {
        test: "wdio run wdio.conf.ts",
        "test:headed": "WDIO_HEADLESS=false wdio run wdio.conf.ts",
        ...hasAllure ? {
          report: "allure generate allure-results --clean -o allure-report",
          "report:open": "allure open allure-report"
        } : {}
      },
      dependencies: {},
      devDependencies: {
        "@wdio/cli": "^9.0.0",
        "@wdio/local-runner": "^9.0.0",
        "@wdio/mocha-framework": "^9.0.0",
        "@wdio/types": "^9.0.0",
        "@wdio/globals": "^9.0.0",
        chromedriver: "latest",
        ...reporters,
        ...services,
        "ts-node": "^10.9.0",
        typescript: "^5.0.0"
      }
    },
    null,
    2
  );
}
function generateProjectTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "CommonJS",
        lib: ["ES2022"],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        resolveJsonModule: true,
        types: ["node", "@wdio/globals/types", "@wdio/mocha-framework"]
      },
      include: ["test/**/*.ts", "wdio.conf.ts"],
      exclude: ["node_modules"]
    },
    null,
    2
  );
}
function generateGitignore() {
  return `node_modules/
build/
dist/
allure-results/
allure-report/
*.log
.env
.env.local
`;
}
function generateEnvTemplate(hasBS) {
  return `BASE_URL=http://localhost:3000
${hasBS ? `BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BUILD_NAME=local` : ""}
`;
}
function generateBrowserStackYml(projectName) {
  return `userName: \${BROWSERSTACK_USERNAME}
accessKey: \${BROWSERSTACK_ACCESS_KEY}

browsers:
  - browserName: chrome
    browserVersion: latest
  - browserName: firefox
    browserVersion: latest

buildName: ${projectName}
projectName: ${projectName}

parallelsPerPlatform: 2
`;
}
function writeFiles(targetDir, files) {
  const written = [];
  for (const { relativePath, content } of files) {
    const fullPath = path.join(targetDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    written.push(relativePath);
  }
  return written;
}
var WdioScaffolderServer = class extends McpServerBase {
  constructor() {
    super({ name: "wdio-scaffolder", version: "1.0.0" });
  }
  registerTools() {
    this.addTool(
      "scaffold_project",
      "Scaffold a complete WebdriverIO + TypeScript test project with page objects, spec files, helpers, and config. Writes all files to disk.",
      {
        type: "object",
        properties: {
          projectName: {
            type: "string",
            description: 'Name of the project directory to create (e.g. "my-app-e2e")'
          },
          targetDir: {
            type: "string",
            description: "Absolute path where the project folder will be created. Defaults to current working directory."
          },
          features: {
            type: "array",
            items: { type: "string", enum: ["allure", "parallel", "docker", "browserstack"] },
            description: "Optional features to include in the generated project"
          }
        },
        required: ["projectName"]
      },
      async (args) => this.handleScaffoldProject(args)
    );
    this.addTool(
      "generate_page_object",
      "Generate a TypeScript Page Object Model class from a URL (fetches live HTML) or an HTML string. Extracts inputs, buttons, and links and applies the selector priority: data-testid > aria-label > id > name > CSS class.",
      {
        type: "object",
        properties: {
          pageName: {
            type: "string",
            description: 'Name of the page / class (e.g. "Login", "Checkout") \u2014 used as class name and file name'
          },
          url: {
            type: "string",
            description: "Live URL to fetch HTML from"
          },
          html: {
            type: "string",
            description: "Raw HTML string to parse (use instead of url)"
          },
          outputDir: {
            type: "string",
            description: "Absolute path to write the generated file. When omitted the source is returned as a string only."
          }
        },
        required: ["pageName"]
      },
      async (args) => this.handleGeneratePageObject(args)
    );
    this.addTool(
      "generate_spec",
      "Generate a WebdriverIO Mocha spec file from a natural language feature description. Optionally reference a page name and list of POM methods to scaffold realistic it() blocks.",
      {
        type: "object",
        properties: {
          feature: {
            type: "string",
            description: 'Feature or scenario description (e.g. "User login with valid credentials")'
          },
          pageName: {
            type: "string",
            description: 'Page name to import and instantiate (e.g. "Login")'
          },
          pomMethods: {
            type: "array",
            items: { type: "string" },
            description: 'Public POM method or getter names to call in the spec (e.g. ["login()", "heading", "errorMessage"])'
          },
          outputPath: {
            type: "string",
            description: "Absolute file path to write the spec to. When omitted the source is returned as a string."
          }
        },
        required: ["feature"]
      },
      async (args) => this.handleGenerateSpec(args)
    );
    this.addTool(
      "generate_config",
      "Generate a wdio.conf.ts file for a specific scenario: headless Chrome, Firefox, parallel execution, Allure reporting, or BrowserStack cloud.",
      {
        type: "object",
        properties: {
          variant: {
            type: "string",
            enum: ["headless-chrome", "firefox", "parallel", "allure", "browserstack"],
            description: "Configuration variant to generate"
          },
          outputPath: {
            type: "string",
            description: "Absolute file path to write the config to. When omitted the source is returned as a string."
          }
        },
        required: ["variant"]
      },
      async (args) => this.handleGenerateConfig(args)
    );
  }
  async handleScaffoldProject(args) {
    try {
      const { projectName, targetDir, features = [] } = args;
      const baseDir = path.join(targetDir ?? process.cwd(), projectName);
      if (fs.existsSync(baseDir)) {
        return this.error(new Error(`Directory already exists: ${baseDir}`));
      }
      const hasAllure = features.includes("allure");
      const hasBS = features.includes("browserstack");
      const files = [
        { relativePath: "wdio.conf.ts", content: generateWdioConf("headless-chrome", features) },
        { relativePath: "tsconfig.json", content: generateProjectTsConfig() },
        { relativePath: "package.json", content: generateProjectPackageJson(projectName, hasAllure, hasBS) },
        { relativePath: ".gitignore", content: generateGitignore() },
        { relativePath: ".env.example", content: generateEnvTemplate(hasBS) },
        { relativePath: "test/page-objects/BasePage.ts", content: generateBasePage() },
        { relativePath: "test/page-objects/ExamplePage.ts", content: generateExamplePage() },
        { relativePath: "test/specs/example.spec.ts", content: generateExampleSpec() },
        { relativePath: "test/helpers/assertions.ts", content: generateAssertionHelpers() },
        { relativePath: "test/helpers/testData.ts", content: generateTestData() }
      ];
      if (hasBS) {
        files.push({ relativePath: "browserstack.yml", content: generateBrowserStackYml(projectName) });
      }
      const written = writeFiles(baseDir, files);
      return this.success({
        projectName,
        location: baseDir,
        filesCreated: written,
        nextSteps: [
          `cd ${baseDir}`,
          "npm install",
          "npm test"
        ],
        hint: "Run `npm install` first, then `npm test` to execute the example spec. Set BASE_URL in .env to point at your app."
      });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleGeneratePageObject(args) {
    try {
      const { pageName, url, html, outputDir } = args;
      let source = html;
      if (!source && url) {
        source = await fetchHtml(url);
      }
      let elements = [];
      let fileContent;
      if (source) {
        elements = parseHtmlForElements(source);
        fileContent = generatePageObjectClass(pageName, elements);
      } else {
        fileContent = generateExamplePage().replace("ExamplePage", toPascalCase(pageName) + "Page").replace("path = '/'", `path = '/${pageName.toLowerCase()}'`);
      }
      if (outputDir) {
        const className = toPascalCase(pageName) + "Page";
        const filePath = path.join(outputDir, `${className}.ts`);
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(filePath, fileContent, "utf-8");
        return this.success({
          className: toPascalCase(pageName) + "Page",
          filePath,
          elementsFound: elements.length,
          source: fileContent
        });
      }
      return this.success({
        className: toPascalCase(pageName) + "Page",
        elementsFound: elements.length,
        source: fileContent
      });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleGenerateSpec(args) {
    try {
      const { feature, pageName = "Example", pomMethods = [], outputPath } = args;
      const source = generateSpec(feature, pageName, pomMethods);
      if (outputPath) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, source, "utf-8");
        return this.success({ filePath: outputPath, source });
      }
      return this.success({ source });
    } catch (err) {
      return this.error(err);
    }
  }
  async handleGenerateConfig(args) {
    try {
      const { variant, outputPath } = args;
      const source = generateWdioConf(variant);
      const extras = [];
      if (variant === "browserstack") {
        extras.push({ relativePath: "browserstack.yml", content: generateBrowserStackYml("my-app") });
        extras.push({ relativePath: ".env.example", content: generateEnvTemplate(true) });
      }
      if (outputPath) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, source, "utf-8");
        if (extras.length > 0) {
          writeFiles(path.dirname(outputPath), extras);
        }
        return this.success({ filePath: outputPath, variant, source });
      }
      return this.success({
        variant,
        source,
        additionalFiles: extras.map((f) => ({ path: f.relativePath, content: f.content }))
      });
    } catch (err) {
      return this.error(err);
    }
  }
};
new WdioScaffolderServer().run().catch(console.error);
