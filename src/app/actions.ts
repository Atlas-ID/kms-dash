// @/app/actions.ts
'use server';

import { suggestApiKeyScopes as suggestApiKeyScopesFlow, SuggestApiKeyScopesInput, SuggestApiKeyScopesOutput } from '@/ai/flows/suggest-api-key-scopes';

export async function suggestApiKeyScopes(input: SuggestApiKeyScopesInput): Promise<SuggestApiKeyScopesOutput> {
  return await suggestApiKeyScopesFlow(input);
}
