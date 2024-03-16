import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const fontFamily = event.cookies.get('font_family');

    event.locals.userPrefs = {
        fontFamily: fontFamily || 'JetBrainsMono',
        sitebar: event.cookies.get('sitebar') === 'true',
        theme: event.cookies.get('theme') || 'dark'
    };

    const dataUserPreferences = `data-theme="${event.locals.userPrefs.theme}" data-font="${event.locals.userPrefs.fontFamily}"`;

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('data-user-preferences=""', dataUserPreferences);
        }
    });

    return response;
};
