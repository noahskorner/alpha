import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import { CreateOrganizationRequestSchema } from '../organizations/create-organization.request';
import { CreateOrganizationResponseSchema } from '../organizations/create-organization.response';

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
          summary: 'Create file',
          tags: ['Files'],
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
    },
  });

  return NextResponse.json(document);
}
