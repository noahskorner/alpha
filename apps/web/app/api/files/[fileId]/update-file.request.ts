import { z } from '@/app/utils/zod';

export const UpdateFileRequestSchema = z
  .object({
    content: z.string().optional().openapi({
      description: 'Content of the node',
      example: '# This is markdown',
    }),
  })
  .openapi({
    title: 'UpdateFileRequest',
  });

export type UpdateFileRequest = z.infer<typeof UpdateFileRequestSchema>;
