import { FONTS } from '$lib/constants';
import { z } from 'zod/v4';
import type { RequestHandler } from './$types';


const configSchema = z.object({
    theme: z.enum(['dark', 'light']).optional(),
    font_size: z.enum(['8', '10', '12', '14', '16', '18', '20', '22', '24']).optional(),
    font_family: z.enum(FONTS).optional(),
    sitebar: z.enum(['true', 'false']).optional(),
});

export const POST: RequestHandler = async ({ cookies, request }) => {
    const json = await request.json();
    const config = await configSchema.safeParseAsync(json);
    if (!config.success) {
        return new Response(JSON.stringify(config.error), { status: 400 });
    }

    for (const [key, value] of Object.entries(config.data)) {
        if (value === undefined) {
            continue;
        }

        cookies.set(key, value, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 365, sameSite: 'strict' });
    }

    return new Response(undefined, { status: 200 });
};
