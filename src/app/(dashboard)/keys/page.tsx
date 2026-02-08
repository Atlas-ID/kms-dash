import { ApiKeyTable } from '@/components/dashboard/api-key-table';
import { PageHeader } from '@/components/shared/page-header';
import { apiKeys } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateApiKeyDialog } from '@/components/dashboard/create-api-key-dialog';

export default function ApiKeysPage() {
  // In a real app, you'd fetch this data from an API.
  const keys = apiKeys;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="API Keys"
        description="Manage and monitor your API keys."
      >
        <CreateApiKeyDialog>
          <Button>
            <PlusCircle />
            Create New Key
          </Button>
        </CreateApiKeyDialog>
      </PageHeader>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <ApiKeyTable data={keys} />
      </main>
    </div>
  );
}
