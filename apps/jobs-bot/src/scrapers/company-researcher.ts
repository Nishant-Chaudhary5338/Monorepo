/**
 * company-researcher.ts
 * For each target EU company:
 * 1. Find the right person to contact (CTO, Head of Eng, Engineering Manager, Founder)
 * 2. Scrape their LinkedIn profile URL + name + role
 * 3. Pull the company's about page / recent blog for personalisation context
 */
import { newPage, saveSession } from '../lib/browser.js';
import { humanClick, humanType, humanScroll, waitForPageSettle, delay } from '../lib/human.js';
import chalk from 'chalk';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export interface ContactPerson {
  name: string;
  title: string;
  linkedinUrl: string;
  company: string;
  canInMail: boolean; // whether InMail is available
}

export interface CompanyContext {
  name: string;
  careersUrl: string;
  market: string;
  why: string;
  aboutText: string;       // scraped from their website
  recentNews: string;      // any recent blog/press
  contact?: ContactPerson;
}

// Priority titles to target — in order of preference
const TARGET_TITLES = [
  'CTO',
  'VP of Engineering',
  'Head of Engineering',
  'Engineering Manager',
  'Head of Frontend',
  'Frontend Lead',
  'Co-Founder',
  'Founder',
  'Director of Engineering',
  'Staff Engineer',
];

/**
 * Search LinkedIn for a contact at a given company with a target title
 */
async function findContact(
  page: import('playwright').Page,
  companyName: string
): Promise<ContactPerson | undefined> {
  for (const title of TARGET_TITLES) {
    try {
      const query = `${title} ${companyName}`;
      const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}&origin=GLOBAL_SEARCH_HEADER`;

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await waitForPageSettle(page);
      await humanScroll(page, 300);

      // Get first result
      const firstResult = page.locator('.reusable-search__result-container').first();
      const hasResult = await firstResult.isVisible({ timeout: 3000 }).catch(() => false);
      if (!hasResult) continue;

      const nameEl = firstResult.locator('.entity-result__title-text a').first();
      const name = await nameEl.innerText({ timeout: 3000 }).catch(() => '');
      const profileUrl = await nameEl.getAttribute('href').catch(() => '');
      const titleEl = firstResult.locator('.entity-result__primary-subtitle').first();
      const foundTitle = await titleEl.innerText({ timeout: 3000 }).catch(() => '');

      if (!name || !profileUrl) continue;

      // Check if company name appears in their subtitle/company
      const companyEl = firstResult.locator('.entity-result__secondary-subtitle').first();
      const companyText = await companyEl.innerText({ timeout: 2000 }).catch(() => '');
      const isRightCompany =
        companyText.toLowerCase().includes(companyName.toLowerCase()) ||
        foundTitle.toLowerCase().includes(companyName.toLowerCase());

      if (!isRightCompany) continue;

      // Check if InMail button is available (premium indicator)
      const inMailBtn = firstResult.locator('[aria-label*="InMail"], button:has-text("Message")').first();
      const canInMail = await inMailBtn.isVisible({ timeout: 1500 }).catch(() => false);

      console.log(chalk.green(`  Found: ${name.trim()} (${foundTitle.trim()}) at ${companyName}`));

      return {
        name: name.trim(),
        title: foundTitle.trim(),
        linkedinUrl: profileUrl.split('?')[0], // strip tracking params
        company: companyName,
        canInMail,
      };
    } catch {
      // Try next title
    }
    await delay(800, 1500);
  }
  return undefined;
}

/**
 * Scrape the company's homepage/about page for context
 * Claude will use this to personalise the outreach message
 */
async function scrapeCompanyContext(
  page: import('playwright').Page,
  careersUrl: string
): Promise<{ aboutText: string; recentNews: string }> {
  try {
    // Try to get the homepage (strip /careers path)
    const homeUrl = new URL(careersUrl);
    homeUrl.pathname = '/';
    await page.goto(homeUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 12000 });
    await waitForPageSettle(page);

    const bodyText = await page.evaluate(() => {
      const el = document.querySelector('main, article, [class*="hero"], [class*="about"]');
      return (el || document.body).innerText.slice(0, 1500);
    });

    // Try /blog for recent news
    let recentNews = '';
    try {
      const blogUrl = new URL(careersUrl);
      blogUrl.pathname = '/blog';
      await page.goto(blogUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 8000 });
      recentNews = await page.evaluate(() => {
        const el = document.querySelector('main, article, [class*="post"]');
        return (el || document.body).innerText.slice(0, 600);
      });
    } catch { /* no blog — fine */ }

    return { aboutText: bodyText, recentNews };
  } catch {
    return { aboutText: '', recentNews: '' };
  }
}

/**
 * Research all EU target companies and build full context objects
 */
export async function researchEUCompanies(): Promise<CompanyContext[]> {
  const cfg = require('../profile/search-config.json') as {
    targetCompanies: { name: string; careersUrl: string; market: string; why: string }[];
  };

  // Filter to EU-focused companies
  const euCompanies = cfg.targetCompanies.filter((c) =>
    c.market.toLowerCase().includes('europe') ||
    c.market.toLowerCase().includes('global remote') ||
    c.market.toLowerCase().includes('uk')
  );

  console.log(chalk.cyan(`\n🔍 Researching ${euCompanies.length} EU/Global Remote companies...`));

  const page = await newPage();
  const results: CompanyContext[] = [];

  // First ensure LinkedIn login
  await page.goto('https://www.linkedin.com/feed', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await waitForPageSettle(page);

  for (const company of euCompanies) {
    console.log(chalk.bold(`\n  ▶ ${company.name} (${company.market})`));

    const { aboutText, recentNews } = await scrapeCompanyContext(page, company.careersUrl);
    const contact = await findContact(page, company.name);

    results.push({
      ...company,
      aboutText,
      recentNews,
      contact,
    });

    await saveSession();
    await delay(2000, 4000); // be respectful between companies
  }

  await page.close();
  return results;
}
