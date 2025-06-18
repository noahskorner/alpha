import { NextResponse } from 'next/server';
import { createDocument } from 'zod-openapi';
import {
  GetOrganizationParamsSchema,
  GetOrganizationResponseSchema,
} from '../organizations/[id]/route';
import { CreateOrganizationRequestSchema } from '../organizations/route';

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
          tags: ['Organization'],
          requestBody: {
            content: {
              'application/json': { schema: CreateOrganizationRequestSchema },
            },
          },
          responses: {
            '201': {
              description: '201 Created',
            },
          },
        },
      },
      '/api/organizations/{id}': {
        get: {
          summary: 'Get organization',
          tags: ['Organization'],
          requestParams: { path: GetOrganizationParamsSchema },
          responses: {
            '200': {
              description: '200 OK',
              content: {
                'application/json': { schema: GetOrganizationResponseSchema },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(document);
}
