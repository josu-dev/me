import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const font_family = event.cookies.get('font_family');

    if (font_family) {
        event.locals.userPrefs = {
            fontFamily: font_family
        };

        return await resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('data-font-family=""', `data-font-family="${font_family}"`);
            }
        });
    }

    return await resolve(event);
};
