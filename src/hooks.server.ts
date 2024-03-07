import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const fontFamily = event.cookies.get('font_family');
    const sitebar = event.cookies.get('sitebar') === 'true';

    event.locals.userPrefs = {
        fontFamily: fontFamily,
        sitebar : sitebar
    };

    if (fontFamily) {
        return await resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('data-font-family=""', `data-font-family="${fontFamily}"`);
            }
        });
    }

    return await resolve(event);
};
