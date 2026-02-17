import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ScopeSuggestion {
  suggestedScopes: string[];
  reasoning: string;
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Get Cloudflare AI binding from environment
    const ai = (request as any).env?.AI;

    if (!ai) {
      // Fallback: return basic suggestions without AI
      const fallbackScopes = inferScopesFromDescription(description);
      return NextResponse.json(fallbackScopes);
    }

    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: `You are an expert in API key security and access control. 
Based on the provided description of the API key's intended use, suggest the optimal scopes and permissions.

Available scopes: read, write, delete, admin

Respond ONLY with valid JSON in this exact format:
{
  "suggestedScopes": ["scope1", "scope2"],
  "reasoning": "explanation of why these scopes are needed"
}`,
        },
        {
          role: 'user',
          content: `Description: ${description}`,
        },
      ],
    });

    const content = response.response || '';

    // Try to parse JSON from the response
    let result: ScopeSuggestion;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) ||
                       content.match(/```([\s\S]*?)```/) ||
                       [null, content];
      const jsonStr = jsonMatch[1] || content;
      result = JSON.parse(jsonStr.trim());
    } catch {
      // Fallback if AI doesn't return valid JSON
      result = inferScopesFromDescription(description);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in scopes API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function inferScopesFromDescription(description: string): ScopeSuggestion {
  const desc = description.toLowerCase();
  const scopes: string[] = ['read'];

  if (desc.includes('write') || desc.includes('create') || desc.includes('update') || desc.includes('post')) {
    scopes.push('write');
  }
  if (desc.includes('delete') || desc.includes('remove')) {
    scopes.push('delete');
  }
  if (desc.includes('admin') || desc.includes('manage') || desc.includes('all')) {
    scopes.push('admin');
  }

  return {
    suggestedScopes: scopes,
    reasoning: `Based on the description "${description}", the suggested scopes are: ${scopes.join(', ')}. These permissions should provide the necessary access for the described use case.`,
  };
}
