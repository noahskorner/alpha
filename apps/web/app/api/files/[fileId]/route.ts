import { NextRequest, NextResponse } from 'next/server';
import { GetFileFacde } from './get-file.facade';
import { GetFileParams, GetFileParamsSchema } from './get-file.request';

export async function GET(_req: NextRequest, { params }: { params: Promise<GetFileParams> }) {
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
