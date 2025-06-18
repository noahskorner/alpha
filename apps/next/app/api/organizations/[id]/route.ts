import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '../../prisma';
import { z } from '@/app/utils/zod';

export const GetOrganizationParamsSchema = z.object({
  id: z.string(),
});
export type GetOrganizationParams = z.infer<typeof GetOrganizationParamsSchema>;

export const GetOrganizationResponseSchema = z
  .object({
    name: z.string().openapi({ description: 'Name of the organization', example: 'Acme Inc.' }),
  })
  .openapi({
    title: 'GetOrganizationResponse',
  });
export type GetOrganizationResponse = z.infer<typeof GetOrganizationResponseSchema>;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<GetOrganizationParams> }
) {
  const organizationId = (await params).id;

  const organization = await prismaClient.organization.findUnique({
    where: { id: organizationId },
  });
  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  return NextResponse.json(organization);
}
