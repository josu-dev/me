import { predictableShuffle } from '$lib/utils/index.js';
import type { PageServerLoad } from './$types.js';
import rawQuotes from './quotes.json';

const quotes = predictableShuffle(rawQuotes, 13_03_2024);

export const load: PageServerLoad = async () => {
    // Get the current day since the Unix epoch
    const currentDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

    return {
        quote: quotes[currentDay % quotes.length]
    };
};
