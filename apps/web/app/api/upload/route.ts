import { NextRequest } from 'next/server';
import DocumentIntelligence, {
  AnalyzeOperationOutput,
  getLongRunningPoller,
  isUnexpected,
} from '@azure-rest/ai-document-intelligence';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const file = form.get('pdf');
    const name = form.get('name');

    if (!(file instanceof File) || typeof name !== 'string' || !name) {
      return new Response(JSON.stringify({ error: 'Missing pdf or name' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Convert File -> base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Source = Buffer.from(arrayBuffer).toString('base64');

    // Create client with API key auth
    const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT!;
    const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY!;
    if (!endpoint || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing DOCUMENT_INTELLIGENCE_* env vars' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const client = DocumentIntelligence(endpoint, { key: apiKey }); // API key auth :contentReference[oaicite:1]{index=1}

    // Kick off analysis with prebuilt-layout (works for native/scanned PDFs)
    const initial = await client.path('/documentModels/{modelId}:analyze', 'prebuilt-layout').post({
      contentType: 'application/json',
      body: { base64Source },
      queryParameters: {
        outputContentFormat: 'markdown', // return content in Markdown
        features: ['keyValuePairs', 'queryFields'], // turn on KVPs + query fields
        // Optional: fields you care about (free text labels)
        // queryFields: ['Email', 'Phone', 'Date', 'Total'],
        // You can also pass `locale`, `pages`, etc., if helpful
      },
    });

    if (isUnexpected(initial)) {
      return new Response(JSON.stringify(initial.body), {
        status: parseInt(initial.status),
        headers: { 'content-type': 'application/json' },
      });
    }

    // Poll until the long-running operation completes
    const poller = getLongRunningPoller(client, initial); // LRO helper :contentReference[oaicite:2]{index=2}
    const result = (await poller.pollUntilDone()).body as AnalyzeOperationOutput;

    // Return everything (your page prints it nicely)
    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Upload/Analyze error:', err);
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
