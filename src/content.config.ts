import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Cada caso de proyecto es un archivo Markdown: agregar un proyecto es
 * escribir un archivo, no editar plantillas. Se agrupan en una carpeta por
 * idioma (work/en, work/es) y el slug de la URL es el nombre del archivo.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Controla el orden en la lista y el número que se muestra. */
      order: z.number(),
      category: z.string(),
      year: z.number(),
      role: z.string(),
      /** Si no hay un dato real, el caso muestra un em dash. */
      duration: z.string().optional(),
      stack: z.array(z.string()),
      /** Una línea, la que se lee en la lista. */
      summary: z.string(),
      liveUrl: z.string().url().optional(),
      /** Si no hay liveUrl, el aside muestra este estado en lugar del CTA. */
      status: z.string().optional(),
      cover: image(),
      /** Métricas reales del proyecto: si no se pueden sostener, se omiten. */
      metrics: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .default([]),
      /** Piezas e integraciones. No son métricas: son el mapa del sistema. */
      specs: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            caption: z.string(),
          })
        )
        .default([]),
      /** Marca los casos cuyo texto todavía es provisorio. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
