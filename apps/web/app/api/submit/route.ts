import { NextResponse } from 'next/server';
import { fillPdfFromAnswers } from './fill-pdf-from-answers';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const pdfPath = process.cwd() + '/app/api/submit/form.pdf';
    const pdfBytes = await fs.readFile(pdfPath);

    const dataPath = process.cwd() + '/app/api/submit/data.json';
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    const { pages, keyValuePairs, form, answers } = data;

    const filledBytes = await fillPdfFromAnswers({
      pdfBytes,
      pages: pages,
      keyValuePairs: keyValuePairs,
      form: form,
      answers: answers,
    });

    // Save to disk
    await fs.writeFile('output.pdf', filledBytes);
    console.log('Saved to output.pdf');
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
