import { getHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | undefined;

export async function highlightMarkdown(code: string) {
    if (!highlighter) {
        highlighter = await getHighlighter({
            langs: ["bash", "ini", "js", "markdown", "svelte", "html"],
            themes: ['dark-plus', 'light-plus']
        });
    }

    const highlightedCode = highlighter.codeToHtml(
        code,
        {
            lang: 'markdown',
            themes: { dark: 'dark-plus', light: 'light-plus' },
            defaultColor: 'dark'
        }
    );

    return highlightedCode;
}
