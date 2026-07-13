import { test, expect, Page } from '@playwright/test';

interface DatasetProduct {
  id: string;
  name: string;
  category: string;
  price?: number | null;
}

interface GridItem {
  name: string;
  category: string;
  datasetIndex: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  'flatlids': 'Flatlids',
  'coffins': 'Coffins',
  'baby-caskets': 'Baby Caskets',
  'bespoke': 'Bespoke',
  'domes': 'Domes',
  'equipment': 'Equipment',
  'executive-domes': 'Executive Domes',
  'skinz': 'Skinz',
};

const LABEL_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABEL).map(([k, v]) => [v, k]),
);

function categoryFromLabel(label: string): string {
  const trimmed = label.trim();
  return LABEL_TO_CATEGORY[trimmed] ?? trimmed.toLowerCase();
}

async function readGrid(page: Page): Promise<GridItem[]> {
  return page.$$eval('[data-testid="catalog-card"]', (cards) => {
    return cards.map((card) => {
      const labelEl = card.querySelector('div.text-safs-accent, div.text-safs-gold-dark');
      const nameEl = card.querySelector('h2, h3');
      return {
        name: (nameEl?.textContent || '').trim(),
        category: (labelEl?.textContent || '').trim(),
      };
    });
  });
}

async function loadDataset(page: Page): Promise<DatasetProduct[]> {
  return page.evaluate(async () => {
    const res = await fetch('/products-safs.json');
    if (!res.ok) throw new Error(`Failed to load dataset: ${res.status}`);
    return res.json();
  });
}

function expectedOrder(dataset: DatasetProduct[]): DatasetProduct[] {
  const priority: Record<string, number> = { flatlids: 0, coffins: 1 };
  const fallback = 99;
  return [...dataset].sort((a, b) => {
    const pa = priority[a.category] ?? fallback;
    const pb = priority[b.category] ?? fallback;
    if (pa !== pb) return pa - pb;
    const priceA = a.price ?? Number.POSITIVE_INFINITY;
    const priceB = b.price ?? Number.POSITIVE_INFINITY;
    return priceA - priceB;
  });
}

function buildIndex(dataset: DatasetProduct[]): Map<string, number> {
  const map = new Map<string, number>();
  dataset.forEach((p, i) => map.set(p.id, i));
  return map;
}

test.describe('Catalog affordable-first sorting', () => {
  // The app uses Angular's HashLocationStrategy (see app.config.ts), so the
  // catalog lives at #/catalog rather than /catalog.
  const CATALOG_URL = 'http://localhost:4200/#/catalog';

  // Generous per-test timeout: the app fetches Angular from esm.sh and runs
  // an initial product fetch before the grid renders.
  test.describe.configure({ timeout: 120_000 });

  test('shows flatlids and coffins first when no filter is active', async ({ page }) => {
    await page.goto(CATALOG_URL);
    // The app boots from an esm.sh importmap, so the first paint can be slow
    // while Angular is downloaded and bootstrapped. Use a generous timeout
    // to wait for the product grid and at least one card to appear.
    await expect(page.locator('#product-grid')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('[data-testid="catalog-card"]').first()).toBeVisible({ timeout: 60_000 });

    const dataset = await loadDataset(page);
    const expected = expectedOrder(dataset);
    const idx = buildIndex(dataset);

    const onScreen = await readGrid(page);
    expect(onScreen.length).toBeGreaterThan(0);
    expect(onScreen.length).toBe(expected.length);

    // Map on-screen cards back to dataset categories and validate that they
    // appear in the expected order with no inversions.
    const screenIndexes = onScreen.map((item) => {
      const domCategory = categoryFromLabel(item.category);
      const datasetProduct = dataset.find((p) => p.name === item.name && p.category === domCategory);
      if (!datasetProduct) {
        throw new Error(`Product not found in dataset: ${item.name} (${domCategory})`);
      }
      return idx.get(datasetProduct.id)!;
    });

    const expectedIndexes = expected.map((p) => idx.get(p.id)!);
    expect(screenIndexes).toEqual(expectedIndexes);

    // Spot-check: first card is a flatlid, the coffins form a contiguous band.
    expect(categoryFromLabel(onScreen[0].category)).toBe('flatlids');

    const flatlidCount = dataset.filter((p) => p.category === 'flatlids').length;
    const coffinCount = dataset.filter((p) => p.category === 'coffins').length;

    const flatlidBand = onScreen.slice(0, flatlidCount);
    const coffinBand = onScreen.slice(flatlidCount, flatlidCount + coffinCount);
    const tailBand = onScreen.slice(flatlidCount + coffinCount);

    expect(flatlidBand.every((c) => categoryFromLabel(c.category) === 'flatlids')).toBe(true);
    expect(coffinBand.every((c) => categoryFromLabel(c.category) === 'coffins')).toBe(true);
    expect(
      tailBand.every((c) => {
        const cat = categoryFromLabel(c.category);
        return cat !== 'flatlids' && cat !== 'coffins';
      }),
    ).toBe(true);
  });

  test('flatlids and coffins stay ahead of other categories when search is applied', async ({ page }) => {
    await page.goto(CATALOG_URL);
    await expect(page.locator('#product-grid')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('[data-testid="catalog-card"]').first()).toBeVisible({ timeout: 60_000 });

    // A query broad enough to match across multiple categories.
    await page.fill('input[placeholder="Search catalog..."]', 'c');
    await page.waitForTimeout(200);

    const onScreen = await readGrid(page);
    expect(onScreen.length).toBeGreaterThan(1);

    const firstNonAffordable = onScreen.findIndex(
      (c) => {
        const cat = categoryFromLabel(c.category);
        return cat !== 'flatlids' && cat !== 'coffins';
      },
    );
    const lastAffordable = onScreen
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => {
        const cat = categoryFromLabel(c.category);
        return cat === 'flatlids' || cat === 'coffins';
      })
      .pop();

    if (firstNonAffordable !== -1 && lastAffordable) {
      expect(lastAffordable.i).toBeLessThan(firstNonAffordable);
    }
  });

  test('flatlid category filter preserves price-ascending order', async ({ page }) => {
    await page.goto(CATALOG_URL);
    await expect(page.locator('#product-grid')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('[data-testid="catalog-card"]').first()).toBeVisible({ timeout: 60_000 });

    // Click the Flatlids filter in the sidebar.
    await page.getByRole('button', { name: /^Flatlids\s*\d+$/ }).click();

    const dataset = await loadDataset(page);
    const flatlids = dataset
      .filter((p) => p.category === 'flatlids')
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

    const onScreen = await readGrid(page);
    expect(onScreen.length).toBe(flatlids.length);
    expect(onScreen.every((c) => categoryFromLabel(c.category) === 'flatlids')).toBe(true);

    onScreen.forEach((item, i) => {
      const match = flatlids.find((p) => p.name === item.name);
      expect(match, `Expected ${item.name} to exist in flatlids dataset`).toBeDefined();
      expect(match!.id).toBe(flatlids[i].id);
    });
  });
});
