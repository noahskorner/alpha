import { splitFileExtension } from '@/app/utils/split-file-extension';
import { prismaClient } from '../prisma';
import { CreateFileRequest } from './create-file.request';
import { CreateFileResponse } from './create-file.response';

export class CreateFileFacade {
  public async create(request: CreateFileRequest): Promise<CreateFileResponse> {
    const uniquePath = await this.getUniquePath(request.path);

    const file = await prismaClient.file.create({
      data: {
        path: uniquePath,
        isFolder: request.isFolder ?? false,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        path: true,
        isFolder: true,
      },
    });

    return {
      id: file.id,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      path: file.path,
      isFolder: file.isFolder,
    } satisfies CreateFileResponse;
  }

  private async getUniquePath(path: string): Promise<string> {
    const { path: basePath, extension } = splitFileExtension(path);

    let uniquePath = path;
    let counter = 1;

    while (true) {
      const existing = await prismaClient.file.findFirst({
        where: {
          path: uniquePath,
        },
        select: {
          path: true,
        },
      });

      if (existing == null) {
        return uniquePath;
      }

      // Build the next path with incremented counter
      uniquePath = `${basePath}(${counter})${extension ? `.${extension}` : ''}`;
      counter++;
    }
  }
}
