import { prismaClient } from '../prisma';
import { CreateNodeRequest } from './create-node.request';
import { CreateNodeResponse } from './create-node.response';

export class CreateNodeFacade {
  public async create(request: CreateNodeRequest): Promise<CreateNodeResponse> {
    const node = await prismaClient.node.create({
      data: {
        name: request.name,
        path: request.path,
        isFolder: request.isFolder ?? false,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        path: true,
        name: true,
        isFolder: true,
      },
    });

    return {
      id: node.id,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      path: node.path,
      name: node.name,
      isFolder: node.isFolder,
    } satisfies CreateNodeResponse;
  }
}
