import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SESSION_DIR = path.join(__dirname, '../../data/session');
export const SCREENSHOTS_DIR = path.join(__dirname, '../../data/screenshots');

fs.mkdirSync(SESSION_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let _browser: Browser | null = null;
let _context: BrowserContext | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!_browser) {
    _browser = await chromium.launch({
      headless: false, // must be visible — you may need to solve CAPTCHAs, LinkedIn login, etc.
      slowMo: 50,
      args: [
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--start-maximized',
      ],
    });
  }
  return _browser;
}

export async function getContext(): Promise<BrowserContext> {
  if (!_context) {
    const browser = await getBrowser();
    const sessionFile = path.join(SESSION_DIR, 'state.json');
    _context = await browser.newContext({
      storageState: fs.existsSync(sessionFile) ? sessionFile : undefined,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1440, height: 900 },
      locale: 'en-US',
      timezoneId: 'Asia/Kolkata',
    });

    await _context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
  }
  return _context;
}

export async function saveSession() {
  if (_context) {
    await _context.storageState({ path: path.join(SESSION_DIR, 'state.json') });
  }
}

export async function newPage(): Promise<Page> {
  const ctx = await getContext();
  return ctx.newPage();
}

export async function closeBrowser() {
  if (_browser) {
    await _browser.close();
    _browser = null;
    _context = null;
  }
}

/** Take a full-page screenshot and return base64 */
export async function screenshot(page: Page, name?: string): Promise<string> {
  const ts = Date.now();
  const filePath = name
    ? path.join(SCREENSHOTS_DIR, `${name}-${ts}.png`)
    : path.join(SCREENSHOTS_DIR, `shot-${ts}.png`);

  const buffer = await page.screenshot({ fullPage: false, path: filePath });
  return buffer.toString('base64');
}

/** Human-like random delay */
export const delay = (min = 300, max = 900) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));
