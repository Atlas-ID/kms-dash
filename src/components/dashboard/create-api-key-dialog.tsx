'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createApiKeySchema, type CreateApiKeySchema } from '@/lib/schemas';
import { useSileo } from '@/hooks/use-sileo';
import { ApiKeyGeneratedDialog } from './api-key-generated-dialog';

const availableScopes = ['read', 'write', 'delete', 'admin'];

export function CreateApiKeyDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showGeneratedKeyDialog, setShowGeneratedKeyDialog] = useState(false);

  const { success } = useSileo();

  const form = useForm<CreateApiKeySchema>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      description: '',
      scopes: [],
    },
  });

  const onSubmit = (values: CreateApiKeySchema) => {
    console.log('Creating API Key with values:', values);
    
    // In a real app, you would make an API call here.
    // For now, we'll simulate it and generate a random key.
    const newKey = `kms_${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}`;

    setGeneratedKey(newKey);
    setShowGeneratedKeyDialog(true);
    setOpen(false);
    form.reset();
    success('API Key Created', `The key "${values.name}" has been successfully created.`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Configure and generate a new API key.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., My Awesome App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scopes"
                render={() => (
                  <FormItem>
                    <FormLabel>Scopes/Permissions</FormLabel>
                    <div className="grid grid-cols-2 gap-2 rounded-md border p-2">
                      {availableScopes.map((scope) => (
                        <FormField
                          key={scope}
                          control={form.control}
                          name="scopes"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(scope)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          scope,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== scope
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {scope}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this key will be used for."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Generate API Key</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {generatedKey && (
        <ApiKeyGeneratedDialog
          apiKey={generatedKey}
          open={showGeneratedKeyDialog}
          onOpenChange={setShowGeneratedKeyDialog}
        />
      )}
    </>
  );
}
