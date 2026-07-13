import { test } from '@playwright/test';

test('debug dump on-screen order', async ({ page }) => {
  await page.goto('http://localhost:4200/#/catalog');
  await page.locator('#product-grid').waitFor({ state: 'visible', timeout: 60_000 });
  await page.locator('[data-testid="catalog-card"]').first().waitFor({ state: 'visible', timeout: 60_000 });
  const items = await page.$$eval('[data-testid="catalog-card"]', (cards) =>
    cards.map((c) => {
      const labelEl = c.querySelector('div.text-safs-accent, div.text-safs-gold-dark');
      const nameEl = c.querySelector('h2, h3');
      return {
        name: (nameEl?.textContent || '').trim(),
        category: (labelEl?.textContent || '').trim(),
      };
    }),
  );
  console.log('TOTAL', items.length);
  items.slice(0, 30).forEach((it, i) => console.log(`${i}: [${it.category}] ${it.name}`));
});
