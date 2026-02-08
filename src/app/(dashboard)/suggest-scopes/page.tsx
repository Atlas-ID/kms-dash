import { PageHeader } from '@/components/shared/page-header';
import { SuggestScopesForm } from '@/components/dashboard/suggest-scopes-form';

export default function SuggestScopesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Suggest Scopes"
        description="Use AI to get optimal scope recommendations for your new API key."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <SuggestScopesForm />
        </div>
      </main>
    </div>
  );
}
