import { z } from 'zod';

export const CreateFileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  contentType: z.string(),
  url: z.string().url(),
});

export type CreateFileResponse = z.infer<typeof CreateFileResponseSchema>;
