'use server';

export interface SuggestApiKeyScopesInput {
  description: string;
}

export interface SuggestApiKeyScopesOutput {
  suggestedScopes: string[];
  reasoning: string;
}

export async function suggestApiKeyScopes(input: SuggestApiKeyScopesInput): Promise<SuggestApiKeyScopesOutput> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/ai/scopes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to get scope suggestions');
  }

  return response.json();
}
