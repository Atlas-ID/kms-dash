'use client';

import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  Text,
  BlockStack,
  InlineStack,
  Banner,
  Select,
} from '@shopify/polaris';
import {
  ChartVerticalFilledIcon,
  KeyIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@shopify/polaris-icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import { ApiKeyStats } from '@/lib/types';

// Mock data for charts - replace with real API data when available
const mockUsageData = [
  { date: 'Mon', requests: 1200, errors: 45 },
  { date: 'Tue', requests: 1800, errors: 32 },
  { date: 'Wed', requests: 2400, errors: 28 },
  { date: 'Thu', requests: 2100, errors: 56 },
  { date: 'Fri', requests: 3200, errors: 48 },
  { date: 'Sat', requests: 2800, errors: 35 },
  { date: 'Sun', requests: 1900, errors: 42 },
];

const mockStatusData = [
  { name: 'Active', value: 65, color: '#00a47c' },
  { name: 'Inactive', value: 25, color: '#ffc453' },
  { name: 'Revoked', value: 10, color: '#d72c0d' },
];

const mockEndpointData = [
  { endpoint: '/api/keys', calls: 4500 },
  { endpoint: '/api/verify', calls: 3200 },
  { endpoint: '/api/stats', calls: 1800 },
  { endpoint: '/api/create', calls: 950 },
  { endpoint: '/api/revoke', calls: 320 },
];

const CHART_COLORS = ['#008060', '#00a47c', '#96f7d6', '#ffc453', '#d72c0d'];

export default function StatisticsPage() {
  const [stats, setStats] = useState<ApiKeyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('area');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        console.log('[Analytics] Fetching stats from API...');
        const data = await apiClient.getStats();
        console.log('[Analytics] API Response:', data);
        setStats(data);
      } catch (err: any) {
        console.error('[Analytics] API Error:', err);
        console.error('[Analytics] Error details:', {
          message: err.message,
          status: err.status,
          response: err.response,
        });
        setError(`Failed to load statistics: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Page title="Analytics" subtitle="Overview of your API key usage">
        <Layout>
          {[1, 2, 3].map((i) => (
            <Layout.Section variant="oneThird" key={i}>
              <LegacyCard title="Loading..." sectioned>
                <BlockStack gap="200">
                  <InlineStack gap="200" align="start">
                    <div style={{ width: '20px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }} />
                    <div style={{ width: '60px', height: '28px', background: '#e0e0e0', borderRadius: '4px' }} />
                  </InlineStack>
                  <div style={{ width: '120px', height: '16px', background: '#e0e0e0', borderRadius: '4px' }} />
                </BlockStack>
              </LegacyCard>
            </Layout.Section>
          ))}
          <Layout.Section>
            <LegacyCard title="Usage Overview" sectioned>
              <BlockStack gap="400">
                <div style={{ width: '100%', height: '16px', background: '#e0e0e0', borderRadius: '4px' }} />
                <div style={{ width: '80%', height: '16px', background: '#e0e0e0', borderRadius: '4px' }} />
              </BlockStack>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Analytics" subtitle="Overview of your API key usage">
        <Banner tone="critical">{error}</Banner>
      </Page>
    );
  }

  const statCards = [
    {
      title: 'Total Keys',
      value: stats?.totalKeys || 0,
      icon: KeyIcon,
      description: 'Total API keys created',
    },
    {
      title: 'Active Keys',
      value: stats?.activeKeys || 0,
      icon: CheckCircleIcon,
      description: 'Currently active keys',
    },
    {
      title: 'Requests (24h)',
      value: stats?.requests24h || 0,
      icon: ChartVerticalFilledIcon,
      description: 'API requests in last 24h',
    },
    {
      title: 'Avg Latency',
      value: `${stats?.avgLatencyMs || 0}ms`,
      icon: ClockIcon,
      description: 'Average response time',
    },
  ];

  return (
    <Page title="Analytics" subtitle="Overview of your API key usage and performance">
      <Layout>
        {statCards.map((card) => (
          <Layout.Section variant="oneThird" key={card.title}>
            <LegacyCard title={card.title} sectioned>
              <BlockStack gap="200">
                <InlineStack gap="200" align="start">
                  <div style={{ color: '#5c5f62' }}>
                    {/* @ts-ignore */}
                    <card.icon style={{ width: '20px', height: '20px' }} />
                  </div>
                  <Text as="h2" variant="headingXl">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </Text>
                </InlineStack>
                <Text as="p" tone="subdued">
                  {card.description}
                </Text>
              </BlockStack>
            </LegacyCard>
          </Layout.Section>
        ))}

        <Layout.Section>
          <LegacyCard
            title="Request Trends"
            sectioned
            actions={[
              {
                content: 'Export',
                onAction: () => console.log('Export data'),
              },
            ]}
          >
            <BlockStack gap="400">
              <InlineStack gap="200" align="end">
                <Select
                  label="Time Range"
                  labelHidden
                  options={[
                    { label: 'Last 24 hours', value: '24h' },
                    { label: 'Last 7 days', value: '7d' },
                    { label: 'Last 30 days', value: '30d' },
                  ]}
                  value={timeRange}
                  onChange={setTimeRange}
                />
                <Select
                  label="Chart Type"
                  labelHidden
                  options={[
                    { label: 'Area', value: 'area' },
                    { label: 'Line', value: 'line' },
                    { label: 'Bar', value: 'bar' },
                  ]}
                  value={chartType}
                  onChange={setChartType}
                />
              </InlineStack>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={mockUsageData}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#008060" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#008060" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d72c0d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#d72c0d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stroke="#008060"
                        fillOpacity={1}
                        fill="url(#colorRequests)"
                      />
                      <Area
                        type="monotone"
                        dataKey="errors"
                        stroke="#d72c0d"
                        fillOpacity={1}
                        fill="url(#colorErrors)"
                      />
                    </AreaChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={mockUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#008060"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="errors"
                        stroke="#d72c0d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={mockUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#008060" />
                      <Bar dataKey="errors" fill="#d72c0d" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <LegacyCard title="Key Status Distribution" sectioned>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <LegacyCard title="Top Endpoints" sectioned>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockEndpointData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="endpoint" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#008060" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section>
          <LegacyCard title="Quick Insights" sectioned>
            <BlockStack gap="200">
              <InlineStack gap="400" align="start">
                <div>
                  <Text as="p" variant="headingMd">+23%</Text>
                  <Text as="p" tone="subdued">vs last week</Text>
                </div>
                <div>
                  <Text as="p" variant="headingMd">99.2%</Text>
                  <Text as="p" tone="subdued">Uptime</Text>
                </div>
                <div>
                  <Text as="p" variant="headingMd">45ms</Text>
                  <Text as="p" tone="subdued">Avg response</Text>
                </div>
                <div>
                  <Text as="p" variant="headingMd">1.2%</Text>
                  <Text as="p" tone="subdued">Error rate</Text>
                </div>
              </InlineStack>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
