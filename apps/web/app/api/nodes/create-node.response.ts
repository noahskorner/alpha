import { z } from '@/app/utils/zod';

export const CreateNodeResponseSchema = z
  .object({
    id: z.string().openapi({
      description: 'Unique identifier for the node',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    createdAt: z.date().openapi({
      description: 'Creation timestamp of the node',
      example: '2023-10-01T12:00:00Z',
    }),
    updatedAt: z.date().openapi({
      description: 'Last update timestamp of the node',
      example: '2023-10-01T12:00:00Z',
    }),
    path: z.string().min(1).openapi({
      description: 'Unique path for the node',
      example: '/folder/file.md',
    }),
    name: z.string().max(64).openapi({
      description: 'Name of the node',
      example: 'file.md',
    }),
    isFolder: z.boolean().default(false).openapi({
      description: 'Whether the node is a folder',
      example: false,
    }),
  })
  .openapi({
    title: 'CreateNodeResponse',
  });

export type CreateNodeResponse = z.infer<typeof CreateNodeResponseSchema>;
