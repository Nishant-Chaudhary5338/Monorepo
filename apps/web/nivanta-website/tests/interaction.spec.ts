import { test, expect } from "@playwright/test";

// ── Desktop nav link clicks ──────────────────────────────────────────────────
test.describe("Desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  const navLinks = [
    { label: "About Us",      href: "/about" },
    { label: "Our Rooms",     href: "/rooms" },
    { label: "Our Amenities", href: "/amenities" },
    { label: "Restaurant",    href: "/restaurant" },
    { label: "Gallery",       href: "/gallery" },
    { label: "Contact Us",    href: "/contact" },
  ];

  for (const link of navLinks) {
    test(`"${link.label}" navigates to ${link.href}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const nav = page.locator("nav[aria-label='Primary navigation']");
      await nav.getByRole("link", { name: link.label }).click();

      await expect(page).toHaveURL(new RegExp(link.href.replace("/", "\\/")));
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

// ── Contact form ─────────────────────────────────────────────────────────────
test.describe("Contact form", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("fill and submit shows Thank You state", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Scope to the Netlify contact form — BookingWidget also has name/email fields
    const form = page.locator("form[data-netlify='true']");
    await form.locator("input[name='name']").fill("Jane Smith");
    await form.locator("input[name='email']").fill("jane@example.com");
    await form.locator("select[name='enquiryType']").selectOption("stay");
    await form.locator("textarea[name='message']").fill(
      "We would love to book a suite for 3 nights in December."
    );

    await form.locator("button[type='submit']").click();

    await expect(page.locator("text=Thank You")).toBeVisible({ timeout: 8000 });
  });

  test("empty submit shows validation errors", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await page.locator("button[type='submit']").click();

    // At least one validation message must appear
    await expect(page.locator("p.text-red-600").first()).toBeVisible({ timeout: 5000 });
  });
});

// ── Room card navigation ──────────────────────────────────────────────────────
test.describe("Room cards", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("clicking a room card navigates to room detail page", async ({ page }) => {
    await page.goto("/rooms");
    await page.waitForLoadState("networkidle");

    // Room cards are <article> elements with an <a> link inside
    const firstCard = page.locator("article a").first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/rooms\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("each room slug resolves to a detail page", async ({ page }) => {
    const slugs = ["apex-suites", "aura", "haven", "lush", "breeze", "origin"];
    for (const slug of slugs) {
      await page.goto(`/rooms/${slug}`);
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    }
  });
});

// ── Blog card navigation ──────────────────────────────────────────────────────
test.describe("Blog cards", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("clicking a blog card navigates to blog detail page", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator("article a").first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("each blog slug resolves", async ({ page }) => {
    const slugs = [
      "journey-through-traditional-cuisine",
      "stay-healthy-while-travelling",
      "celebrate-birthday-silvanza-way",
      "live-music-corbett-nights-silvanza",
    ];
    for (const slug of slugs) {
      await page.goto(`/blog/${slug}`);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    }
  });
});

// ── Mobile hamburger ──────────────────────────────────────────────────────────
test.describe("Mobile hamburger menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger opens mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hamburger = page.locator("button[aria-label='Open menu']");
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("hamburger closes mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open
    await page.locator("button[aria-label='Open menu']").click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    // Close — same button now has aria-label="Close menu"
    await page.locator("button[aria-label='Close menu']").click();

    // Framer Motion removes the element after exit animation
    await expect(page.locator("#mobile-menu")).toHaveCount(0, { timeout: 2000 });
  });

  test("mobile menu link navigates and closes menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.locator("button[aria-label='Open menu']").click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    await page.locator("#mobile-menu").getByRole("link", { name: "About Us" }).click();

    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0, { timeout: 2000 });
  });
});
