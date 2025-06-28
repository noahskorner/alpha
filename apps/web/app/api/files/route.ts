import { NextRequest, NextResponse } from 'next/server';
import { CreateFileFacade } from './create-file.facade';
import { CreateFileRequestSchema } from './create-file.request';
import { FindFilesFacade } from './find-files.facade';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateFileRequestSchema.parse(body);
    const facade = new CreateFileFacade();
    const response = await facade.create(parsed);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const facade = new FindFilesFacade();
    const response = await facade.find();
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
