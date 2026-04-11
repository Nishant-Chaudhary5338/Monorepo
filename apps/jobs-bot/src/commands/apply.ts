#!/usr/bin/env node
/**
 * apply.ts — Main orchestrator CLI
 * Usage:
 *   pnpm apply              → full run: find jobs + apply
 *   pnpm apply --dry-run    → find + evaluate but DO NOT submit
 *   pnpm apply --login      → open browser for LinkedIn login only
 */
import chalk from 'chalk';
import ora from 'ora';
import { discoverAllJobs } from '../scrapers/linkedin.js';
import { discoverWellfoundJobs } from '../scrapers/wellfound.js';
import { evaluateJob } from '../lib/claude.js';
import { chooseVariant, prepareResume, prepareCoverLetter } from '../agent/cv-generator.js';
import { fillApplication } from '../agent/form-filler.js';
import { appDb } from '../lib/db.js';
import { getBrowser, getContext, saveSession, closeBrowser } from '../lib/browser.js';

const isDryRun = process.argv.includes('--dry-run');
const isLoginOnly = process.argv.includes('--login');

const DAILY_APPLY_LIMIT = 40; // max applications per run

async function loginFlow() {
  console.log(chalk.cyan('\n🔐 Opening browser for LinkedIn login...'));
  const browser = await getBrowser();
  const ctx = await getContext();
  const page = await ctx.newPage();
  await page.goto('https://www.linkedin.com/login');
  console.log(chalk.yellow('   Log in manually, then press Enter here to save session.'));
  await new Promise<void>((r) => process.stdin.once('data', () => r()));
  await saveSession();
  await browser.close();
  console.log(chalk.green('   Session saved to data/session/state.json'));
  process.exit(0);
}

async function main() {
  console.log(chalk.bold('\n🤖 Jobs Bot — starting run'));
  console.log(chalk.dim(`   Mode: ${isDryRun ? 'DRY RUN (no submissions)' : 'LIVE'}`));
  console.log(chalk.dim(`   Daily limit: ${DAILY_APPLY_LIMIT}`));
  console.log(chalk.dim(`   Today applied so far: ${appDb.todayCount()}\n`));

  if (isLoginOnly) {
    await loginFlow();
    return;
  }

  // 1. Discover jobs — LinkedIn + Wellfound in sequence ──────────────────────
  const spinner = ora('Searching LinkedIn + Wellfound for new jobs...').start();
  let jobs = [];
  try {
    const [linkedinJobs, wellfoundJobs] = await Promise.allSettled([
      discoverAllJobs(),
      discoverWellfoundJobs(),
    ]);

    const liJobs = linkedinJobs.status === 'fulfilled' ? linkedinJobs.value : [];
    const wfJobs = wellfoundJobs.status === 'fulfilled' ? wellfoundJobs.value : [];

    // Deduplicate by jobId
    const seen = new Set<string>();
    for (const j of [...liJobs, ...wfJobs]) {
      if (!seen.has(j.jobId)) { seen.add(j.jobId); jobs.push(j); }
    }

    spinner.succeed(`Found ${jobs.length} new jobs (LinkedIn: ${liJobs.length}, Wellfound: ${wfJobs.length})`);
  } catch (e) {
    spinner.fail(`Job discovery failed: ${(e as Error).message}`);
    await closeBrowser();
    process.exit(1);
  }

  if (jobs.length === 0) {
    console.log(chalk.yellow('\nNo new jobs found. All caught up!'));
    await closeBrowser();
    return;
  }

  // 2. Evaluate + apply ──────────────────────────────────────────────────────
  let applied = 0;
  let skipped = 0;
  let errors = 0;
  const alreadyAppliedToday = appDb.todayCount();
  const remainingSlots = DAILY_APPLY_LIMIT - alreadyAppliedToday;

  if (remainingSlots <= 0) {
    console.log(chalk.yellow(`\nDaily limit (${DAILY_APPLY_LIMIT}) already reached. Try again tomorrow.`));
    await closeBrowser();
    return;
  }

  for (const job of jobs) {
    if (applied >= remainingSlots) {
      console.log(chalk.yellow(`\nDaily limit reached (${DAILY_APPLY_LIMIT}). Stopping.`));
      break;
    }

    console.log(chalk.bold(`\n━━ ${job.title} @ ${job.company} (${job.location})`));

    // Ask Claude: should we apply? what variant?
    const evalSpinner = ora('Evaluating job with Claude...').start();
    const evaluation = await evaluateJob({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
    });
    evalSpinner.stop();

    if (!evaluation.shouldApply) {
      console.log(chalk.dim(`  ✗ Skipping — ${evaluation.reason}`));
      appDb.skip(job.jobId, evaluation.reason);
      skipped++;
      continue;
    }

    console.log(chalk.dim(`  ✓ Applying — ${evaluation.reason}`));
    console.log(chalk.dim(`  CV variant: ${evaluation.resumeVariant} | ${evaluation.tailoringNotes}`));

    // Choose and prepare CV
    const variant = chooseVariant(evaluation.resumeVariant, job.location);
    const resumePath = await prepareResume(variant);
    const coverLetterPath = await prepareCoverLetter({
      title: job.title,
      company: job.company,
      description: job.description,
      tailoringNotes: evaluation.tailoringNotes,
    });

    if (isDryRun) {
      console.log(chalk.cyan(`  [DRY RUN] Would apply with variant: ${variant}`));
      console.log(chalk.cyan(`  [DRY RUN] Resume: ${resumePath}`));
      console.log(chalk.cyan(`  [DRY RUN] Cover letter: ${coverLetterPath}`));
      applied++;
      continue;
    }

    // Actually apply
    const result = await fillApplication(job, resumePath, coverLetterPath, variant);

    if (result.status === 'applied') applied++;
    else if (result.status === 'skipped') skipped++;
    else errors++;

    // Brief pause between applications
    await new Promise<void>((r) => setTimeout(r, 2000 + Math.random() * 3000));
  }

  // 3. Summary ───────────────────────────────────────────────────────────────
  await closeBrowser();

  console.log(chalk.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.green(`✓ Applied:  ${applied}`));
  console.log(chalk.yellow(`→ Skipped:  ${skipped}`));
  console.log(chalk.red(`✗ Errors:   ${errors}`));
  console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  const stats = appDb.stats();
  console.log(chalk.dim(`\nAll-time: ${stats.total} applications`));
  console.log(chalk.dim('Run `pnpm status` for full breakdown.\n'));
}

main().catch((e) => {
  console.error(chalk.red('\nFatal error:'), e);
  process.exit(1);
});
