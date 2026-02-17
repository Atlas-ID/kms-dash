'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { KeyRound, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';

const FormSchema = z.object({
  adminKey: z.string().min(1, {
    message: 'Admin Key is required.',
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showKey, setShowKey] = React.useState(false);
  const [error, setError] = React.useState('');
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
    setError('');

    try {
      apiClient.setToken(data.adminKey);
      await apiClient.getApiKeys();

      setAdminKey(data.adminKey);
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/keys');
    } catch (err) {
      console.error(err);
      apiClient.setToken('');
      setError('Invalid Admin Key or insufficient permissions.');
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'The provided Admin Key is invalid or lacks permissions.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const adminKey = form.watch('adminKey');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Admin API Key
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors">
            <KeyRound className="h-5 w-5" />
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="Enter your secret admin key"
            {...form.register('adminKey')}
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {form.formState.errors.adminKey && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.adminKey.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          This key is required to access the admin dashboard
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !adminKey}
        className="w-full relative overflow-hidden rounded-xl px-6 py-4 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        style={{
          background: 'linear-gradient(135deg, hsl(251, 91%, 58%) 0%, hsl(280, 87%, 55%) 100%)',
          boxShadow: isLoading ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.4)',
        }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>

      {/* Remember checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 peer-checked:border-violet-500 peer-checked:bg-violet-500 transition-all" />
          <svg
            className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          Remember this device
        </span>
      </label>
    </form>
  );
}
