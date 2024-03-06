import { browser } from '$app/environment';
import { DEFAULT_FONT_FAMILY, DEFAULT_THEME, FONTS } from '$lib/constants';
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
    navbar: {
        open: boolean;
    };
};

type PreferencesStateData = {
    font?: Partial<PreferencesState['font']>;
    theme?: Partial<PreferencesState['theme']>;
    navbar?: Partial<PreferencesState['navbar']>;
};

const DEFAULT_PREFERENCES: PreferencesState = {
    font: {
        family: DEFAULT_FONT_FAMILY,
        size: '16px',
        loading: false,
        available: FONTS,
    },
    theme: {
        value: DEFAULT_THEME,
    },
    navbar: {
        open: false,
    },
};

class Preferences implements PreferencesState {
    font = $state({ ...DEFAULT_PREFERENCES.font });
    theme = $state({ ...DEFAULT_PREFERENCES.theme });
    navbar = $state({ ...DEFAULT_PREFERENCES.navbar });
    fullscreen = $state(false);

    setFontFamily: (family: string) => void;

    constructor(data: PreferencesStateData) {
        Object.assign(this.font, data.font);
        Object.assign(this.theme, data.theme);
        Object.assign(this.navbar, data.navbar);

        let timeoutFont: ReturnType<typeof setTimeout>;

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

        if (browser) {
            $effect(() => {
                document.body.setAttribute('data-font-family', this.font.family);
                document.body.style.setProperty('--base-font-family', this.font.family);
            });

            $effect(() => {
                document.body.setAttribute('data-theme', this.theme.value);
            });
        }
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
