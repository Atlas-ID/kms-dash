import type { ApiKey, ApiKeyStats } from './types';

export const apiKeys: ApiKey[] = [
  {
    id: '1',
    projectId: 'proj_1',
    name: 'Main App Key',
    key: 'kms_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    scopes: ['read', 'write'],
    active: true,
    createdAt: '2023-01-15T10:00:00Z',
    lastUsed: '2023-10-25T14:30:00Z',
  },
  {
    id: '2',
    projectId: 'proj_1',
    name: 'Analytics Service',
    key: 'kms_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
    scopes: ['read'],
    active: true,
    createdAt: '2023-02-20T11:00:00Z',
    lastUsed: '2023-10-24T18:00:00Z',
  },
  {
    id: '3',
    projectId: 'proj_2',
    name: 'Admin Full Access',
    key: 'kms_f1e2d3c4b5a69876543210f1e2d3c4b5',
    scopes: ['read', 'write', 'delete', 'admin'],
    active: false,
    createdAt: '2023-03-10T09:00:00Z',
  },
  {
    id: '4',
    projectId: 'proj_2',
    name: 'Legacy System Key',
    key: 'kms_p0o9i8u7y6t5r4e3w2q1a2s3d4f5g6h7',
    scopes: ['read'],
    active: false,
    createdAt: '2022-05-01T12:00:00Z',
    lastUsed: '2023-09-01T00:00:00Z',
  },
];

export const stats: ApiKeyStats = {
  totalKeys: 4,
  activeKeys: 2,
  requests24h: 12543,
  avgLatencyMs: 85,
};

export const usageData = [
    { date: '2023-10-19', requests: 1200 },
    { date: '2023-10-20', requests: 1500 },
    { date: '2023-10-21', requests: 1300 },
    { date: '2023-10-22', requests: 1800 },
    { date: '2023-10-23', requests: 1600 },
    { date: '2023-10-24', requests: 2100 },
    { date: '2023-10-25', requests: 1900 },
]
