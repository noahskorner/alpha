import { z } from '@/app/utils/zod';

export const UpdateFileParamsSchema = z.object({
  id: z.string(),
});
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
export type UpdateFileParams = z.infer<typeof UpdateFileParamsSchema>;
export type UpdateFileRequest = z.infer<typeof UpdateFileRequestSchema>;
