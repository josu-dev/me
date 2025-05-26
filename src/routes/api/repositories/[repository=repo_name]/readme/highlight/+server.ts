import { GITHUB_USERNAME } from '$lib/constants.js';
import { octokit } from '$lib/server/octokit.js';
import { highlightMarkdown } from '$lib/server/shiki.js';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';


export const GET: RequestHandler = async ({ params }) => {
    const repository_name = params.repository;
    const repository = await octokit.rest.repos.get({
        ref: 'main',
        owner: GITHUB_USERNAME,
        repo: repository_name,
    });
    if (repository.status >= 400) {
        return new Response(null, { status: repository.status });
    }
    if (repository.data.visibility !== 'public') {
        return new Response(null, { status: 404 });
    }

    const r = await octokit.rest.repos.getContent({
        ref: 'main',
        owner: GITHUB_USERNAME,
        repo: repository_name,
        path: 'README.md'
    });
    if (r.status >= 400 || Array.isArray(r.data) || r.data.type !== 'file') {
        const status = r.status >= 400 ? r.status : 500;
        return new Response(null, { status: status, statusText: 'Unexpected server error' });
    }

    const html = await highlightMarkdown(Buffer.from(r.data.content, 'base64').toString('utf8'));
    const out = { html };
    return json(out);
};
