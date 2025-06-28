import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateNodeRequestSchema } from '../nodes/create-node.request';
import { CreateNodeResponseSchema } from '../nodes/create-node.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'beta api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/nodes': {
        post: {
          summary: 'Create node',
          tags: ['Node'],
          requestBody: {
            content: {
              'application/json': { schema: CreateNodeRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateNodeResponseSchema,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(document);
}
