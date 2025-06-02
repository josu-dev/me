import { DEFAULT_FONT_FAMILY, DEFAULT_SITEBAR_OPEN, DEFAULT_THEME } from '$lib/constants.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const userPrefs: Required<typeof locals.userPrefs> = {
        fontFamily: DEFAULT_FONT_FAMILY,
        sitebar: DEFAULT_SITEBAR_OPEN,
        theme: DEFAULT_THEME,
        ...locals.userPrefs
    };
    return {
        userPrefs: userPrefs
    };
};
