'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ApiKeyStats } from '@/lib/types';
import { Key, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export function StatsCards({ stats }: { stats: ApiKeyStats }) {
  const cardData = [
    {
      title: 'Total Keys',
      value: stats.totalKeys,
      icon: <Key className="h-4 w-4 text-muted-foreground" />,
      description: 'Total number of API keys created.',
    },
    {
      title: 'Active Keys',
      value: stats.activeKeys,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      description: 'Keys that are currently active.',
    },
    {
      title: 'Total Requests (24h)',
      value: stats.requests24h,
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
      description: 'API requests in the last 24 hours.',
    },
    {
      title: 'Avg. Latency (ms)',
      value: stats.avgLatencyMs,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      description: 'Average response time.',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
