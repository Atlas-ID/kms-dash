'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useAuth } from '@/hooks/use-auth';
import { useSileo } from '@/hooks/use-sileo';

const FormSchema = z.object({
  adminKey: z.string().min(1, 'Admin Key cannot be empty.'),
});

export function SettingsForm() {
  const { adminKey, setAdminKey } = useAuth();
  const { success } = useSileo();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      adminKey: adminKey || '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setAdminKey(data.adminKey);
    success('Settings Updated', 'Your Admin API Key has been successfully updated.');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Admin Configuration</CardTitle>
            <CardDescription>
              Update your administrative API key here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="adminKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new secret admin key"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This key is stored in your browser's local storage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
