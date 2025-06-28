import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateFileRequestSchema } from '../files/create-file.request';
import { CreateFileResponseSchema } from '../files/create-file.response';
import { FindFilesResponseSchema } from '../files/find-files.response';
import { GetFileParamsSchema } from '../files/[fileId]/get-file.request';
import { GetFileResponseSchema } from '../files/[fileId]/get-file.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'beta api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/files': {
        get: {
          summary: 'Find files',
          tags: ['Files'],
          responses: {
            '200': {
              description: '200 OK',
              content: {
                'application/json': {
                  schema: FindFilesResponseSchema,
                },
              },
            },
          },
        },
        post: {
          summary: 'Create file',
          tags: ['Files'],
          requestBody: {
            content: {
              'application/json': { schema: CreateFileRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateFileResponseSchema,
                },
              },
            },
          },
        },
      },
      '/api/files/{id}': {
        get: {
          summary: 'Get a file',
          tags: ['Files'],
          requestParams: { path: GetFileParamsSchema },
          responses: {
            '200': {
              description: 'File found',
              content: {
                'application/json': {
                  schema: GetFileResponseSchema,
                },
              },
            },
            '404': {
              description: 'File not found',
            },
          },
        },
      },
    },
  });

  return NextResponse.json(document);
}
