import { z } from '@/app/utils/zod';

export const CreateFileResponseSchema = z
  .object({
    id: z.string().openapi({
      description: 'Unique identifier for the file',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    createdAt: z.date().openapi({
      description: 'Creation timestamp of the file',
      example: '2023-10-01T12:00:00Z',
    }),
    updatedAt: z.date().openapi({
      description: 'Last update timestamp of the file',
      example: '2023-10-01T12:00:00Z',
    }),
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
    title: 'CreateFileResponse',
  });

export type CreateFileResponse = z.infer<typeof CreateFileResponseSchema>;
