import { z } from '@/app/utils/zod';

export const CreateFileRequestSchema = z
  .object({
    path: z.string().min(1).openapi({
      description: 'Unique path for the file',
      example: '/folder/file.md',
    }),
    isFolder: z.boolean().default(false).openapi({
      description: 'Whether the file is a folder',
      example: false,
    }),
  })
  .openapi({
    title: 'CreateFileRequest',
  });

export type CreateFileRequest = z.infer<typeof CreateFileRequestSchema>;
