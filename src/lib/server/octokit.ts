import { GITHUB_TOKEN } from '$env/static/private';
import { Octokit } from 'octokit';

export const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});
