/**
 * linkedin.ts — Job discovery via LinkedIn Jobs search.
 * Finds listings matching our keywords, extracts job details + apply URL.
 * No Easy Apply — we always follow the external application link.
 */
import { newPage, saveSession } from '../lib/browser.js';
import { humanClick, humanType, humanScroll, waitForPageSettle, delay } from '../lib/human.js';
import { appDb } from '../lib/db.js';
import chalk from 'chalk';

export interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  description: string;
  platform: string;
  postedAt?: string;
}

export interface SearchQuery {
  keywords: string;
  location: string;
  /** LinkedIn date filter: r86400 = 24h, r604800 = 7d */
  dateFilter?: 'r86400' | 'r604800';
}

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// EU countries + cities to hit individually (LinkedIn gives better results per-city than "Europe")
const EU_LOCATIONS = [
  'Europe',
  'Germany',
  'Netherlands',
  'United Kingdom',
  'Berlin',
  'Amsterdam',
  'London',
  'Portugal',
  'Spain',
  'France',
  'Sweden',
  'Denmark',
  'Poland',
  'Czech Republic',
  'Ireland',
  'Austria',
  'Switzerland',
  'Italy',
  'Romania',
  'Finland',
  'Norway',
];

const EU_KEYWORDS = [
  'Senior Frontend Engineer',
  'Senior Frontend Developer',
  'Senior React Engineer',
  'Senior React Developer',
  'Frontend Engineer',
  'Frontend Developer',
  'React Engineer',
  'React Developer',
  'UI Engineer',
  'JavaScript Engineer',
  'TypeScript React Developer',
  'Next.js Developer',
  'Frontend Architect',
  'Design Systems Engineer',
  'Product Engineer Frontend',
];

function loadSearchQueries(): SearchQuery[] {
  // Build EU matrix: top keywords × EU locations (24h filter)
  const euQueries: SearchQuery[] = [];
  for (const kw of EU_KEYWORDS) {
    for (const loc of EU_LOCATIONS) {
      euQueries.push({ keywords: kw, location: loc, dateFilter: 'r86400' });
    }
  }

  // India queries
  const indiaQueries: SearchQuery[] = [
    { keywords: 'Frontend Developer',     location: 'India',         dateFilter: 'r86400' },
    { keywords: 'Senior Frontend Engineer',location: 'India',        dateFilter: 'r86400' },
    { keywords: 'React Developer',        location: 'India',         dateFilter: 'r86400' },
    { keywords: 'Frontend Engineer',      location: 'India',         dateFilter: 'r86400' },
  ];

  // USA Remote queries
  const usaQueries: SearchQuery[] = [
    { keywords: 'Frontend Developer',     location: 'United States', dateFilter: 'r86400' },
    { keywords: 'Senior React Engineer',  location: 'United States', dateFilter: 'r86400' },
    { keywords: 'Frontend Engineer',      location: 'Remote',        dateFilter: 'r86400' },
  ];

  return [...euQueries, ...indiaQueries, ...usaQueries];
}

// All keyword + location combinations to run
export const SEARCH_QUERIES: SearchQuery[] = loadSearchQueries();

const LINKEDIN_BASE = 'https://www.linkedin.com';

