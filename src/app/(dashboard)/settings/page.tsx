import { SettingsForm } from '@/components/dashboard/settings-form';
import { PageHeader } from '@/components/shared/page-header';

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Manage your admin configuration and preferences."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <SettingsForm />
        </div>
      </main>
    </div>
  );
}
