export type ApiKey = {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'inactive' | 'revoked';
};

export type ApiKeyStats = {
  totalKeys: number;
  activeKeys: number;
  requests24h: number;
  avgLatencyMs: number;
};
