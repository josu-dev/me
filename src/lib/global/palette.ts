import { FONTS } from '$lib/constants.js';
import { getUserPreferencesGlobal } from '$lib/global/preferences.svelte.js';
import { defineCommand, definePage } from 'svelte-hypercommands';

const fontFamilyCommands = defineCommand(FONTS.map((font) => ({
    id: `font-family-${font.value}`,
    name: `Set family '${font.name}'`,
    category: 'Font',
    onAction: ({ command }) => {
        const p = getUserPreferencesGlobal();
        if (!p) {
            return;
        }
        p.font.family = command.meta.value;
    },
    meta: {
        value: font.value
    }
})));

export const globalCommands = [
    ...fontFamilyCommands
];

const localPages = definePage([
    {
        url: '/',
        name: 'Root',
    },
    {
        url: '/repos',
        name: 'Repositories',
    }
])

export const globalPages = [
    ...localPages
];
