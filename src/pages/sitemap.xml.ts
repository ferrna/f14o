import type { APIRoute } from 'astro';
import { LANGS, path } from '../i18n/config';
import { getWork, slugOf } from '../i18n/work';

const STATIC = ['/', '/about', '/lab'];

const origin = import.meta.env.SITE ?? 'https://fernandoarriondo.com';

function loc(href: string): string {
  return new URL(href, origin).href;
}

export const GET: APIRoute = async () => {
  const urls = new Set<string>();

  for (const lang of LANGS) {
    for (const route of STATIC) {
      urls.add(loc(path(lang, route)));
    }

    const projects = await getWork(lang);
    for (const project of projects) {
      if (project.data.draft) continue;
      urls.add(loc(path(lang, `/work/${slugOf(project)}`)));
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
