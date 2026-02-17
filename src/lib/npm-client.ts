'use client';

export interface NpmPackage {
    name: string;
    version: string;
    description: string;
    date: string;
    links: {
        npm: string;
        repository?: string;
    };
}

interface NpmSearchResult {
    objects: Array<{
        package: NpmPackage;
    }>;
    total: number;
}

class NpmClient {
    private static instance: NpmClient;
    private username: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.username = localStorage.getItem('npm_username');
        }
    }

    static getInstance(): NpmClient {
        if (!NpmClient.instance) {
            NpmClient.instance = new NpmClient();
        }
        return NpmClient.instance;
    }

    setUsername(username: string) {
        this.username = username;
        if (typeof window !== 'undefined') {
            localStorage.setItem('npm_username', username);
        }
    }

    getUsername(): string | null {
        return this.username;
    }

    clearUsername() {
        this.username = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('npm_username');
        }
    }

    async getPackages(): Promise<NpmPackage[]> {
        if (!this.username) {
            return [];
        }

        try {
            // NPM Registry API - search for packages by maintainer
            const response = await fetch(
                `https://registry.npmjs.org/-/v1/search?text=maintainer:${this.username}&size=100`
            );

            if (!response.ok) {
                console.error('NPM API error:', response.status);
                return [];
            }

            const data: NpmSearchResult = await response.json();
            return data.objects.map(obj => obj.package);
        } catch (error) {
            console.error('Failed to fetch NPM packages:', error);
            return [];
        }
    }

    async validateUsername(): Promise<boolean> {
        if (!this.username) return false;

        try {
            const response = await fetch(
                `https://registry.npmjs.org/-/v1/search?text=maintainer:${this.username}&size=1`
            );
            return response.ok;
        } catch {
            return false;
        }
    }
}

export const npmClient = NpmClient.getInstance();
