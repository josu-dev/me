// import { FONTS } from '$lib/constants.js';
import { getUserPreferencesGlobal } from '$lib/global/preferences.svelte.js';
import { defineCommand, definePage } from 'svelte-hypercommands';

// const fontFamilyCommands = defineCommand(FONTS.map((font) => ({
//     id: `font-family-${font.value}`,
//     name: `Set family '${font.name}'`,
//     category: 'Vista',
//     onAction: ({ command }) => {
//         const p = getUserPreferencesGlobal();
//         if (!p) {
//             return;
//         }
//         p.font.family = command.meta.value;
//     },
//     meta: {
//         value: font.value
//     }
// })));

export const globalCommands = [
    ...defineCommand({
        id: 'toggle-site-menubar',
        name: 'Alternar barra principal',
        category: 'Vista',
        onAction: () => {
            const p = getUserPreferencesGlobal();
            if (!p) {
                return;
            }
            p.navbar.open = !p.navbar.open;
        }
    }),
    // ...fontFamilyCommands,
];

const localPages = definePage([
    {
        url: '/',
        name: 'Inicio',
    },
    {
        url: '/repos',
        name: 'Proyectos publicos',
    },
    {
        url: '/about',
        name: 'Sobre mi',
    }
]);

export const globalPages = [
    ...localPages
];
