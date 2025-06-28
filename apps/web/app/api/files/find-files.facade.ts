import { prismaClient } from '../prisma';
import { FindFilesResponse } from './find-files.response';

export class FindFilesFacade {
  public async find(): Promise<FindFilesResponse> {
    const files = await prismaClient.file.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        path: true,
        isFolder: true,
      },
    });

    return {
      files: files,
    } satisfies FindFilesResponse;
  }
}
