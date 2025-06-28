import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '../prisma';
import { CreateNodeRequestSchema } from './create-node.request';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateNodeRequestSchema.parse(body);

    const node = await prismaClient.node.create({
      data: {
        name: parsed.name,
        isFolder: parsed.isFolder ?? false,
        path: parsed.path,
      },
      select: {
        id: true,
        name: true,
        isFolder: true,
        path: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(node, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
