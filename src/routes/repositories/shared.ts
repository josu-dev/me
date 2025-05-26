import type { octokit } from '$lib/server/octokit.js';


export type OctokitRepoResponse = Awaited<ReturnType<typeof octokit.rest.repos.listForUser>>;

export type OctokitRepo = OctokitRepoResponse['data'][number];

export type Repo = {
    id: string;
    name: OctokitRepo['name'];
    description: string;
    language: OctokitRepo['language'];
    stars: OctokitRepo['stargazers_count'];
    forks: OctokitRepo['forks'];
    issues: OctokitRepo['open_issues_count'];
    url: OctokitRepo['html_url'];
    createdAt: NonNullable<OctokitRepo['created_at']>;
    updatedAt: NonNullable<OctokitRepo['updated_at']>;
    license: { name: string, url: string; } | undefined;
    topics: string[];
    homepage: OctokitRepo['homepage'];
    size: number;
};
