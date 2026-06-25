import { test } from '@playwright/test';
import path from 'path';

const OUT = path.resolve('portfolio-assets/screenshots');

async function shot(
  page: import('@playwright/test').Page,
  filename: string,
  options?: { width?: number; height?: number },
) {
  const width = options?.width ?? 1920;
  const height = options?.height ?? 1080;
  await page.setViewportSize({ width, height });
  await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
}

test.describe('Desktop screenshots — 1920×1080', () => {
  test('01-opening-desktop', async ({ page }) => {
    await page.goto('/#/');
    await page.waitForLoadState('networkidle');
    await shot(page, '01-opening-desktop.png');
  });

  test('02-overview-desktop', async ({ page }) => {
    await page.goto('/#/overview');
    await page.waitForLoadState('networkidle');
    await shot(page, '02-overview-desktop.png');
  });

  test('03-resource-electricity-desktop', async ({ page }) => {
    await page.goto('/#/resource-performance');
    await page.waitForLoadState('networkidle');
    // Electricity is the default utility — no click needed if it loads selected
    const electricityBtn = page.getByRole('button', { name: /electricity/i });
    if (await electricityBtn.isVisible()) await electricityBtn.click();
    await page.waitForTimeout(600);
    await shot(page, '03-resource-electricity-desktop.png');
  });

  test('04-resource-water-desktop', async ({ page }) => {
    await page.goto('/#/resource-performance');
    await page.waitForLoadState('networkidle');
    const waterBtn = page.getByRole('button', { name: /water/i });
    if (await waterBtn.isVisible()) await waterBtn.click();
    await page.waitForTimeout(600);
    await shot(page, '04-resource-water-desktop.png');
  });

  test('05-building-intelligence-desktop', async ({ page }) => {
    await page.goto('/#/building-intelligence');
    await page.waitForLoadState('networkidle');
    // Select Level 2
    const level2Btn = page.getByRole('button', { name: /level 2/i });
    if (await level2Btn.isVisible()) await level2Btn.click();
    // Select Occupancy layer tab (exact text match to avoid matching hotspot aria-labels)
    const occupancyBtn = page.getByRole('button', { name: 'Occupancy', exact: true });
    if (await occupancyBtn.isVisible()) await occupancyBtn.click();
    await page.waitForTimeout(400);
    await shot(page, '05-building-intelligence-desktop.png');
  });

  test('06-insights-desktop', async ({ page }) => {
    await page.goto('/#/insights');
    await page.waitForLoadState('networkidle');
    await shot(page, '06-insights-desktop.png');
  });

  test('07-data-transparency-desktop', async ({ page }) => {
    await page.goto('/#/data-transparency');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '07-data-transparency-desktop.png');
  });
});

test.describe('Mobile screenshots — 390×844', () => {
  test('08-overview-mobile', async ({ page }) => {
    await page.goto('/#/overview');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '08-overview-mobile.png', { width: 390, height: 844 });
  });

  test('09-resource-mobile', async ({ page }) => {
    await page.goto('/#/resource-performance');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '09-resource-mobile.png', { width: 390, height: 844 });
  });

  test('10-building-intelligence-mobile', async ({ page }) => {
    await page.goto('/#/building-intelligence');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, '10-building-intelligence-mobile.png', { width: 390, height: 844 });
  });
});

test.describe('Additional desktop screenshots', () => {
  test('11-authorship-technology-stack-desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/#/data-transparency');
    await page.waitForLoadState('networkidle');
    // Scroll so the Project authorship heading sits ~80px from the top of the viewport
    const heading = page.locator('#dt-authorship-heading');
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const headingTop = await heading.evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate((offset) => window.scrollBy(0, offset - 80), headingTop);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, '11-authorship-technology-stack-desktop.png'), fullPage: false });
  });
});
