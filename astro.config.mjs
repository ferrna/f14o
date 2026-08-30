// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages sirve el repo bajo /f14o. Para dominio propio, base pasa a '/'.
export default defineConfig({
  site: 'https://ferrna.github.io',
  base: '/f14o',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          loadPaths: ['src/styles'],
        },
      },
    },
  },
});
