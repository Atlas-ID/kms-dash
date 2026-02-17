'use client';

export interface GitLabProject {
    id: number;
    name: string;
    path_with_namespace: string; // e.g. "group/project"
    description: string | null;
    web_url: string;
    visibility: 'private' | 'internal' | 'public';
    last_activity_at: string;
    default_branch: string;
}

class GitLabClient {
    private static instance: GitLabClient;
    private token: string | null = null;
    private baseUrl: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('gitlab_token');
            this.baseUrl = localStorage.getItem('gitlab_url');
        }
    }

    static getInstance(): GitLabClient {
        if (!GitLabClient.instance) {
            GitLabClient.instance = new GitLabClient();
        }
        return GitLabClient.instance;
    }

    setCredentials(baseUrl: string, token: string) {
        // Normalize URL (remove trailing slash)
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('gitlab_url', this.baseUrl);
            localStorage.setItem('gitlab_token', token);
        }
    }

    getToken(): string | null {
        return this.token;
    }

    getBaseUrl(): string | null {
        return this.baseUrl;
    }

    clearCredentials() {
        this.token = null;
        this.baseUrl = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('gitlab_token');
            localStorage.removeItem('gitlab_url');
        }
    }

    async getProjects(): Promise<GitLabProject[]> {
        if (!this.token || !this.baseUrl) {
            return [];
        }

        try {
            // GitLab API v4 - get projects the user is a member of
            const response = await fetch(
                `${this.baseUrl}/api/v4/projects?membership=true&per_page=100&order_by=last_activity_at`,
                {
                    headers: {
                        'PRIVATE-TOKEN': this.token,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                console.error('GitLab API error:', response.status);
                return [];
            }

            return response.json();
        } catch (error) {
            console.error('Failed to fetch GitLab projects:', error);
            return [];
        }
    }

    async validateCredentials(): Promise<boolean> {
        if (!this.token || !this.baseUrl) return false;

        try {
            const response = await fetch(`${this.baseUrl}/api/v4/user`, {
                headers: {
                    'PRIVATE-TOKEN': this.token,
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    async getUser(): Promise<{ username: string; name: string } | null> {
        if (!this.token || !this.baseUrl) return null;

        try {
            const response = await fetch(`${this.baseUrl}/api/v4/user`, {
                headers: {
                    'PRIVATE-TOKEN': this.token,
                }
            });

            if (!response.ok) return null;

            const data = await response.json();
            return { username: data.username, name: data.name };
        } catch {
            return null;
        }
    }
}

export const gitlabClient = GitLabClient.getInstance();
