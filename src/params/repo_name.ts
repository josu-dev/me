const repo_name_re = /^[\w.-]{1,64}$/;

export function match(value: string): boolean {
    return repo_name_re.test(value);
}
