import { getContainerClient } from '@/app/container-client';
import { PRISMA } from '../../../prisma';
import { GetFileResponse } from './get-file.response';

export interface GetFileCommand {
  id: string;
}

export class GetFileFacade {
  public async get({ id }: GetFileCommand): Promise<GetFileResponse | null> {
    const file = await PRISMA.file.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        path: true,
        isFolder: true,
      },
    });

    const containerClient = await getContainerClient();
    const blobClient = containerClient.getBlobClient(file.path);
    const downloadBlockBlobResponse = await blobClient.download();
    const content = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody ?? null);

    return {
      id: file.id,
      isFolder: file.isFolder,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      path: file.path,
      content: content.toString(),
    };
  }

  private async streamToBuffer(readableStream: NodeJS.ReadableStream | null): Promise<Buffer> {
    if (!readableStream) return Buffer.alloc(0);
    const chunks: Buffer[] = [];
    for await (const chunk of readableStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
