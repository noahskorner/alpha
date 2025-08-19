'use server';

import { CreateOrganizationFacade } from '@/app/api/organizations/create-organization.facade';
import { CreateOrganizationRequestSchema } from '@/app/api/organizations/create-organization.request';
import { auth } from '@/app/auth';
import { z } from '@/app/utils/zod';
import { getServerSession } from 'next-auth';

export async function createOrganizationAction(
  values: z.infer<typeof CreateOrganizationRequestSchema>
) {
  const session = await getServerSession(auth);
  console.log(session);
  const userId = session?.user.id;
  if (userId == null) {
    throw new Error('User is not authenticated');
  }

  const facade = new CreateOrganizationFacade();
  return await facade.create({ ...values, userId: userId });
}
