'use client';

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    private: boolean;
    language: string | null;
    updated_at: string;
}

class GitHubClient {
    private static instance: GitHubClient;
    private token: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('github_token');
        }
    }

    static getInstance(): GitHubClient {
        if (!GitHubClient.instance) {
            GitHubClient.instance = new GitHubClient();
        }
        return GitHubClient.instance;
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('github_token', token);
        }
    }

    getToken(): string | null {
        return this.token;
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('github_token');
        }
    }

    async getRepos(): Promise<GitHubRepo[]> {
        if (!this.token) {
            return [];
        }

        try {
            const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!response.ok) {
                console.error('GitHub API error:', response.status);
                return [];
            }

            return response.json();
        } catch (error) {
            console.error('Failed to fetch GitHub repos:', error);
            return [];
        }
    }

    async validateToken(): Promise<boolean> {
        if (!this.token) return false;

        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github+json',
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

export const githubClient = GitHubClient.getInstance();
