import { splitFileExtension } from '@/app/utils/split-file-extension';
import { PRISMA } from '../../prisma';
import { CreateFileRequest } from './create-file.request';
import { CreateFileResponse } from './create-file.response';
import { getContainerClient } from '../../container-client';

export class CreateFileFacade {
  public async create(request: CreateFileRequest): Promise<CreateFileResponse> {
    // Get a unique path for the file
    const uniquePath = await this.getUniquePath(request.path);

    // Persist the file to database
    const file = await PRISMA.file.create({
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

    // Persist the file to azurite
    if (!request.isFolder) {
      const containerClient = await getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient(file.path);
      await blockBlobClient.upload('', 0); // Empty file
    }

    // Return the created file
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
      const existing = await PRISMA.file.findFirst({
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
