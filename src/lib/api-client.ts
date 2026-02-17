import { ApiKey, ApiKeyStats, Project } from './types';

const BASE_URL = '/api/proxy';

class ApiClient {
    private static instance: ApiClient;
    private token: string | null = null;

    private constructor() {
        if (typeof window !== 'undefined') {
            // Try to hydrate token from localStorage
            this.token = localStorage.getItem('keymaster_admin_key');
        }
    }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('keymaster_admin_key', token);
        }
    }

    private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        if (!this.token) {
            // Fallback for SSR or if not set yet, try to read again
            if (typeof window !== 'undefined') {
                this.token = localStorage.getItem('keymaster_admin_key');
            }
            if (!this.token) {
                throw new Error('Unauthorized: No Admin Key provided');
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            // Use X-Admin-Key instead of Bearer token for the Admin Dashboard
            'X-Admin-Key': this.token || '',
            ...options.headers,
        };

        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!res.ok) {
            if (res.status === 401) {
                throw new Error('Unauthorized: Invalid API Key');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${res.statusText}`);
        }

        // Handle 204 No Content
        if (res.status === 204) {
            return {} as T;
        }

        return res.json();
    }

    // --- Auth & Verification ---
    async verifyKey(key: string): Promise<boolean> {
        try {
            await this.fetch(`/keys/verify?key=${key}`, { method: 'GET' });
            return true;
        } catch {
            return false;
        }
    }

    // --- Keys Management ---
    async getApiKeys(): Promise<ApiKey[]> {
        const response: any = await this.fetch('/keys');
        return response.data || [];
    }

    async getStats(): Promise<ApiKeyStats> {
        // Use the analytics/overview endpoint as per user request
        return this.fetch<ApiKeyStats>('/analytics/overview');
    }

    async createApiKey(data: { name: string; scopes: string[]; description?: string; projectId: string; environment?: string }): Promise<ApiKey> {
        return this.fetch<ApiKey>('/keys', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async revokeApiKey(id: string): Promise<void> {
        // Revoke is done by updating active to false
        return this.fetch<void>(`/keys/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ active: false }),
        });
    }

    async rotateApiKey(id: string): Promise<ApiKey> {
        return this.fetch<ApiKey>(`/keys/${id}/rotate`, {
            method: 'POST'
        });
    }

    async deleteApiKey(id: string): Promise<void> {
        return this.fetch<void>(`/keys/${id}`, {
            method: 'DELETE'
        });
    }

    async getProjects(): Promise<Project[]> {
        const response: any = await this.fetch('/projects');
        return response.data || [];
    }

    // --- Integrations Management ---
    async saveIntegration(service: string, data: any): Promise<void> {
        return this.fetch<void>(`/integrations/${service}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getIntegration(service: string): Promise<any> {
        return this.fetch<any>(`/integrations/${service}`);
    }

    async deleteIntegration(service: string): Promise<void> {
        return this.fetch<void>(`/integrations/${service}`, {
            method: 'DELETE',
        });
    }

    // --- Proxy methods for External Services (Secure) ---
    async getExternalGithubRepos(): Promise<any[]> {
        const response: any = await this.fetch('/integrations/github/repos');
        return response.data || [];
    }

    async getExternalGitlabProjects(): Promise<any[]> {
        const response: any = await this.fetch('/integrations/gitlab/projects');
        return response.data || [];
    }

    async getExternalNpmPackages(): Promise<any[]> {
        const response: any = await this.fetch('/integrations/npm/packages');
        return response.data || [];
    }
}


export const apiClient = ApiClient.getInstance();
