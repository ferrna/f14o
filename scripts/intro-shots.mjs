/**
 * Capturas de la secuencia de carga y del menú mobile, que no aparecen en
 * shots.mjs porque ese recorrido corre con reduced motion.
 * Uso: node scripts/intro-shots.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321/f14o';
const OUT = '.attic/shots';
const HIDE_TOOLBAR = 'astro-dev-toolbar { display: none !important; }';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

// Secuencia de intro: cada sesión nueva la vuelve a disparar.
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await desktop.newPage();
await page.goto(`${BASE}/`, { waitUntil: 'commit' });
await page.addStyleTag({ content: HIDE_TOOLBAR }).catch(() => {});

for (const ms of [150, 500, 900, 1400, 2200]) {
  await page.waitForTimeout(ms === 150 ? ms : 0);
  const file = `${OUT}/intro-${ms}.png`;
  await page.screenshot({ path: file });
  console.log(`ok    ${file}`);
  if (ms !== 2200) await page.waitForTimeout(350);
}

await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/intro-final.png` });
console.log(`ok    ${OUT}/intro-final.png`);

// La segunda visita en la misma sesión no debe repetir la intro.
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const introVisible = await page.locator('[data-intro]').isVisible().catch(() => false);
console.log(`intro repetida en reload: ${introVisible ? 'SÍ (mal)' : 'no (bien)'}`);

await desktop.close();

// Menú mobile.
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});
const small = await mobile.newPage();
await small.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await small.addStyleTag({ content: HIDE_TOOLBAR });
await small.screenshot({ path: `${OUT}/menu-closed.png` });

const toggle = small.locator('[data-menu-toggle]');
await toggle.click();
await small.waitForTimeout(700);
await small.screenshot({ path: `${OUT}/menu-open.png` });
console.log(`ok    ${OUT}/menu-open.png`);

const expanded = await toggle.getAttribute('aria-expanded');
const locked = await small.evaluate(() => document.body.style.overflow || getComputedStyle(document.body).overflow);
console.log(`aria-expanded: ${expanded} | overflow body: ${locked}`);

await toggle.click();
await small.waitForTimeout(700);
await small.screenshot({ path: `${OUT}/menu-closed-after.png` });
console.log(`aria-expanded tras cerrar: ${await toggle.getAttribute('aria-expanded')}`);

await mobile.close();
await browser.close();
