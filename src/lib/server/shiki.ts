import { getHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | undefined;

/**
 * Highlights a markdown code string.
 * 
 * By default it doesn't style the code. It must be style by css variables.
 * 
 * @example
 * 
 * ```css
 * [data-theme='dark'] .shiki,
 * [data-theme='dark'] .shiki span {
 *     background-color: var(--dark-bg);
 *     color: var(--dark);
 *     font-style: var(--dark-font-style);
 *     font-weight: var(--dark-font-weight);
 *     text-decoration: var(--dark-text-decoration);
 * }
 * ```
 */
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
            defaultColor: false,
            cssVariablePrefix: '--'
        }
    );

    return highlightedCode;
}
