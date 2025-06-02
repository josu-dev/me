import { dev } from '$app/environment';
import { GITHUB_USERNAME } from '$lib/constants.js';
import { octokit } from '$lib/server/octokit.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { OctokitRepoResponse, Repo } from './shared.js';


export const load: PageServerLoad = async () => {
    // if (dev) {
    //     const fs = await import('fs');
    //     const path = import.meta.url.replace('+page.server.ts', 'repos.json').replace('file://', '');
    //     const repos: Repo[] = JSON.parse(fs.readFileSync(path, 'utf-8'));
    //     return {
    //         repos,
    //     };
    // }

    let reposResponse: OctokitRepoResponse;
    try {
        reposResponse = await octokit.rest.repos.listForUser({
            username: GITHUB_USERNAME,
        });
    }
    catch (e) {
        console.error(e);
        error(500, 'Unexpected error while fetching repositories');
    }
    if (reposResponse.status >= 400) {
        console.error(reposResponse);
        error(500, 'Failed to fetch repositories');
    }

    const repos: Repo[] = [];

    for (const repo of reposResponse.data) {
        if (repo.fork) {
            continue;
        }

        const created_at = repo.created_at ?? new Date().toISOString();
        repos.push({
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || '',
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks,
            issues: repo.open_issues_count,
            url: repo.html_url,
            createdAt: created_at,
            updatedAt: repo.updated_at ?? created_at,
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
