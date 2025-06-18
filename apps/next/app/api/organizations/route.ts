import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '../prisma';
import { z } from '@/app/utils/zod';

export const CreateOrganizationRequestSchema = z
  .object({
    name: z.string().max(64).openapi({
      description: 'Name of the organization',
      example: 'Acme Inc.',
    }),
  })
  .openapi({
    title: 'CreateOrganizationRequest',
  });
export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateOrganizationRequestSchema.parse(body);

    const { id: organizationId } = await prismaClient.organization.create({
      data: {
        name: parsed.name,
      },
      select: {
        id: true,
      },
    });

    return new NextResponse(organizationId, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
