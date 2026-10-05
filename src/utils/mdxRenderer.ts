import { marked } from 'marked';
import { createHighlighter } from 'shiki';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'html',
        'css',
        'json',
        'bash',
        'sh',
        'markdown',
        'yaml',
        'yml',
        'sql',
        'python',
        'rust',
        'go',
        'txt',
      ],
    });
  }
  return highlighterPromise;
}

/**
 * Renders raw markdown/MDX body into HTML with Shiki code highlighting,
 * Mermaid diagram support, and isolated prose styling.
 */
export async function renderMdxToHtml(content: string = ''): Promise<string> {
  if (!content || !content.trim()) return '';

  // Remove frontmatter if present
  const cleanMarkdown = content.replace(/^---[\s\S]*?---\n*/, '').trim();

  try {
    const highlighter = await getHighlighter();
    const renderer = new marked.Renderer();

    // Tarefa 2: Suporte a diagramas Mermaid
    renderer.code = function ({ text, lang }) {
      const language = (lang || '').trim().toLowerCase();

      if (language === 'mermaid') {
        return `<div class="mermaid-container not-prose my-6 p-4 bg-[#f8fafc] rounded-xl border border-[#cbd5e1] shadow-xs flex justify-center items-center overflow-x-auto select-none"><div class="mermaid text-xs font-mono text-[#0f172a]">${text.trim()}</div></div>`;
      }

      // Tarefa 3: Isolamento estrito de blocos de código (Shiki Github Dark)
      const validLang = language && highlighter.getLoadedLanguages().includes(language) ? language : 'txt';
      try {
        const highlighted = highlighter.codeToHtml(text, {
          lang: validLang,
          theme: 'github-dark',
        });
        return `<div class="code-block-container not-prose my-4 rounded-xl overflow-hidden border border-[#30363d] shadow-md bg-[#0d1117]"><div class="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-[#30363d] text-[11px] font-mono text-[#8b949e] select-none"><span class="font-bold text-[#58a6ff] uppercase tracking-wider">${validLang}</span><span class="text-[#7d8590] text-[10px]">editor view</span></div><div class="p-3 text-xs font-mono overflow-x-auto text-[#e6edf3] leading-relaxed">${highlighted}</div></div>`;
      } catch {
        return `<div class="code-block-container not-prose my-4 rounded-xl overflow-hidden border border-[#30363d] shadow-md bg-[#0d1117]"><pre class="bg-[#0d1117] p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto"><code>${text}</code></pre></div>`;
      }
    };

    // Inline code styling
    renderer.codespan = function ({ text }) {
      return `<code class="inline-code bg-[#f1f5f9] text-[#0284c7] border border-[#e2e8f0] px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">${text}</code>`;
    };

    return marked.parse(cleanMarkdown, { renderer }) as string;
  } catch {
    // Graceful fallback to pure marked
    return marked.parse(cleanMarkdown) as string;
  }
}
