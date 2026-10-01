import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypeMermaid from "rehype-mermaid";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  site: process.env.SITE ?? "http://localhost:4321",

  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    rehypePlugins: [
      [rehypeMermaid, { strategy: 'img-svg' }]
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
