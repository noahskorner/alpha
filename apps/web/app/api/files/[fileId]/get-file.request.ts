import { z } from '@/app/utils/zod';

export const GetFileParamsSchema = z.object({
  id: z.string(),
});
export type GetFileParams = z.infer<typeof GetFileParamsSchema>;
