import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../prisma';
import { getContainerClient } from '../../container-client';
import { uuid } from '@/app/utils/uuid';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/auth';
import { CreateFileResponse } from './create-file.response';

export async function POST(req: NextRequest) {
  // Authenticate the user
  const session = await getServerSession(auth);
  if (!session || !session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate the request
  const request = await req.formData();
  const file = request.get('file');
  const name = request.get('name');
  const contentType = request.get('contentType');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file content.' }, { status: 400 });
  }
  if (typeof name !== 'string') {
    return NextResponse.json({ error: 'Missing file name.' }, { status: 400 });
  }
  if (typeof contentType !== 'string') {
    return NextResponse.json({ error: 'Missing content type.' }, { status: 400 });
  }

  // Create the command
  const id = uuid();
  const createdOn = new Date();
  const updatedOn = createdOn;
  const createdBy = session.user.id;
  const updatedBy = createdBy;

  // Convert File -> base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer).toString('base64');

  // Upload file to Azure/Azurite first
  const containerClient = await getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(`${id}/${name}`);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  // Persist metadata to DB
  const fileRecord = await prisma.file.create({
    data: {
      id,
      name,
      contentType,
      url: blockBlobClient.url,
      createdOn: createdOn,
      updatedOn: updatedOn,
      createdBy: createdBy,
      updatedBy: updatedBy,
    },
  });

  return NextResponse.json(
    {
      id: fileRecord.id,
      name: fileRecord.name,
      contentType: fileRecord.contentType,
      url: fileRecord.url,
    } satisfies CreateFileResponse,
    { status: 201 }
  );
}
