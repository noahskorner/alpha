import { z } from '@/app/utils/zod';

export const CreateNodeRequestSchema = z
  .object({
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
    title: 'CreateNodeRequest',
  });

export type CreateNodeRequest = z.infer<typeof CreateNodeRequestSchema>;
