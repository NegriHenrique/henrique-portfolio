import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema para métricas dinâmicas (Tarefa 1)
const metricSchema = z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()]),
});

// Esquema unificado para manter a consistência de dados
const schema = z.object({
    title: z.string(),
    title_pt: z.string().optional(),
    title_en: z.string().optional(),
    description: z.string().max(160, "O SEO agradece descrições curtas."),
    description_pt: z.string().max(160).optional(),
    description_en: z.string().max(160).optional(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
    role: z.string(),
    role_pt: z.string().optional(),
    role_en: z.string().optional(),
    coverImage: z.string().optional(),
    metrics: z.array(metricSchema).optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    parent: z.string().optional(),
    subparent: z.string().optional(),
    order: z.number().optional().default(0),
});

// Coleção para Projetos Comerciais
const worksCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/works" }),
    schema,
});

// Coleção para Laboratório e Casos de Estudo
const casesCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/cases" }),
    schema,
});

// Coleção para Casos de Estudo e Notas Técnicas
const studyCasesCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/studyCases" }),
    schema: schema.extend({
        parent: z.string().optional(),
        subparent: z.string().optional(),
        order: z.number().default(0),
    }),
});

// Exportamos as coleções para o Astro registrar
export const collections = {
    'works': worksCollection,
    'cases': casesCollection,
    'studyCases': studyCasesCollection,
};