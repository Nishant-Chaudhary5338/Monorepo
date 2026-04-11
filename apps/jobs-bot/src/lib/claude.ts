import Anthropic from '@anthropic-ai/sdk';
import type { Page } from 'playwright';
import { screenshot } from './browser.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-haiku-4-5-20251001';

export interface FormAction {
  type: 'fill' | 'click' | 'select' | 'upload' | 'check' | 'scroll' | 'wait' | 'done' | 'skip';
  selector?: string;       // CSS selector or aria label
  value?: string;          // text to type or option value
  description?: string;    // human-readable reason
  resume_path?: string;    // for upload actions
}

export interface PageAnalysis {
  actions: FormAction[];
  pageType: 'form' | 'login' | 'signup' | 'confirmation' | 'review' | 'unknown';
  isComplete: boolean;     // true if application is fully submitted
  notes: string;
}

/**
 * Core vision loop: screenshot → Claude → list of Playwright actions
 * Claude sees the page and tells us exactly what to do next
 */
export async function analyzePageAndGetActions(
  page: Page,
  context: {
    profile: Record<string, unknown>;
    jobTitle: string;
    company: string;
    jobDescription: string;
    resumePath: string;
    coverLetterPath: string;
    stepHistory: string[];
  }
): Promise<PageAnalysis> {
  const b64 = await screenshot(page);
  const url = page.url();

  const systemPrompt = `You are an expert job application assistant. You see a screenshot of a job application form or portal.
Your job: return a precise JSON of actions to fill or interact with what you see.

Available action types:
- fill: type text into input/textarea (provide CSS selector and value)
- click: click a button/link/checkbox (provide selector)
- select: choose dropdown option (provide selector and value = option text)
- upload: upload a file (provide selector and resume_path)
- check: check/uncheck a checkbox (provide selector)
- scroll: scroll down to reveal more content
- wait: wait for page to settle (no selector needed)
- done: application fully submitted, we are finished
- skip: this page/job cannot be processed (explain in description)

Rules:
- Use aria-label, placeholder, name, id, or visible text to form selectors
- For file uploads always use the resumePath from context
- If a CAPTCHA is present, use skip with description "CAPTCHA detected"
- If login is required and no session exists, return login actions first
- Never skip required fields — use profile data to fill everything
- For unknown fields, use best judgment from profile context
- Return ONLY valid JSON, no markdown

Profile summary: ${JSON.stringify(context.profile, null, 2)}`;

  const userPrompt = `Current URL: ${url}
Job: ${context.jobTitle} at ${context.company}
Step history: ${context.stepHistory.slice(-5).join(' → ')}

Resume to upload: ${context.resumePath}
Cover letter to upload: ${context.coverLetterPath}

Job description excerpt:
${context.jobDescription.slice(0, 800)}

Analyze the screenshot and return JSON in this exact format:
{
  "pageType": "form|login|signup|confirmation|review|unknown",
  "isComplete": false,
  "notes": "what you see on this page",
  "actions": [
    { "type": "fill", "selector": "#firstName", "value": "Nishant", "description": "first name field" },
    ...
  ]
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: b64 },
          },
          { type: 'text', text: userPrompt },
        ],
      },
    ],
    system: systemPrompt,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    // strip markdown fences if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean) as PageAnalysis;
  } catch {
    console.error('Claude response parse error:', text.slice(0, 300));
    return {
      actions: [{ type: 'wait', description: 'Parse error — waiting' }],
      pageType: 'unknown',
      isComplete: false,
      notes: 'Failed to parse Claude response',
    };
  }
}

/**
 * Ask Claude to evaluate a job posting and decide:
 * - Should we apply?
 * - Which resume variant fits best?
 * - Any custom tailoring needed?
 */
export async function evaluateJob(job: {
  title: string;
  company: string;
  location: string;
  description: string;
}): Promise<{
  shouldApply: boolean;
  reason: string;
  resumeVariant: 'faang' | 'hybrid' | 'ats' | 'general';
  tailoringNotes: string;
}> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are a career advisor for Nishant Chaudhary, Senior Frontend Engineer, 4+ years experience.

TOP SKILLS (highest match weight): React.js, Vite, Next.js, TypeScript, pnpm Workspaces, Turborepo, Monorepo Architecture, Custom MCP Tools, Frontend Automation, AI-driven Developer Tooling.

Also strong: Tailwind CSS, Redux Toolkit, Zustand, GraphQL, REST APIs, AWS, Docker, CI/CD, Playwright, Storybook, Three.js, GSAP, Node.js, HLS.js, Web Workers.

Apply if: the job mentions ANY of the top skills, OR is a senior frontend/React role in Europe/remote. Be generous — if there's a reasonable match, apply.
Skip only if: requires 8+ years, explicitly backend-only, requires specific domain expertise he lacks (e.g. Rust, iOS native, ML), or is a junior role.

Job: ${job.title} at ${job.company} (${job.location})
Description:
${job.description.slice(0, 1500)}

Available resume variants:
- "faang": metrics-heavy, minimal prose, for FAANG/US top-tier startups
- "hybrid": balanced narrative + metrics, for European companies/startups
- "ats": keyword-rich, detailed bullets, for Indian companies and ATS portals
- "general": comprehensive with projects section, for general applications

Respond ONLY with valid JSON:
{
  "shouldApply": true,
  "reason": "strong React/TS match, 4yr requirement aligns",
  "resumeVariant": "hybrid",
  "tailoringNotes": "emphasize HLS video work and design systems"
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { shouldApply: true, reason: 'auto', resumeVariant: 'general', tailoringNotes: '' };
  }
}

/** Generate a short tailored cover letter for a specific role */
export async function generateCoverLetter(job: {
  title: string;
  company: string;
  description: string;
  tailoringNotes: string;
}): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Write a short, punchy cover letter (3 paragraphs, no fluff) for Nishant Chaudhary applying to ${job.title} at ${job.company}.

Nishant's background: Senior Frontend Engineer, 4+ years, Samsung Electronics (current), Safex Chemicals, DevsLane. Built AI dev systems with Turborepo + MCP tools (60-70% workflow automation), headless dashboard library (@repo/dashcraft), HLS video player with Web Workers (LCP -30%), TVPlus TestSuite. React, TypeScript, Vite, Next.js, Tailwind, Redux, AWS, Docker, CI/CD.

Job description excerpt:
${job.description.slice(0, 800)}

Tailoring notes: ${job.tailoringNotes}

Write ONLY the letter body (no subject, no address). Start with "Dear Hiring Team," and end with "Nishant Chaudhary".`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
