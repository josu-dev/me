import { dev } from '$app/environment';
import { GITHUB_USERNAME } from '$lib/constants.js';
import { octokit } from '$lib/server/octokit.js';
import { highlightMarkdown } from '$lib/server/shiki.js';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import { RequestError } from 'octokit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

type OctokitRepoResponse = Awaited<ReturnType<typeof octokit.rest.repos.listForUser>>;
type OctokitRepo = OctokitRepoResponse['data'][number];
type Repo = {
    id: string;
    name: OctokitRepo['name'];
    description: string;
    language: OctokitRepo['language'];
    stars: OctokitRepo['stargazers_count'];
    forks: OctokitRepo['forks'];
    issues: OctokitRepo['open_issues_count'];
    url: OctokitRepo['html_url'];
    createdAt: OctokitRepo['created_at'];
    updatedAt: OctokitRepo['updated_at'];
    license: { name: string, url: string; } | undefined;
    topics: string[];
    homepage: OctokitRepo['homepage'];
    size: number;
};

export const load: PageServerLoad = async () => {
    if (dev) {
        const path = import.meta.url.replace('+page.server.ts', 'repos.json').replace('file:///', '');
        const repos: Repo[] = JSON.parse(fs.readFileSync(path, 'utf-8'));
        return {
            repos,
        };
    }

    let reposResponse: OctokitRepoResponse;
    try {
        reposResponse = await octokit.rest.repos.listForUser({
            username: GITHUB_USERNAME,
        });
    }
    catch (e) {
        console.error(e);
        if (e instanceof RequestError) {
            return {
                error: true,
                status: e.status,
                message: e.message,
            };
        }

        return {
            error: true,
            status: 500,
            message: 'Internal Server Error',
        };
    }
    if (reposResponse.status >= 400) {
        console.error(reposResponse);
        return {
            error: true,
            status: reposResponse.status,
            message: 'Bad Request',
        };
    }

    const repos: Repo[] = [];

    for (const repo of reposResponse.data) {
        if (repo.fork) {
            continue;
        }

        repos.push({
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || '',
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks,
            issues: repo.open_issues_count,
            url: repo.html_url,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            license: repo.license?.name && repo.license?.url ? { name: repo.license.name, url: repo.license.url } : undefined,
            topics: repo.topics ?? [],
            homepage: repo.homepage,
            size: repo.size ?? 0,
        });
    }

    return {
        repos,
    };
};

const highlightRepoReadmeSchema = z.object({
    repo: z.string(),
});

export const actions: Actions = {
    readme_highlighted: async ({ request }) => {
        const form = await superValidate(request, zod(highlightRepoReadmeSchema));
        if (!form.valid) {
            console.error(form.errors);
            return fail(400, { message: 'Invalid request' });
        }
        const { repo } = form.data;

        const r = await octokit.rest.repos.getContent({
            ref: 'main',
            owner: GITHUB_USERNAME,
            repo: repo,
            path: 'README.md'
        });
        if (r.status >= 400 || Array.isArray(r.data) || r.data.type !== 'file') {
            console.error(r);
            return fail(r.status, { message: 'Bad Request' });
        }

        const html = await highlightMarkdown(Buffer.from(r.data.content, 'base64').toString('utf8'));
        return { html };
    }
};
