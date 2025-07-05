import { PRISMA } from '../../../prisma';
import { GetFileParams } from './get-file.request';
import { GetFileResponse } from './get-file.response';

export class GetFileFacde {
  public async get(request: GetFileParams): Promise<GetFileResponse | null> {
    return await PRISMA.file.findUnique({
      where: {
        id: request.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        path: true,
        isFolder: true,
        content: true,
      },
    });
  }
}
