import { z } from 'zod';

export const CreateFileRequestSchema = z.object({
  file: z.instanceof(File, { message: 'Missing file content.' }),
  name: z.string({ required_error: 'Missing file name.' }),
  contentType: z.string({ required_error: 'Missing content type.' }),
});

export type CreateFileRequest = z.infer<typeof CreateFileRequestSchema>;
