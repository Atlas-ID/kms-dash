'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { suggestApiKeyScopes, SuggestApiKeyScopesOutput } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export function SuggestScopesForm() {
  const [description, setDescription] = React.useState('');
  const [result, setResult] = React.useState<SuggestApiKeyScopesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await suggestApiKeyScopes({ description });
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('An error occurred while getting suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Describe Key Usage</CardTitle>
            <CardDescription>
              Explain what you need the API key for, and we'll suggest the
              most secure set of permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'A service to read user profiles and update their avatars, but not delete them.'"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isLoading || !description.trim()}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wand2 />
              )}
              {isLoading ? 'Thinking...' : 'Suggest Scopes'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Suggestions</CardTitle>
            <CardDescription>
              Based on your description, here are the recommended scopes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Suggested Scopes</h4>
              <div className="flex flex-wrap gap-2">
                {result.suggestedScopes.map((scope) => (
                  <Badge key={scope} variant="default">{scope}</Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="mb-2 font-semibold">Reasoning</h4>
              <p className="text-sm text-muted-foreground">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
