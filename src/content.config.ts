// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'

// Definimos o contrato de dados para a coleção de portfólio usando o Content Layer (Astro 6+)
const worksCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/works" }),
    schema: z.object({
        title: z.string(),
        description: z.string().max(160, "O SEO agradece descrições curtas."),
        publishDate: z.date(),
        tags: z.array(z.string()),
        role: z.string(),
    }),
});

// Exportamos a coleção para o Astro registrar
export const collections = {
    'works': worksCollection,
};