/**
 * Shared MDX / Editorial Prose Classes (DRY Principle)
 * Used consistently across Astro static views and React OS windows.
 */
export const MDX_PROSE_CLASSES =
  "prose prose-invert prose-zinc max-w-none " +
  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-100 " +
  "prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:mb-4 " +
  "prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-zinc-800/60 prose-h2:pb-2 " +
  "prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2 " +
  "prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-sm prose-p:mb-4 " +
  "prose-strong:text-zinc-100 prose-strong:font-bold " +
  "prose-li:text-zinc-300 prose-li:text-sm " +
  "prose-a:text-[#38bdf8] hover:prose-a:text-[#7dd3fc] prose-a:underline hover:prose-a:underline-offset-2 " +
  "prose-blockquote:border-l-4 prose-blockquote:border-[#38bdf8] prose-blockquote:bg-[#0284c7]/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:text-zinc-200 prose-blockquote:not-italic " +
  "prose-img:rounded-xl prose-img:border prose-img:border-zinc-800/50 " +
  "prose-table:text-xs prose-th:text-zinc-200 prose-td:text-zinc-300";

/**
 * Light theme variant for classic retro OS windows (Monitor screens)
 * Code blocks and Mermaid diagrams are protected with .not-prose wrappers.
 */
export const OS_PROSE_CLASSES =
  "prose max-w-none text-[#334155] " +
  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0f172a] " +
  "prose-h1:text-xl prose-h1:font-black prose-h1:mb-3 " +
  "prose-h2:text-base prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-h2:border-b prose-h2:border-[#e2e8f0] prose-h2:pb-1 " +
  "prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-1.5 " +
  "prose-p:text-[#334155] prose-p:leading-relaxed prose-p:text-xs prose-p:mb-3 " +
  "prose-strong:text-[#0f172a] prose-strong:font-bold " +
  "prose-li:text-[#334155] prose-li:text-xs " +
  "prose-a:text-[#0284c7] hover:prose-a:text-[#0369a1] prose-a:underline " +
  "prose-blockquote:border-l-4 prose-blockquote:border-[#0284c7] prose-blockquote:bg-[#f0f9ff] prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:rounded-r prose-blockquote:text-[#0369a1] prose-blockquote:not-italic prose-blockquote:text-xs " +
  "prose-img:rounded-lg prose-img:border prose-img:border-[#cbd5e1] " +
  "prose-table:text-xs prose-th:text-[#0f172a] prose-td:text-[#334155]";
