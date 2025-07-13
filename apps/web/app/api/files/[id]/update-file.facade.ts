import { PRISMA } from '@/app/prisma';
import { getContainerClient } from '../../../container-client';

export interface UpdateFileCommand {
  id: string;
  content: string | undefined;
}

export class UpdateFileFacade {
  public async update({ id, content }: UpdateFileCommand) {
    // Retrieve the file
    const file = await PRISMA.file.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    // Persist the changes to azurite
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(file.path);
    await blockBlobClient.upload(content ?? '', Buffer.byteLength(content ?? ''));

    // Persist the changes to the database
    await PRISMA.file.update({
      where: {
        id: id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
