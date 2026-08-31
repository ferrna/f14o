/**
 * Recorrido de capturas para revisar el diseño mientras se construye.
 * Uso: node scripts/shots.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:4321/f14o';
const OUT = '.attic/shots';

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'work-detail', path: '/work/agora-shop' },
  { name: '404', path: '/no-existe' },
  { name: 'home-es', path: '/es' },
  { name: 'about-es', path: '/es/about' },
  { name: 'work-detail-es', path: '/es/work/agora-shop' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    // Las capturas deben mostrar el estado final, no animaciones a medias.
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  for (const route of ROUTES) {
    const url = `${BASE}${route.path}`;
    const response = await page.goto(url, { waitUntil: 'networkidle' }).catch(() => null);

    if (!response) {
      console.log(`skip  ${viewport.name}/${route.name} — sin respuesta`);
      continue;
    }

    // La barra de dev de Astro no forma parte del diseño.
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.waitForTimeout(400);
    const file = `${OUT}/${route.name}-${viewport.name}.png`;
    await page.screenshot({ path: file, fullPage: route.name !== '404' });
    console.log(`ok    ${file}  [${response.status()}]`);
  }

  // En desktop se capturan además las secciones por separado: la página
  // completa queda demasiado chica para juzgar tipografía y espaciado.
  if (viewport.name === 'desktop') {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });

    for (const id of ['work', 'stack', 'experience', 'contact']) {
      const section = page.locator(`#${id}`);
      if (!(await section.count())) continue;
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await section.screenshot({ path: `${OUT}/section-${id}.png` });
      console.log(`ok    ${OUT}/section-${id}.png`);
    }
  }

  await context.close();
}

await browser.close();
