import { page } from '$app/stores';
import { DEFAULT_FONT_FAMILY, DEFAULT_THEME, FONTS } from '$lib/constants';

function createPreferences() {
    const font = $state({
        family: DEFAULT_FONT_FAMILY,
        size: '16px',
        loading: false,
        available: FONTS,
        saveError: null,
    });

    const theme = $state({
        value: DEFAULT_THEME,
    });

    page.subscribe(($page) => {
        const pFontFamily = $page.data?.userPrefs?.fontFamily;
        if (pFontFamily && pFontFamily !== font.family) {
            font.family = pFontFamily;
        }
        const pTheme = $page.data?.userPrefs?.theme;
        if (pTheme && pTheme !== theme.value) {
            theme.value = pTheme;
        }
    });

    $effect.root(() => {
        $effect(() => {
            document.body.setAttribute('data-font-family', font.family);
            document.body.style.setProperty('--base-font-family', font.family);

            const timeout = setTimeout(() =>
                fetch(
                    '/api/user/prefs',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ font_family: font.family }),
                    }
                ).catch(console['error']),
                1000
            );

            return () => {
                clearTimeout(timeout);
            };
        });

        $effect(() => {
            document.body.setAttribute('data-theme', theme.value);
        });
    });

    return {
        font,
        theme,
    };
}

export const preferences = createPreferences();
