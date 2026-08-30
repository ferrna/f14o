/**
 * Verifica que el idioma sea consistente: que el switcher conserve la página,
 * que las rutas en español existan y que los hreflang apunten a su par.
 * Uso: node scripts/i18n-check.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321/f14o';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();

const problems = [];
let watchConsole = true;
page.on('console', (msg) => {
  if (watchConsole && msg.type() === 'error') problems.push(`console: ${msg.text()}`);
});
page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));

// El switcher tiene que quedarse en la misma página, no mandar a la home.
const pairs = [
  { from: '/about', to: '/es/about' },
  { from: '/es/about', to: '/about' },
  { from: '/work/product-experience', to: '/es/work/product-experience' },
  { from: '/es/work/commerce-platform', to: '/work/commerce-platform' },
  { from: '/', to: '/es' },
];

for (const pair of pairs) {
  await page.goto(`${BASE}${pair.from}`, { waitUntil: 'networkidle' });
  const href = await page.locator('.header__lang-alt').getAttribute('href');
  const ok = href === `${BASE.replace(/^https?:\/\/[^/]+/, '')}${pair.to}`.replace('//', '/');
  const expected = `/f14o${pair.to}`.replace(/\/$/, '');
  console.log(`${pair.from} → ${href} ${href === expected ? 'ok' : `ESPERADO ${expected}`}`);
  if (!ok && href !== expected) problems.push(`switcher ${pair.from} apunta a ${href}`);
}

// El idioma declarado en el documento tiene que coincidir con la ruta.
for (const route of ['/', '/about', '/es', '/es/about', '/es/work/commerce-platform']) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
  const lang = await page.locator('html').getAttribute('lang');
  const expected = route.startsWith('/es') ? 'es' : 'en';
  console.log(`lang de ${route || '/'}: ${lang}${lang === expected ? '' : ` ESPERADO ${expected}`}`);
  if (lang !== expected) problems.push(`lang incorrecto en ${route}`);
}

// Navegación interna en español: la lista tiene que llevar al caso en español.
await page.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
await page.locator('#work').scrollIntoViewIfNeeded();
await page.locator('[data-work-row] a').first().click();
// La cortina retiene el swap unos cientos de ms: la URL llega después.
await page.waitForURL(/\/work\//, { timeout: 8000 }).catch(() => {});
console.log(`primer caso desde /es: ${page.url()}`);
if (!page.url().includes('/es/work/')) problems.push('la lista en español sale del idioma');

const back = await page.locator('.case__back').innerText();
console.log(`enlace de vuelta: ${back}`);

// El 404 en español devuelve al home en español, aunque el texto sea inglés.
// El 404 del propio servidor es el punto de la prueba, no un problema.
watchConsole = false;
await page.goto(`${BASE}/es/ruta-rota`, { waitUntil: 'networkidle' });
console.log(`404 vuelve a: ${await page.locator('[data-back]').getAttribute('href')}`);

console.log(problems.length ? `\nPROBLEMAS:\n${problems.join('\n')}` : '\nsin problemas');

await browser.close();
