import * as z from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required.'),
  description: z.string().optional(),
  scopes: z
    .array(z.string())
    .min(1, 'At least one scope must be selected.'),
});

export type CreateApiKeySchema = z.infer<typeof createApiKeySchema>;
