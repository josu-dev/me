import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sitebar = event.cookies.get('sitebar');

    event.locals.userPrefs = {
        fontFamily: event.cookies.get('font_family'),
        sitebar: typeof sitebar === 'string' ? sitebar === 'true' : undefined,
        theme: event.cookies.get('theme')
    };

    const dataUserPreferences = `data-theme="${event.locals.userPrefs.theme}" data-font="${event.locals.userPrefs.fontFamily}"`;

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('data-user-preferences=""', dataUserPreferences);
        }
    });

    return response;
};
