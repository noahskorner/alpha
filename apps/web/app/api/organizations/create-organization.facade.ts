import { prisma } from '../../prisma';
import { CreateOrganizationCommand } from './create-organization.command';
import { CreateOrganizationResponse } from './create-organization.response';

export class CreateOrganizationFacade {
  public async create(request: CreateOrganizationCommand): Promise<CreateOrganizationResponse> {
    // Ensure the organization name is unique
    const existingOrganization = await prisma.organization.findUnique({
      where: {
        name_userId: {
          name: request.name,
          userId: request.userId,
        },
      },
      select: { id: true },
    });
    if (existingOrganization) {
      throw new Error('Organization with this name already exists.');
    }

    // Persist the organization in the database
    const organization = await prisma.organization.create({
      data: {
        name: request.name,
        userId: request.userId,
      },
    });
    return organization satisfies CreateOrganizationResponse;
  }
}
