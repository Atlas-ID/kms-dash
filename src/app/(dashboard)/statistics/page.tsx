import { PageHeader } from '@/components/shared/page-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { UsageChart } from '@/components/dashboard/usage-chart';
import { stats, usageData } from '@/lib/data';

export default function StatisticsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Statistics"
        description="An overview of your API key usage and performance."
      />
      <main className="flex-1 space-y-6 overflow-auto p-4 md:p-6">
        <StatsCards stats={stats} />
        <UsageChart data={usageData} />
      </main>
    </div>
  );
}
