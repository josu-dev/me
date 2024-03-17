import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette.js';
import plugin from 'tailwindcss/plugin.js';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector', '[data-theme="dark"] &'],
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                base: {
                    50: 'hsl(var(--color-base-50) / <alpha-value>)',
                    100: 'hsl(var(--color-base-100) / <alpha-value>)',
                    200: 'hsl(var(--color-base-200) / <alpha-value>)',
                    300: 'hsl(var(--color-base-300) / <alpha-value>)',
                    400: 'hsl(var(--color-base-400) / <alpha-value>)',
                    500: 'hsl(var(--color-base-500) / <alpha-value>)',
                    600: 'hsl(var(--color-base-600) / <alpha-value>)',
                    700: 'hsl(var(--color-base-700) / <alpha-value>)',
                    800: 'hsl(var(--color-base-800) / <alpha-value>)',
                    900: 'hsl(var(--color-base-900) / <alpha-value>)',
                    950: 'hsl(var(--color-base-950) / <alpha-value>)',
                },
                primary: {
                    50: 'hsl(var(--color-primary-50) / <alpha-value>)',
                    100: 'hsl(var(--color-primary-100) / <alpha-value>)',
                    150: 'hsl(var(--color-primary-150) / <alpha-value>)',
                    200: 'hsl(var(--color-primary-200) / <alpha-value>)',
                    300: 'hsl(var(--color-primary-300) / <alpha-value>)',
                    400: 'hsl(var(--color-primary-400) / <alpha-value>)',
                    500: 'hsl(var(--color-primary-500) / <alpha-value>)',
                    600: 'hsl(var(--color-primary-600) / <alpha-value>)',
                    700: 'hsl(var(--color-primary-700) / <alpha-value>)',
                    800: 'hsl(var(--color-primary-800) / <alpha-value>)',
                    900: 'hsl(var(--color-primary-900) / <alpha-value>)',
                    950: 'hsl(var(--color-primary-950) / <alpha-value>)',
                },
            },
            screens: {
                'xs': '480px',
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        plugin(({ addComponents, matchUtilities, theme }) => {
            const utilities = {
                'square': (value) => {
                    return {
                        width: value,
                        height: value,
                    };
                },
                'scrollbar': (value) => {
                    return {
                        '&::-webkit-scrollbar': {
                            width: value,
                            height: value,
                        },
                    };
                },
                'scrollbar-x': (value) => {
                    return {
                        '&::-webkit-scrollbar': {
                            width: value,
                        },
                    };
                },
                'scrollbar-y': (value) => {
                    return {
                        '&::-webkit-scrollbar': {
                            height: value,
                        },
                    };
                },
            };
            matchUtilities(utilities, { values: theme('spacing') });

            const scrollbarColors = {
                'sb': (value) => {
                    return {
                        '&::-webkit-scrollbar': {
                            backgroundColor: value,
                        },
                    };
                },
                'sb-hover': (value) => {
                    return {
                        '&::-webkit-scrollbar:hover, &::-webkit-scrollbar:active': {
                            backgroundColor: value,
                        },
                    };
                },
                'sb-thumb': (value) => {
                    return {
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: value,
                        },
                    };
                },
                'sb-thumb-hover': (value) => {
                    return {
                        '&::-webkit-scrollbar-thumb:hover, &::-webkit-scrollbar-thumb:active': {
                            backgroundColor: value,
                        },
                    };
                },
            };
            matchUtilities(scrollbarColors, {
                type: ['color'],
                values: flattenColorPalette(theme('colors'))
            });

            addComponents({
                '.ring-dev': {
                    '--tw-ring-opacity': '1',
                    '--tw-ring-color': 'rgb(217 70 239 / var(--tw-ring-opacity))',
                    '--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
                    '--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
                    'boxShadow': 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
                },
                '.underline-effect': {
                    '@apply underline underline-offset-2 transition-all': {},
                    '&:hover': {
                        '@apply underline-offset-4 decoration-2': {},
                    },
                },
                '.h-screen-sub': {
                    '--dheight': 'calc(100dvh - var(--subtract-height, 0px))',
                    height: 'var(--dheight, calc(100vh - var(--subtract-height, 0px)))',
                },
            });
        }),
        plugin(({ addVariant }) => {
            addVariant('light', '[data-theme="light"] &');
        })
    ]
}
