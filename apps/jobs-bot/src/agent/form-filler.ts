/**
 * form-filler.ts — The heart of the bot.
 * Claude sees each page via screenshot, returns a list of actions,
 * we execute them with human-like behaviour, then repeat until submitted.
 */
import type { Page } from 'playwright';
import { analyzePageAndGetActions, type FormAction } from '../lib/claude.js';
import {
  humanClick,
  humanType,
  humanSelect,
  humanUpload,
  humanScroll,
  waitForPageSettle,
  delay,
} from '../lib/human.js';
import { newPage, saveSession, screenshot } from '../lib/browser.js';
import { appDb } from '../lib/db.js';
import type { Job } from '../scrapers/linkedin.js';
import chalk from 'chalk';

const MAX_STEPS = 25; // safety ceiling per application

export interface FillResult {
  success: boolean;
  status: 'applied' | 'skipped' | 'error';
  reason?: string;
  stepsCompleted: number;
}

/**
 * Execute a single Claude-prescribed action on the page.
 * Returns false if the action signals "done" or "skip".
 */
async function executeAction(
  page: Page,
  action: FormAction,
  resumePath: string,
  coverLetterPath: string
): Promise<'continue' | 'done' | 'skip'> {
  const sel = action.selector ?? '';

  try {
    switch (action.type) {
      case 'fill':
        if (sel && action.value !== undefined) {
          await humanType(page, sel, action.value);
        }
        break;

      case 'click':
        if (sel) {
          await humanClick(page, sel);
          await waitForPageSettle(page);
        }
        break;

      case 'select':
        if (sel && action.value !== undefined) {
          await humanSelect(page, sel, action.value);
        }
        break;

      case 'upload': {
        const fileToUpload =
          action.resume_path ??
          (sel.toLowerCase().includes('cover') ? coverLetterPath : resumePath);
        if (sel) {
          await humanUpload(page, sel, fileToUpload);
        }
        break;
      }

      case 'check':
        if (sel) {
          const isChecked = await page.isChecked(sel).catch(() => false);
          if (!isChecked) await humanClick(page, sel);
        }
        break;

      case 'scroll':
        await humanScroll(page, 500);
        break;

      case 'wait':
        await delay(1500, 3000);
        break;

      case 'done':
        return 'done';

      case 'skip':
        console.log(chalk.yellow(`  ↳ skip: ${action.description ?? 'no reason'}`));
        return 'skip';

      default:
        console.warn(`  ↳ unknown action type: ${(action as FormAction).type}`);
    }
  } catch (err) {
    // If selector not found, log and continue — Claude may have given a stale selector
    console.warn(chalk.dim(`  ↳ action failed (${action.type} "${sel}"): ${(err as Error).message}`));
  }

  return 'continue';
}

/**
 * Main entry: fill and submit a full job application.
 * Opens the job URL, loops through screenshots → Claude → actions until done.
 */
export async function fillApplication(
  job: Job,
  resumePath: string,
  coverLetterPath: string,
  resumeVariant: string
): Promise<FillResult> {
  const page = await newPage();
  const stepHistory: string[] = [];
  let stepsCompleted = 0;

  console.log(chalk.cyan(`\n▶ Applying: ${job.title} @ ${job.company}`));
  console.log(chalk.dim(`  URL: ${job.applyUrl}`));

  try {
    await page.goto(job.applyUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPageSettle(page);

    for (let step = 0; step < MAX_STEPS; step++) {
      stepsCompleted = step + 1;
      const url = page.url();
      console.log(chalk.dim(`  Step ${step + 1}: ${url.slice(0, 80)}...`));

      const analysis = await analyzePageAndGetActions(page, {
        profile: await import('../profile/profile.json', { assert: { type: 'json' } }).then(
          (m) => m.default as Record<string, unknown>
        ),
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        resumePath,
        coverLetterPath,
        stepHistory,
      });

      stepHistory.push(`${step + 1}: ${analysis.pageType} — ${analysis.notes.slice(0, 60)}`);
      console.log(chalk.dim(`  → ${analysis.pageType}: ${analysis.notes.slice(0, 80)}`));

      if (analysis.isComplete) {
        console.log(chalk.green(`  ✓ Application submitted!`));
        await saveSession();
        await page.close();

        appDb.insert({
          job_id: job.jobId,
          title: job.title,
          company: job.company,
          location: job.location,
          job_url: job.applyUrl,
          platform: job.platform,
          resume_variant: resumeVariant,
          status: 'applied',
        });

        return { success: true, status: 'applied', stepsCompleted };
      }

      for (const action of analysis.actions) {
        const result = await executeAction(page, action, resumePath, coverLetterPath);
        if (result === 'done') {
          console.log(chalk.green(`  ✓ Done signal received`));
          await saveSession();
          await page.close();

          appDb.insert({
            job_id: job.jobId,
            title: job.title,
            company: job.company,
            location: job.location,
            job_url: job.applyUrl,
            platform: job.platform,
            resume_variant: resumeVariant,
            status: 'applied',
          });

          return { success: true, status: 'applied', stepsCompleted };
        }

        if (result === 'skip') {
          await page.close();
          appDb.skip(job.jobId, analysis.notes);
          return { success: false, status: 'skipped', reason: analysis.notes, stepsCompleted };
        }
      }

      // After all actions, small pause before re-screenshotting
      await delay(800, 1500);
    }

    // Exceeded max steps
    await screenshot(page, `maxsteps-${job.company}`);
    await page.close();
    appDb.skip(job.jobId, `Exceeded ${MAX_STEPS} steps`);
    return { success: false, status: 'error', reason: `Exceeded ${MAX_STEPS} steps`, stepsCompleted };
  } catch (err) {
    const msg = (err as Error).message;
    console.error(chalk.red(`  ✗ Error: ${msg}`));
    try { await page.close(); } catch { /* ignore */ }
    appDb.skip(job.jobId, `Error: ${msg.slice(0, 100)}`);
    return { success: false, status: 'error', reason: msg, stepsCompleted };
  }
}
