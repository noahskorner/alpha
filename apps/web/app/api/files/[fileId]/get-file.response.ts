import { z } from '@/app/utils/zod';

export const GetFileResponseSchema = z
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
    content: z.string().nullable().openapi({
      description: 'Content of the file, if applicable',
      example: '# This is a markdown file.',
    }),
  })
  .openapi({
    title: 'GetFileResponse',
  });

export type GetFileResponse = z.infer<typeof GetFileResponseSchema>;
