import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './config';

export type Work = CollectionEntry<'work'>;

/**
 * Los casos viven en una carpeta por idioma, así que el id trae el prefijo
 * del idioma y el slug de la URL es lo que queda después. Un archivo por
 * idioma permite que la versión en español sea un texto escrito, no una
 * traducción pegada dentro del frontmatter en inglés.
 */
export function slugOf(entry: Work): string {
  return entry.id.split('/').slice(1).join('/');
}

export async function getWork(lang: Lang): Promise<Work[]> {
  const entries = await getCollection('work', ({ id }) => id.startsWith(`${lang}/`));

  return entries.sort((a, b) => a.data.order - b.data.order);
}
