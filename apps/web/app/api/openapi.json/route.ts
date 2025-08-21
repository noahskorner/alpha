import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateOrganizationRequestSchema } from '../organizations/create-organization.request';
import { CreateOrganizationResponseSchema } from '../organizations/create-organization.response';
import { CreateFileRequestSchema } from '../files/create-file.request';
import { CreateFileResponseSchema } from '../files/create-file.response';

export async function GET() {
  const document = createDocument({
    openapi: '3.1.0',
    info: {
      title: 'alpha api docs',
      version: '1.0.0',
    },
    paths: {
      '/api/organizations': {
        post: {
          summary: 'Create organization',
          tags: ['Organizations'],
          requestBody: {
            content: {
              'application/json': { schema: CreateOrganizationRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
              content: {
                'application/json': {
                  schema: CreateOrganizationResponseSchema,
                },
              },
            },
          },
        },
      },
      '/api/files': {
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
    },
  });

  return NextResponse.json(document);
}
