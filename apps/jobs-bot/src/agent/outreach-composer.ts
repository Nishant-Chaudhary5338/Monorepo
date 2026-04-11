/**
 * outreach-composer.ts
 * Claude writes a personalised LinkedIn InMail / cold message per company.
 * Then Playwright sends it via LinkedIn message flow.
 *
 * Message strategy:
 * - 3 short paragraphs, no fluff
 * - Para 1: specific hook from THEIR work/product (not generic praise)
 * - Para 2: one concrete thing Nishant built that is directly relevant
 * - Para 3: soft ask — "open to a 20-min chat?" not "please hire me"
 */
import Anthropic from '@anthropic-ai/sdk';
import type { Page } from 'playwright';
import type { CompanyContext } from '../scrapers/company-researcher.js';
import { newPage, saveSession, screenshot } from '../lib/browser.js';
import { humanClick, humanType, waitForPageSettle, delay } from '../lib/human.js';
import { appDb } from '../lib/db.js';
import chalk from 'chalk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface OutreachMessage {
  subject: string;  // for InMail subject line
  body: string;     // the message body
  recipientName: string;
  company: string;
}

/**
 * Use Claude to compose a tailored, non-cringe outreach message.
 * The hook is specific to the company — Claude reads their about/blog text.
 */
export async function composeMessage(ctx: CompanyContext): Promise<OutreachMessage> {
  const recipientName = ctx.contact?.name ?? 'there';
  const recipientTitle = ctx.contact?.title ?? 'Engineering Lead';

  const prompt = `Write a LinkedIn message from Nishant (a developer) to ${recipientName} at ${ctx.company}.

Nishant is a real person dashing off a message between tasks. It should read exactly like that — not a pitch, not a cover letter, not a template.

HARD RULES:
- Under 80 words. Shorter is better.
- No em dashes, no bullet points, no bold, no "I hope", no "reach out", no "leverage", no "passionate"
- No listing achievements like a resume. ONE specific thing max, mentioned casually.
- The opening line must reference something real and specific about ${ctx.company} — not "I love your product" but an actual observation (use the context below). If you can't find anything specific, just skip it and open differently.
- The ask is vague and low-pressure. Not "20-min chat". Something like "would you be up for a quick call?" or "let me know if you're ever looking"
- Feels like a text message from a developer, not a LinkedIn template
- No sign-off phrase. Just end with "— Nishant" on a new line
- Subject line: 4–5 words, lowercase, no punctuation, plain

BAD example (do NOT write like this):
"Hi Alex, Linear's obsession with feel — the way interactions snap — is something I've been studying closely. At Samsung I built @repo/dashcraft: a headless dashboard library with drag-drop and dynamic resizing. Open to a 20-min chat if you're hiring?"

GOOD example (write like this):
"hey Alex, been using Linear for a while — the way the editor feels is something I keep referencing when I'm building UI at Samsung.
I work on React/TS stuff, recently built a dashboard library our whole team ended up adopting. Figured I'd reach out in case you're growing the frontend team.
— Nishant"

Company context:
${ctx.aboutText.slice(0, 500)}
${ctx.recentNews ? `Recent: ${ctx.recentNews.slice(0, 250)}` : ''}
What makes this company relevant to Nishant: ${ctx.why}

Nishant's background (pick ONE thing that's most relevant, mention it naturally):
- At Samsung: built a dashboard library the whole team adopted, also set up an AI dev system that cut team onboarding from a day to an hour
- Before Samsung: built B2B platform serving 25k users, LMS, SSO integrations
- Side projects: 3D portfolio with Three.js/GSAP, AI UI builder, big monorepo setup
- Stack: React, TypeScript, Next.js, Vite, Tailwind

Return JSON only — no markdown:
{
  "subject": "...",
  "body": "..."
}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean) as { subject: string; body: string };
    return { ...parsed, recipientName, company: ctx.company };
  } catch {
    // Fallback message if parse fails
    return {
      subject: `frontend role at ${ctx.company}`,
      body: `hey ${recipientName},\n\nsaw ${ctx.company} and figured I'd reach out directly. I do frontend at Samsung right now, mostly React/TS, recently built a dashboard library our whole team ended up using.\n\nlet me know if you're ever looking for someone\n— Nishant`,
      recipientName,
      company: ctx.company,
    };
  }
}

/**
 * Send a LinkedIn InMail or message to the contact.
 * Opens their profile, clicks Message, fills subject + body, sends.
 */
export async function sendLinkedInMessage(
  msg: OutreachMessage,
  profileUrl: string
): Promise<boolean> {
  const page = await newPage();

  try {
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await waitForPageSettle(page);

    // Click "Message" or "InMail" button on their profile
    const msgBtn = page.locator(
      'button:has-text("Message"), button:has-text("InMail"), a:has-text("Message")'
    ).first();
    const hasMsgBtn = await msgBtn.isVisible({ timeout: 4000 }).catch(() => false);

    if (!hasMsgBtn) {
      console.log(chalk.yellow(`  ⚠ No message button for ${msg.recipientName} at ${msg.company}`));
      await page.close();
      return false;
    }

    await humanClick(page, 'button:has-text("Message"), button:has-text("InMail"), a:has-text("Message")');
    await waitForPageSettle(page);
    await delay(800, 1500);

    // Fill subject (InMail has subject, regular message may not)
    const subjectField = page.locator('[placeholder*="Subject"], [aria-label*="Subject"], #subject').first();
    const hasSubject = await subjectField.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasSubject) {
      await humanType(page, '[placeholder*="Subject"], [aria-label*="Subject"], #subject', msg.subject);
    }

    // Fill message body
    const bodyField = page.locator(
      '[placeholder*="Write a message"], [aria-label*="Write a message"], .msg-form__contenteditable, [contenteditable="true"]'
    ).first();
    const hasBody = await bodyField.isVisible({ timeout: 3000 }).catch(() => false);

    if (!hasBody) {
      console.log(chalk.yellow(`  ⚠ Could not find message body field for ${msg.recipientName}`));
      await screenshot(page, `outreach-fail-${msg.company}`);
      await page.close();
      return false;
    }

    // Type message body
    await humanClick(
      page,
      '[placeholder*="Write a message"], [aria-label*="Write a message"], .msg-form__contenteditable, [contenteditable="true"]'
    );
    await delay(400, 700);

    // Use keyboard for contenteditable fields
    for (const line of msg.body.split('\n')) {
      await page.keyboard.type(line, { delay: 50 + Math.random() * 40 });
      await page.keyboard.press('Enter');
      await delay(100, 200);
    }

    await delay(1000, 2000);

    // Click Send
    const sendBtn = page.locator(
      'button[type="submit"]:has-text("Send"), button:has-text("Send message"), button:has-text("Send InMail")'
    ).first();
    const hasSend = await sendBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (!hasSend) {
      console.log(chalk.yellow(`  ⚠ Send button not found — taking screenshot`));
      await screenshot(page, `outreach-nosend-${msg.company}`);
      await page.close();
      return false;
    }

    await humanClick(
      page,
      'button[type="submit"]:has-text("Send"), button:has-text("Send message"), button:has-text("Send InMail")'
    );
    await waitForPageSettle(page);
    await delay(1000, 2000);

    // Confirm send
    const confirmationVisible = await page.locator(
      '[aria-label*="sent"], .msg-overlay-bubble-header:has-text("sent"), .artdeco-toast:has-text("sent")'
    ).isVisible({ timeout: 4000 }).catch(() => false);

    await saveSession();
    await page.close();

    if (confirmationVisible) {
      console.log(chalk.green(`  ✓ Message sent to ${msg.recipientName} at ${msg.company}`));
    } else {
      console.log(chalk.yellow(`  ⚠ Sent (no confirmation detected) — ${msg.company}`));
    }

    return true;
  } catch (err) {
    console.error(chalk.red(`  ✗ Failed to message ${msg.recipientName}: ${(err as Error).message}`));
    try { await page.close(); } catch { /* ignore */ }
    return false;
  }
}

/**
 * Log outreach to the DB (reuse skipped table with platform='outreach')
 * so we never double-message the same person.
 */
export function logOutreach(company: string, contactName: string, sent: boolean) {
  const jobId = `outreach-${company.toLowerCase().replace(/\s+/g, '-')}`;
  if (sent) {
    appDb.insert({
      job_id: jobId,
      title: `Direct Outreach → ${contactName}`,
      company,
      platform: 'outreach',
      status: 'applied',
    });
  } else {
    appDb.skip(jobId, 'outreach failed or no message button');
  }
}

export function alreadyOutreached(company: string): boolean {
  const jobId = `outreach-${company.toLowerCase().replace(/\s+/g, '-')}`;
  return appDb.alreadyApplied(jobId);
}
