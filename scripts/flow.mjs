/**
 * Recorrido interactivo en los dos idiomas: verifica el hover de la lista,
 * la navegación al detalle, el copiado y que no haya errores de consola.
 * Uso: node scripts/flow.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321/f14o';
const OUT = '.attic/shots';

const RUNS = [
  { lang: 'en', prefix: '', copied: 'COPIED' },
  { lang: 'es', prefix: '/es', copied: 'COPIADO' },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const run of RUNS) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`[${run.lang}] console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`[${run.lang}] pageerror: ${err.message}`));

  console.log(`\n— ${run.lang} —`);

  await page.goto(`${BASE}${run.prefix}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

  // La intro bloquea el scroll mientras corre: medir antes daría posiciones falsas.
  await page.locator('[data-intro]').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});

  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);

  const row = page.locator('[data-work-row]').nth(1);
  const box = await row.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.2, y);
  for (const t of [0.32, 0.44, 0.56, 0.68]) {
    await page.mouse.move(box.x + box.width * t, y, { steps: 6 });
    await page.waitForTimeout(80);
  }
  await page.screenshot({ path: `${OUT}/flow-1-hover-${run.lang}.png` });

  const visibleShots = await row.locator('[data-work-shot]').evaluateAll((els) =>
    els.filter((el) => Number(getComputedStyle(el).opacity) > 0.2).length,
  );
  console.log(`capturas en el rastro: ${visibleShots}`);
  console.log(`etiqueta del cursor: ${await page.locator('[data-cursor-label]').innerText()}`);

  await row.locator('a').click();
  await page.waitForURL(/\/work\//, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
  await page.screenshot({ path: `${OUT}/flow-2-detail-${run.lang}.png` });

  console.log(`url tras el click: ${page.url()}`);

  // La galería tiene que quedar con una pieza activa y centrada.
  const current = await page.locator('[data-gallery-slide][data-current="true"]').count();
  console.log(`piezas activas en la galeria: ${current}`);

  await page.locator('.case__back').click();
  await page.waitForURL(new RegExp(`/f14o${run.prefix}/?(#work)?$`), { timeout: 8000 }).catch(() => {});
  console.log(`url tras volver: ${page.url()}`);

  // El copiado tiene que confirmar en el propio botón y volver solo.
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const label = page.locator('[data-copy-label]');
  const before = await label.innerText();
  await page.locator('[data-copy]').click();
  await page.waitForTimeout(300);
  const after = await label.innerText();
  console.log(`etiqueta: ${before} → ${after}${after === run.copied ? '' : ` ESPERADO ${run.copied}`}`);
  if (after !== run.copied) problems.push(`[${run.lang}] el copiado confirma con "${after}"`);
  console.log(`portapapeles: ${await page.evaluate(() => navigator.clipboard.readText())}`);
  await page.waitForTimeout(2200);
  console.log(`etiqueta tras el hold: ${await label.innerText()}`);

  await context.close();
}

console.log(problems.length ? `\nPROBLEMAS:\n${problems.join('\n')}` : '\nsin errores de consola');

await browser.close();
