'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  adminKey: z.string().min(1, {
    message: 'Admin Key is required.',
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setAdminKey } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      adminKey: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    // In a real app, you would validate the key against an API endpoint.
    // e.g., await fetch('/api/verify-admin', { body: JSON.stringify(data) })
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For this demo, we'll assume any non-empty key is valid.
    if (data.adminKey) {
      setAdminKey(data.adminKey);
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/keys');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'The provided Admin Key is invalid.',
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="adminKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin API Key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your secret admin key"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This key is required to access the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? 'Verifying...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
