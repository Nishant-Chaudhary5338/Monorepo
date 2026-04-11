/**
 * wellfound.ts — Scrape EU startup jobs from Wellfound (AngelList Talent)
 * Best board for EU remote startups. No login required for browsing.
 * Targets: /role/l/frontend-engineer/europe and related paths.
 */
import { newPage } from '../lib/browser.js';
import { humanScroll, waitForPageSettle, delay } from '../lib/human.js';
import { appDb } from '../lib/db.js';
import type { Job } from './linkedin.js';
import chalk from 'chalk';

// Wellfound search URLs to hit — EU startups, all sizes, all stages
const WELLFOUND_SEARCHES = [
  // Role × location combos
  'https://wellfound.com/role/l/frontend-engineer/europe',
  'https://wellfound.com/role/l/react-developer/europe',
  'https://wellfound.com/role/l/frontend-developer/europe',
  'https://wellfound.com/role/l/software-engineer/europe?skills=React',
  'https://wellfound.com/role/l/frontend-engineer/united-kingdom',
  'https://wellfound.com/role/l/frontend-engineer/germany',
  'https://wellfound.com/role/l/frontend-engineer/netherlands',
  'https://wellfound.com/role/l/frontend-engineer/portugal',
  'https://wellfound.com/role/l/frontend-engineer/spain',
  // Broader remote
  'https://wellfound.com/role/r/react-developer',
  'https://wellfound.com/role/r/frontend-engineer',
];

interface WellfoundListing {
  title: string;
  company: string;
  location: string;
  url: string;
  jobId: string;
}

async function scrapeWellfoundPage(
  page: import('playwright').Page,
  url: string
): Promise<WellfoundListing[]> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await waitForPageSettle(page);

  // Scroll to load more listings (Wellfound lazy-loads)
  for (let i = 0; i < 5; i++) {
    await humanScroll(page, 700);
    await delay(600, 1000);
  }

  const listings: WellfoundListing[] = [];

  // Wellfound job card selectors (as of 2025–2026)
  const cards = await page.locator('[data-test="StartupResult"], .styles_component__component___7GEIC, [class*="JobListingCard"], [class*="jobCard"]').all();

  for (const card of cards.slice(0, 40)) {
    try {
      // Title
      const titleEl = card.locator('h2, h3, [class*="title"], [class*="role"]').first();
      const title = await titleEl.innerText({ timeout: 2000 }).catch(() => '');

      // Company
      const companyEl = card.locator('[class*="company"], [class*="startup"], h4').first();
      const company = await companyEl.innerText({ timeout: 2000 }).catch(() => '');

      // Location
      const locEl = card.locator('[class*="location"], [class*="remote"]').first();
      const location = await locEl.innerText({ timeout: 2000 }).catch(() => 'Europe Remote');

      // URL
      const linkEl = card.locator('a[href*="/jobs/"], a[href*="/l/"]').first();
      const href = await linkEl.getAttribute('href').catch(() => '');
      if (!href || !title) continue;

      const fullUrl = href.startsWith('http') ? href : `https://wellfound.com${href}`;
      const jobId = `wf-${Buffer.from(fullUrl).toString('base64').slice(0, 16)}`;

      listings.push({ title: title.trim(), company: company.trim(), location: location.trim(), url: fullUrl, jobId });
    } catch { /* skip malformed card */ }
  }

  return listings;
}

async function getJobDetails(
  page: import('playwright').Page,
  listing: WellfoundListing
): Promise<Job | null> {
  try {
    await page.goto(listing.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await waitForPageSettle(page);

    // Description
    const descEl = page.locator('[class*="description"], [class*="jobDescription"], .prose, article').first();
    const description = await descEl.innerText({ timeout: 4000 }).catch(() => '');

    // Apply URL — look for "Apply" button that may go to company site
    const applyBtn = page.locator('a:has-text("Apply"), button:has-text("Apply")').first();
    const applyHref = await applyBtn.getAttribute('href').catch(() => null);
    const applyUrl = applyHref ?? listing.url;

    return {
      jobId: listing.jobId,
      title: listing.title,
      company: listing.company,
      location: listing.location,
      applyUrl,
      description,
      platform: 'wellfound',
    };
  } catch {
    return null;
  }
}

/**
 * Scrape all Wellfound EU searches and return new jobs not yet applied to.
 */
export async function discoverWellfoundJobs(): Promise<Job[]> {
  console.log(chalk.cyan('\n🔍 Searching Wellfound EU startups...'));
  const page = await newPage();
  const seen = new Set<string>();
  const allListings: WellfoundListing[] = [];

  for (const searchUrl of WELLFOUND_SEARCHES) {
    try {
      console.log(chalk.dim(`  → ${searchUrl}`));
      const listings = await scrapeWellfoundPage(page, searchUrl);
      for (const l of listings) {
        if (!seen.has(l.jobId)) {
          seen.add(l.jobId);
          allListings.push(l);
        }
      }
      await delay(2000, 4000);
    } catch (e) {
      console.warn(chalk.dim(`  Wellfound page error: ${(e as Error).message}`));
    }
  }

  console.log(chalk.dim(`  Found ${allListings.length} total listings, fetching details...`));

  const jobs: Job[] = [];
  for (const listing of allListings) {
    if (appDb.alreadyApplied(listing.jobId)) continue;

    const job = await getJobDetails(page, listing);
    if (job) {
      jobs.push(job);
      console.log(chalk.green(`  + ${job.title} @ ${job.company} (${job.location})`));
    }
    await delay(1000, 2500);
  }

  await page.close();
  console.log(chalk.cyan(`  Wellfound: ${jobs.length} new jobs`));
  return jobs;
}
