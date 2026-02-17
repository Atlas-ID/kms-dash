'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useSileo } from '@/hooks/use-sileo';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ApiKeyGeneratedDialogProps = {
  apiKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ApiKeyGeneratedDialog({
  apiKey,
  open,
  onOpenChange,
}: ApiKeyGeneratedDialogProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { success } = useSileo();

  const handleCopy = () => {
    copyToClipboard(apiKey);
    success('API Key Copied', 'Your API key has been copied to clipboard.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key Generated Successfully</DialogTitle>
          <DialogDescription>
            Your new API key has been created. Please save it securely.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This is the only time you will see this key. You cannot recover it.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="new-api-key">Your New API Key</Label>
            <div className="relative">
              <Input
                id="new-api-key"
                type="text"
                value={apiKey}
                readOnly
                className="pr-10 font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={handleCopy}
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