/** Check if we're logged in to LinkedIn */
async function ensureLoggedIn(page: import('playwright').Page): Promise<boolean> {
  await page.goto(`${LINKEDIN_BASE}/feed`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await waitForPageSettle(page);

  const isLoggedIn = await page.locator('[data-test-id="nav-settings__dropdown-trigger"]')
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  if (!isLoggedIn) {
    console.log(chalk.yellow('\n⚠  Not logged in to LinkedIn.'));
    console.log(chalk.yellow('   Please log in manually in the browser window, then press Enter here.'));
    await new Promise<void>((r) => process.stdin.once('data', () => r()));
    await saveSession();
    console.log(chalk.green('   Session saved. '));
  }

  return true;
}

/** Build LinkedIn Jobs search URL */
function buildSearchUrl(query: SearchQuery): string {
  const params = new URLSearchParams({
    keywords: query.keywords,
    location: query.location,
    f_TPR: query.dateFilter ?? 'r86400',
    f_WT: '2', // remote
    sortBy: 'DD', // date desc
  });
  return `${LINKEDIN_BASE}/jobs/search?${params.toString()}`;
}

/** Extract the external apply URL from a LinkedIn job page */
async function getApplyUrl(
  page: import('playwright').Page,
  linkedinJobUrl: string
): Promise<string> {
  await page.goto(linkedinJobUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await waitForPageSettle(page);

  // Try to find "Apply" button that links to external site
  const applyBtn = page.locator('[data-control-name="jobdetails_topcard_inapply"]').first();
  const easyApplyBtn = page.locator('button:has-text("Easy Apply")').first();

  const isEasyApply = await easyApplyBtn.isVisible({ timeout: 2000 }).catch(() => false);
  if (isEasyApply) {
    // Still do it — we click Apply which opens the modal, then find the external link inside
    await humanClick(page, 'button:has-text("Easy Apply")');
    await delay(1000, 2000);

    // Look for "Apply on company website" link inside the modal
    const externalLink = page.locator('a:has-text("Apply on company website")').first();
    const hasExternal = await externalLink.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasExternal) {
      const href = await externalLink.getAttribute('href');
      if (href) return href;
    }

    // If truly Easy Apply only (no external), still use it (form-filler handles the modal)
    return linkedinJobUrl + '?easyapply=true';
  }

  // External apply button
  const btn = page.locator('[aria-label*="Apply"], a:has-text("Apply on")').first();
  const href = await btn.getAttribute('href').catch(() => null);
  if (href) return href;

  return linkedinJobUrl; // fallback — form-filler will figure it out
}

/** Extract job description text from a LinkedIn job page */
async function extractDescription(page: import('playwright').Page): Promise<string> {
  const descLocator = page.locator('.jobs-description__content, .job-description, [class*="description"]').first();
  return descLocator.innerText({ timeout: 5000 }).catch(() => '');
}

/**
 * Run a single search query and return all new (not yet applied) jobs.
 */
export async function searchJobs(query: SearchQuery): Promise<Job[]> {
  const page = await newPage();
  const jobs: Job[] = [];

  try {
    await ensureLoggedIn(page);

    const searchUrl = buildSearchUrl(query);
    console.log(chalk.cyan(`\n🔍 Searching: "${query.keywords}" in ${query.location}`));
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await waitForPageSettle(page);

    // Scroll to load more results
    for (let i = 0; i < 3; i++) {
      await humanScroll(page, 800);
      await delay(600, 1200);
    }

    // Collect all job card links
    const jobCards = await page.locator('.job-card-container, .jobs-search-results__list-item').all();
    console.log(chalk.dim(`  Found ${jobCards.length} listings`));

    for (const card of jobCards.slice(0, 30)) { // max 30 per query
      try {
        const jobLink = card.locator('a[href*="/jobs/view/"]').first();
        const href = await jobLink.getAttribute('href').catch(() => null);
        if (!href) continue;

        // Extract LinkedIn job ID
        const idMatch = href.match(/\/jobs\/view\/(\d+)/);
        if (!idMatch) continue;
        const jobId = `li-${idMatch[1]}`;

        if (appDb.alreadyApplied(jobId)) {
          console.log(chalk.dim(`  Skip (already applied): ${jobId}`));
          continue;
        }

        const title = await card.locator('.job-card-list__title, h3').first().innerText().catch(() => '');
        const company = await card.locator('.job-card-container__company-name, h4').first().innerText().catch(() => '');
        const location = await card.locator('.job-card-container__metadata-item').first().innerText().catch(() => '');

        if (!title || !company) continue;

        // Open the job page to get description + apply URL
        const jobPageUrl = `${LINKEDIN_BASE}/jobs/view/${idMatch[1]}`;
        await page.goto(jobPageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await waitForPageSettle(page);

        const description = await extractDescription(page);
        const applyUrl = await getApplyUrl(page, jobPageUrl);

        jobs.push({
          jobId,
          title: title.trim(),
          company: company.trim(),
          location: location.trim(),
          applyUrl,
          description,
          platform: 'linkedin',
        });

        console.log(chalk.green(`  + ${title.trim()} @ ${company.trim()}`));
        await delay(1500, 3000); // pause between job pages
      } catch (e) {
        console.warn(chalk.dim(`  Card parse error: ${(e as Error).message}`));
      }
    }
  } finally {
    await page.close();
  }

  return jobs;
}

/**
 * Run all search queries and return deduplicated job list.
 */
export async function discoverAllJobs(): Promise<Job[]> {
  const seen = new Set<string>();
  const all: Job[] = [];

  for (const query of SEARCH_QUERIES) {
    const jobs = await searchJobs(query);
    for (const job of jobs) {
      if (!seen.has(job.jobId)) {
        seen.add(job.jobId);
        all.push(job);
      }
    }
    // Pause between queries to avoid rate-limiting
    await delay(3000, 6000);
  }

  return all;
}
