import { browser } from '$app/environment';
import { DEFAULT_FONT_FAMILY, DEFAULT_SITEBAR_OPEN, DEFAULT_THEME, FONTS_NAMED } from '$lib/constants.js';
import { getContext, setContext } from 'svelte';

const PREFERENCES_KEY = 'PREFFERENCES_CTX_KEY';

type PreferencesState = {
    font: {
        family: string;
        size: string;
        loading: boolean;
        available: { name: string, value: string; }[];
    };
    theme: {
        value: string;
    };
    sitebar: {
        open: boolean;
    };
};

type PreferencesStateData = {
    font?: Partial<PreferencesState['font']>;
    theme?: Partial<PreferencesState['theme']>;
    sitebar?: Partial<PreferencesState['sitebar']>;
};

const DEFAULT_PREFERENCES: PreferencesState = {
    font: {
        family: DEFAULT_FONT_FAMILY,
        size: '16px',
        loading: false,
        available: FONTS_NAMED,
    },
    theme: {
        value: DEFAULT_THEME,
    },
    sitebar: {
        open: DEFAULT_SITEBAR_OPEN,
    },
};

class Preferences implements PreferencesState {
    font = $state({ ...DEFAULT_PREFERENCES.font });
    theme = $state({ ...DEFAULT_PREFERENCES.theme });
    sitebar = $state({ ...DEFAULT_PREFERENCES.sitebar });
    fullscreen = $state(false);

    setFontFamily: (family: string) => void;
    setSitebarOpen: (open: boolean) => void;
    toggleTheme = () => {
        this.theme.value = this.theme.value === 'dark' ? 'light' : 'dark';
    };

    constructor(data: PreferencesStateData) {
        if (data.font?.family) {
            this.font.family = data.font.family;
        }
        Object.assign(this.theme, data.theme);
        Object.assign(this.sitebar, data.sitebar);


        let timeoutFont: ReturnType<typeof setTimeout>;
        let timeoutSitebar: ReturnType<typeof setTimeout>;
        let timeoutTheme: ReturnType<typeof setTimeout>;

        this.setFontFamily = (family: string) => {
            this.font.family = family;
            clearTimeout(timeoutFont);
            timeoutFont = setTimeout(() => {
                fetch('/api/user/prefs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ font_family: family }),
                }).catch(console.error);
            }, 1000);
        };

        this.setSitebarOpen = (open: boolean) => {
            this.sitebar.open = open;
            clearTimeout(timeoutSitebar);
            timeoutSitebar = setTimeout(() => {
                fetch('/api/user/prefs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sitebar: open ? 'true' : 'false' }),
                }).catch(console.error);
            }, 1000);
        };

        this.toggleTheme = () => {
            this.theme.value = this.theme.value === 'dark' ? 'light' : 'dark';
            clearTimeout(timeoutTheme);
            timeoutTheme = setTimeout(() => {
                fetch('/api/user/prefs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ theme: this.theme.value }),
                }).catch(console.error);
            }, 1000);
        };

        if (!browser) {
            return;
        }

        $effect(() => {
            const onFullscreenChange = () => {
                this.fullscreen = !!document.fullscreenElement;
            };

            document.addEventListener('fullscreenchange', onFullscreenChange);

            return () => {
                document.removeEventListener('fullscreenchange', onFullscreenChange);
            };
        });

        $effect(() => {
            document.body.setAttribute('data-font', this.font.family);
            document.body.style.setProperty('--base-font', this.font.family);
        });

        $effect(() => {
            document.body.setAttribute('data-theme', this.theme.value);
        });
    }
}

let _globalState: Preferences | undefined;

export function setUserPreferences(data: PreferencesStateData) {
    const state = new Preferences(data);
    setContext(PREFERENCES_KEY, state);
    _globalState = state;
    return state;
}

export function getUserPreferences() {
    return getContext<Preferences>(PREFERENCES_KEY);
}

export function getUserPreferencesGlobal() {
    return _globalState;
}
