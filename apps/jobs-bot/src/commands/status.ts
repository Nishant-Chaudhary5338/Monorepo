#!/usr/bin/env node
/**
 * status.ts — Application tracker dashboard
 * Shows all applications with counts by status + recent 20.
 */
import chalk from 'chalk';
import { appDb } from '../lib/db.js';

const stats = appDb.stats();

console.log(chalk.bold('\n📊 Job Application Tracker\n'));
console.log(chalk.bold(`Total submitted: ${stats.total}\n`));

if (stats.byStatus.length) {
  console.log(chalk.bold('By status:'));
  for (const row of stats.byStatus) {
    const icon =
      row.status === 'applied'      ? '📤' :
      row.status === 'interviewing' ? '🎯' :
      row.status === 'offer'        ? '🎉' :
      row.status === 'rejected'     ? '✗ ' :
      '👻';
    console.log(`  ${icon}  ${row.status.padEnd(14)} ${String(row.count).padStart(4)}`);
  }
}

console.log(chalk.bold('\nRecent applications:'));
console.log(chalk.dim('─'.repeat(80)));
console.log(
  chalk.dim(
    'Date'.padEnd(12) +
    'Company'.padEnd(22) +
    'Title'.padEnd(28) +
    'CV'.padEnd(10) +
    'Status'
  )
);
console.log(chalk.dim('─'.repeat(80)));

for (const app of stats.recent) {
  const date = app.applied_at ? app.applied_at.slice(0, 10) : '?';
  const company = (app.company ?? '').slice(0, 20).padEnd(22);
  const title = (app.title ?? '').slice(0, 26).padEnd(28);
  const variant = (app.resume_variant ?? '').slice(0, 8).padEnd(10);
  const status = app.status ?? 'applied';

  const statusColor =
    status === 'interviewing' ? chalk.green :
    status === 'offer'        ? chalk.bold.green :
    status === 'rejected'     ? chalk.red :
    chalk.dim;

  console.log(
    chalk.dim(date.padEnd(12)) +
    company +
    title +
    chalk.cyan(variant) +
    statusColor(status)
  );
}

console.log(chalk.dim('─'.repeat(80)));
console.log(chalk.dim('\nTo update a status: edit data/applications.db directly or add a CLI flag later.\n'));
