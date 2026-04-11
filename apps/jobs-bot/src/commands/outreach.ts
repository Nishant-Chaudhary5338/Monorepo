#!/usr/bin/env node
/**
 * outreach.ts — Direct outreach to EU company CTOs/Eng leads
 * Usage:
 *   pnpm outreach              → full run: research + compose + send
 *   pnpm outreach --preview    → compose messages but DON'T send (shows drafts)
 *   pnpm outreach --company "Linear"  → target a specific company only
 */
import chalk from 'chalk';
import ora from 'ora';
import { researchEUCompanies } from '../scrapers/company-researcher.js';
import { composeMessage, sendLinkedInMessage, logOutreach, alreadyOutreached } from '../agent/outreach-composer.js';
import { closeBrowser } from '../lib/browser.js';

const isPreview = process.argv.includes('--preview');
const specificCompany = (() => {
  const idx = process.argv.indexOf('--company');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// Daily limit — LinkedIn flags accounts that send too many messages
const DAILY_OUTREACH_LIMIT = 15;

async function main() {
  console.log(chalk.bold('\n📬 Direct Outreach — EU Companies\n'));
  console.log(chalk.dim(`Mode: ${isPreview ? 'PREVIEW (no send)' : 'LIVE SEND'}`));
  if (specificCompany) console.log(chalk.dim(`Targeting: ${specificCompany} only`));
  console.log();

  // 1. Research companies ────────────────────────────────────────────────────
  const spinner = ora('Researching EU companies & finding contacts...').start();
  let companies = await researchEUCompanies().catch((e) => {
    spinner.fail(`Research failed: ${e.message}`);
    return [];
  });
  spinner.succeed(`Researched ${companies.length} companies`);

  if (specificCompany) {
    companies = companies.filter((c) =>
      c.name.toLowerCase().includes(specificCompany.toLowerCase())
    );
    if (companies.length === 0) {
      console.log(chalk.yellow(`No match for "${specificCompany}"`));
      await closeBrowser();
      return;
    }
  }

  // 2. Compose + send ────────────────────────────────────────────────────────
  let sent = 0;
  let skipped = 0;
  let previewed = 0;

  for (const company of companies) {
    if (sent >= DAILY_OUTREACH_LIMIT) {
      console.log(chalk.yellow(`\nDaily outreach limit (${DAILY_OUTREACH_LIMIT}) reached.`));
      break;
    }

    console.log(chalk.bold(`\n━━ ${company.name} (${company.market})`));

    // Skip if already outreached
    if (alreadyOutreached(company.name)) {
      console.log(chalk.dim(`  Already messaged — skipping`));
      skipped++;
      continue;
    }

    // Skip if no contact found
    if (!company.contact) {
      console.log(chalk.yellow(`  No contact found — skipping (try manual search)`));
      skipped++;
      continue;
    }

    console.log(chalk.dim(`  Contact: ${company.contact.name} — ${company.contact.title}`));
    console.log(chalk.dim(`  Profile: ${company.contact.linkedinUrl}`));

    // Compose message
    const msgSpinner = ora('  Composing message with Claude...').start();
    const message = await composeMessage(company);
    msgSpinner.stop();

    // Always show the draft
    console.log(chalk.cyan(`\n  Subject: ${message.subject}`));
    console.log(chalk.white(`  ─────────────────────────────────────────`));
    for (const line of message.body.split('\n')) {
      console.log(chalk.white(`  ${line}`));
    }
    console.log(chalk.white(`  ─────────────────────────────────────────\n`));

    if (isPreview) {
      console.log(chalk.dim('  [PREVIEW] Not sending.'));
      previewed++;
      continue;
    }

    // Send
    const sendSpinner = ora('  Sending via LinkedIn...').start();
    const ok = await sendLinkedInMessage(message, company.contact.linkedinUrl);
    sendSpinner.stop();

    logOutreach(company.name, company.contact.name, ok);

    if (ok) {
      sent++;
    } else {
      skipped++;
    }

    // Human-like pause between messages — LinkedIn rate limiting
    const pauseMs = 30000 + Math.random() * 60000; // 30–90 seconds between messages
    console.log(chalk.dim(`  Waiting ${Math.round(pauseMs / 1000)}s before next message...`));
    await new Promise<void>((r) => setTimeout(r, pauseMs));
  }

  // 3. Summary ───────────────────────────────────────────────────────────────
  await closeBrowser();

  console.log(chalk.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  if (isPreview) {
    console.log(chalk.cyan(`📋 Previewed: ${previewed} messages (not sent)`));
  } else {
    console.log(chalk.green(`✓ Sent:     ${sent}`));
    console.log(chalk.yellow(`→ Skipped:  ${skipped}`));
  }
  console.log(chalk.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  if (!isPreview && sent > 0) {
    console.log(chalk.dim('Tip: Replies usually come within 24–72h. Check LinkedIn notifications.'));
    console.log(chalk.dim('Run `pnpm status` to see all outreach + applications together.\n'));
  }
}

main().catch((e) => {
  console.error(chalk.red('\nFatal:'), e);
  process.exit(1);
});
