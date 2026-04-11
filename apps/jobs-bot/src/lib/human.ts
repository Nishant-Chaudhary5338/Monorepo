/**
 * human.ts — Anti-bot behaviour layer
 * All Playwright interactions must go through these helpers.
 * Never call page.click() / page.fill() / page.type() directly.
 */
import type { Page } from 'playwright';

// ─── Timing helpers ──────────────────────────────────────────────────────────

const jitter = (base: number, pct = 0.2) =>
  base + (Math.random() * 2 - 1) * base * pct;

export const delay = (min = 300, max = 900) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

// ─── Bezier mouse movement ────────────────────────────────────────────────────

function bezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const u = 1 - t;
  return [
    u ** 3 * p0[0] + 3 * u ** 2 * t * p1[0] + 3 * u * t ** 2 * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u ** 2 * t * p1[1] + 3 * u * t ** 2 * p2[1] + t ** 3 * p3[1],
  ];
}

/**
 * Move mouse from current position to (x, y) along a bezier curve.
 * Looks like a real human hand — not a teleport.
 */
export async function moveMouse(page: Page, x: number, y: number) {
  const current = await page.evaluate(() => ({ x: window.screenX, y: window.screenY }));
  const from: [number, number] = [current.x % 1440, current.y % 900];
  const to: [number, number] = [x, y];

  // Random control points for bezier curve
  const cp1: [number, number] = [
    from[0] + (Math.random() - 0.5) * 200,
    from[1] + (Math.random() - 0.5) * 200,
  ];
  const cp2: [number, number] = [
    to[0] + (Math.random() - 0.5) * 200,
    to[1] + (Math.random() - 0.5) * 200,
  ];

  const steps = Math.floor(jitter(12, 0.3));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [px, py] = bezierPoint(t, from, to, cp1, cp2);
    await page.mouse.move(px, py);
    await delay(10, 30);
  }
}

// ─── Human click ─────────────────────────────────────────────────────────────

/**
 * Move mouse to element center via bezier curve, hover briefly, then click.
 */
export async function humanClick(page: Page, selector: string) {
  const el = await page.$(selector);
  if (!el) throw new Error(`humanClick: element not found — ${selector}`);

  const box = await el.boundingBox();
  if (!box) throw new Error(`humanClick: element has no bounding box — ${selector}`);

  const x = box.x + box.width * (0.3 + Math.random() * 0.4);
  const y = box.y + box.height * (0.3 + Math.random() * 0.4);

  await moveMouse(page, x, y);
  await delay(jitter(300, 0.3), jitter(600, 0.2));
  await page.mouse.click(x, y);
  await delay(200, 500);
}

// ─── Human type ──────────────────────────────────────────────────────────────

/**
 * Click field then type char-by-char with realistic cadence.
 * Occasionally makes a typo and corrects it.
 */
export async function humanType(page: Page, selector: string, text: string) {
  await humanClick(page, selector);
  await page.fill(selector, ''); // clear first
  await delay(100, 300);

  for (let i = 0; i < text.length; i++) {
    // ~5% chance of a typo (only for letters)
    if (text[i].match(/[a-z]/i) && Math.random() < 0.05 && i < text.length - 1) {
      const wrongChar = String.fromCharCode(text.charCodeAt(i) + (Math.random() > 0.5 ? 1 : -1));
      await page.keyboard.type(wrongChar, { delay: jitter(60, 0.4) });
      await delay(80, 200);
      await page.keyboard.press('Backspace');
      await delay(60, 180);
    }

    await page.keyboard.type(text[i], { delay: jitter(70, 0.5) });

    // Occasional micro-pause between words
    if (text[i] === ' ' && Math.random() < 0.3) {
      await delay(100, 300);
    }
  }

  await delay(200, 500);
}

// ─── Human select ────────────────────────────────────────────────────────────

export async function humanSelect(page: Page, selector: string, value: string) {
  await humanClick(page, selector);
  await delay(200, 400);
  await page.selectOption(selector, { label: value }).catch(async () => {
    // fallback: try matching by value
    await page.selectOption(selector, { value });
  });
  await delay(300, 600);
}

// ─── Human scroll ────────────────────────────────────────────────────────────

/**
 * Scroll down in small human-like steps.
 */
export async function humanScroll(page: Page, totalPx = 600) {
  const stepSize = 80 + Math.random() * 120;
  const steps = Math.ceil(totalPx / stepSize);

  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepSize);
    await delay(jitter(90, 0.3), jitter(180, 0.3));
  }
  await delay(300, 700);
}

// ─── Human upload ────────────────────────────────────────────────────────────

export async function humanUpload(page: Page, selector: string, filePath: string) {
  // For file inputs, we can't "click" through bezier — directly set files
  await page.setInputFiles(selector, filePath);
  await delay(500, 1200);
}

// ─── Wait for navigation ─────────────────────────────────────────────────────

export async function waitForPageSettle(page: Page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 12000 });
  } catch {
    // networkidle can timeout on heavy pages — that's fine
  }
  await delay(jitter(700, 0.3), jitter(1400, 0.2));
}
