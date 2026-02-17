'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { useSileo } from '@/hooks/use-sileo';
import type { ApiKey } from '@/lib/types';
import { DeleteApiKeyDialog } from './delete-api-key-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ApiKeyTableActionsProps {
  apiKey: ApiKey;
}

export function ApiKeyTableActions({ apiKey }: ApiKeyTableActionsProps) {
  const { success, error } = useSileo();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  const onCopy = () => {
    navigator.clipboard.writeText(maskKey(apiKey.key));
    success('Copied to clipboard', 'Masked API key has been copied.');
  };

  return (
    <>
      <DeleteApiKeyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        apiKeyName={apiKey.name}
        onDelete={() => {
          console.log(`Deleting ${apiKey.name}`);
          success(`Key "${apiKey.name}" deleted.`);
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/keys/${apiKey.id}`)}>
            <Eye />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>
            <Copy />
            Copy Key (Masked)
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
