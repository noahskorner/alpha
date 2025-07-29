import { z } from '@/app/utils/zod';

export const CreateOrganizationRequestSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: 'Organization name must be at least 2 characters.',
      })
      .max(50, {
        message: 'Organization name must not be longer than 50 characters.',
      })
      .regex(/^[a-zA-Z0-9\s-_]+$/, {
        message:
          'Organization name can only contain letters, numbers, spaces, hyphens, and underscores.',
      })
      .openapi({
        description: 'Name of the organization',
        example: 'My Organization',
      }),
  })
  .openapi({
    title: 'CreateOrganizationRequest',
  });

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;
