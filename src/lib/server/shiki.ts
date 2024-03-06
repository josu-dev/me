import { getHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | undefined;

export async function highlightMarkdown(code: string) {
    if (!highlighter) {
        highlighter = await getHighlighter({ langs: ["bash", "ini", "js", "markdown", "svelte"], themes: ['dark-plus'] });
    }
    const highlightedCode = highlighter.codeToHtml(code, { lang: 'markdown', theme: 'dark-plus' });
    return highlightedCode;
}
