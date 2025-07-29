import { z } from '@/app/utils/zod';

export const CreateOrganizationResponseSchema = z
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
    name: z.string().openapi({
      description: 'Name of the organization',
      example: 'My Organization',
    }),
  })
  .openapi({
    title: 'CreateOrganizationResponse',
  });

export type CreateOrganizationResponse = z.infer<typeof CreateOrganizationResponseSchema>;
