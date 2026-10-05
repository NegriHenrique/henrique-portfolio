import { getCollection } from 'astro:content';
import { renderMdxToHtml } from './mdxRenderer';
import type { WorkItem, StudyCaseItem } from '../types/content';

export function getCleanSlug(id: string): string {
  return id.replace(/\.[^/.]+$/, '').replace(/^[\\/]+|[\\/]+$/g, '');
}

/**
 * Prepares and enriches content collections for both Astro SSG and React 3D scenes.
 */
export async function prepareContentCollections(): Promise<{
  works: WorkItem[];
  studyCases: StudyCaseItem[];
}> {
  const [rawWorks, rawStudyCases] = await Promise.all([
    getCollection('works'),
    getCollection('studyCases'),
  ]);

  const works: WorkItem[] = await Promise.all(
    rawWorks.map(async (w) => {
      const cleanSlug = getCleanSlug(w.id);
      const html = await renderMdxToHtml(w.body || '');
      return {
        id: cleanSlug,
        slug: cleanSlug,
        body: w.body,
        html,
        data: {
          ...w.data,
          publishDate:
            w.data.publishDate instanceof Date
              ? w.data.publishDate.toISOString()
              : String(w.data.publishDate),
        },
      };
    })
  );

  const studyCases: StudyCaseItem[] = await Promise.all(
    rawStudyCases.map(async (s) => {
      const cleanSlug = getCleanSlug(s.id);
      const html = await renderMdxToHtml(s.body || '');
      return {
        id: cleanSlug,
        slug: cleanSlug,
        body: s.body,
        html,
        data: {
          ...s.data,
          publishDate:
            s.data.publishDate instanceof Date
              ? s.data.publishDate.toISOString()
              : String(s.data.publishDate),
        },
      };
    })
  );

  // Sort works by date descending
  works.sort(
    (a, b) =>
      new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );

  // Sort study cases by order ascending, then by date descending
  studyCases.sort((a, b) => {
    const orderA = a.data.order ?? 999;
    const orderB = b.data.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return (
      new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
    );
  });

  return { works, studyCases };
}
