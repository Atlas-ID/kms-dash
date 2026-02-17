import { PageHeader } from '@/components/shared/page-header';
import { apiKeys } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Trash2, Power } from 'lucide-react';

export default async function ApiKeyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const key = apiKeys.find((k) => k.id === id);

  if (!key) {
    notFound();
  }

  const maskKey = (apiKey: string) => {
    return `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={key.name}
        description={`Details for API key: ${key.name}`}
        showBackButton
      />
      <main className="flex-1 space-y-6 overflow-auto p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
              <CardDescription>
                Core information about this API key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Key</span>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span>{maskKey(key.key)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{key.name}</span>
                </div>
                <Separator />
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">Scopes</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {key.scopes.map((scope) => (
                      <Badge key={scope} variant="secondary">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Timestamps and usage information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Created At
                </span>
                <span className="text-sm font-medium">
                  {new Date(key.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Used</span>
                <span className="text-sm font-medium">
                  {key.lastUsed
                    ? new Date(key.lastUsed).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status & Actions</CardTitle>
              <CardDescription>Current key status and management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={key.active ? 'default' : 'destructive'}
                  className={key.active ? 'bg-green-500' : ''}
                >
                  {key.active ? 'Active' : 'Revoked'}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <RefreshCw />
                  Regenerate
                </Button>
                <Button variant="outline">
                  <Power />
                  {key.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="destructive" className="col-span-2">
                  <Trash2 />
                  Delete Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
