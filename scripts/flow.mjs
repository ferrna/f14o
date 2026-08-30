/**
 * Recorrido interactivo: verifica el hover de la lista, la navegación al
 * detalle y que no haya errores de consola en el camino.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321/f14o';
const OUT = '.attic/shots';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

const problems = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
});
page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

await page.locator('#work').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

const row = page.locator('[data-work-row]').nth(1);
const box = await row.boundingBox();
await page.mouse.move(box.x + box.width * 0.35, box.y + box.height / 2, { steps: 18 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/flow-1-hover.png` });

const thumbOpacity = await row
  .locator('[data-work-thumb]')
  .evaluate((el) => Number(getComputedStyle(el).opacity));
console.log(`thumbnail visible en hover: ${thumbOpacity > 0.8 ? 'si' : `no (opacity ${thumbOpacity})`}`);

await row.locator('a').click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(700);
await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
await page.screenshot({ path: `${OUT}/flow-2-detail.png` });

console.log(`url tras el click: ${page.url()}`);

// La galería tiene que quedar con una pieza activa y centrada.
const current = await page.locator('[data-gallery-slide][data-current="true"]').count();
console.log(`piezas activas en la galeria: ${current}`);

await page.locator('.case__back').click();
await page.waitForURL(/\/f14o\/?(#work)?$/, { timeout: 5000 }).catch(() => {});
console.log(`url tras volver: ${page.url()}`);

// El copiado tiene que confirmar en el propio botón y volver solo.
await context.grantPermissions(['clipboard-read', 'clipboard-write']);
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.locator('[data-copy]').click();
await page.waitForTimeout(300);
console.log(`etiqueta tras copiar: ${await page.locator('[data-copy-label]').innerText()}`);
console.log(`portapapeles: ${await page.evaluate(() => navigator.clipboard.readText())}`);
await page.waitForTimeout(2200);
console.log(`etiqueta tras el hold: ${await page.locator('[data-copy-label]').innerText()}`);

console.log(problems.length ? `\nPROBLEMAS:\n${problems.join('\n')}` : '\nsin errores de consola');

await browser.close();
