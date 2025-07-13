import { NextRequest, NextResponse } from 'next/server';
import { GetFileFacde } from './get-file.facade';
import { GetFileParams, GetFileParamsSchema } from './get-file.request';
import {
  UpdateFileParams,
  UpdateFileParamsSchema,
  UpdateFileRequestSchema,
} from './update-file.request';
import { UpdateFileCommand, UpdateFileFacade } from './update-file.facade';

export async function GET(_req: NextRequest, { params }: { params: GetFileParams }) {
  try {
    const request = GetFileParamsSchema.parse(params);
    const facade = new GetFileFacde();
    const response = await facade.get(request);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: UpdateFileParams }) {
  try {
    const { id } = UpdateFileParamsSchema.parse(await params);
    const body = await req.json();
    const request = UpdateFileRequestSchema.parse(body);
    const facade = new UpdateFileFacade();
    await facade.update({
      id,
      content: request.content,
    } satisfies UpdateFileCommand);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
