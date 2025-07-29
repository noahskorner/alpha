import { NextRequest, NextResponse } from 'next/server';
import { CreateOrganizationRequestSchema } from './create-organization.request';
import { CreateOrganizationFacade } from './create-organization.facade';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const request = CreateOrganizationRequestSchema.parse(body);
    const facade = new CreateOrganizationFacade();
    const response = await facade.create({ ...request, userId: session.user.id });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
