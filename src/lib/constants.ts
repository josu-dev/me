export const DEFAULT_FONT_FAMILY = 'JetBrainsMono';

export const DEFAULT_LOG_FORMATTER = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });

export const DEFAULT_LOG_LEVEL = 3;

export const DEFAULT_LOG_LEVEL_CLIENT = 3;

export const DEFAULT_OPEN_GRAPH = {
    SITE_NAME: 'La pagina de Josu',
    IMAGE_URL: '', /* '/logo/og-1200x630.png' */
    IMAGE_ALT: '', /* 'Logo de \'La pagina de Josu\'' */
    IMAGE_WIDTH: '', /* '1200' */
    IMAGE_HEIGHT: '', /* '630' */
};

export const DEFAULT_SITE_MENUBAR_OPEN = false;

export const DEFAULT_THEME = 'dark';

export const DEFAULT_THEME_COLOR = '#082f49';

export const FONTS = [
    'JetBrainsMono',
    'FiraCode',
    'CascadiaCode',
    'RobotoMono',
    'GeistMono',
    'monospace',
] as const;

export const FONTS_NAMED = [
    { name: 'JetBrains Mono', value: 'JetBrainsMono' },
    { name: 'Fira Code', value: 'FiraCode' },
    { name: 'Cascadia Code', value: 'CascadiaCode' },
    { name: 'Roboto Mono', value: 'RobotoMono' },
    { name: 'Geist Mono', value: 'GeistMono' },
    { name: 'monospace', value: 'monospace' }
];

export const GITHUB_USERNAME = 'J-Josu';

export const GITHUB_REPOSITORY = 'https://github.com/J-Josu/me';

export const TOAST = {
    DURATION_ERROR: 5000,
    DURATION_INFO: 3500,
    DURATION_SUCCESS: 2500,
    DURATION_WARNING: 3500,
};
