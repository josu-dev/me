import { FONTS } from '$lib/constants.js';
import { preferences } from '$lib/state/preferences.svelte.js';
import { defineCommand } from 'svelte-hypercommands';

const fontFamilyCommands = defineCommand(FONTS.map((font) => ({
    id: `font-family-${font.value}`,
    name: `Set family '${font.name}'`,
    category: 'Font',
    onAction: ({ command }) => {
        preferences.font.family = command.meta.value;
    },
    meta: {
        value: font.value
    }
})));

export const globalCommands = [
    ...fontFamilyCommands
];
