export type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  environment: 'development' | 'staging' | 'production';
  createdAt: string;
  createdBy: string;
};

export type ApiKey = {
  id: string;
  projectId: string; // Foreign key
  name: string;
  key: string; // The secret (often masked)
  scopes: string[];
  environment?: 'development' | 'staging' | 'production';
  active: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  rateLimit?: {
    requestsPerSecond: number;
    requestsPerDay: number;
  };
  usageCount?: number;
  updatedAt?: string;
  createdBy?: string;
};

export type ApiKeyStats = {
  totalKeys: number;
  activeKeys: number;
  requests24h: number;
  avgLatencyMs: number;
};
