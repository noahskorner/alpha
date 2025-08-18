import type { AnalyzeOperationOutput } from '@azure-rest/ai-document-intelligence';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { toAnalysis } from './to-analysis';
import { Form, Page, PageSchema } from './form';
import { writeFile } from 'fs/promises';
import { uuid } from '@/app/utils/uuid';

const prompt =
  `You are given a compact summary of an Azure Document Intelligence analysis.\n` +
  `Infer a clean JSON "Form" with distinct, user-facing questions.\n` +
  `Rules:\n` +
  `- Deduplicate labels and merge across pages.\n` +
  `- Choose a concise, machine-safe 'name' (lower_snake_case) for each question.\n` +
  `- Map to one of the allowed types: short_text, long_text, number, date, time, email, url, boolean, select_one, select_many, signature, initial.\n` +
  `- Use type hints (e.g., selection_mark => boolean, selection_group => select_one/select_many, signature => signature, date/time/number heuristics, email/url regex).\n` +
  `- If a label implies options (e.g., a selection group), include 'options'.\n` +
  `- If regex is obvious (email, url, phone), put it in validation.pattern.\n` +
  `- For each question and option, include one or more 'anchors' that reference back to the source analysis.\n` +
  `  * If from a key-value pair, set 'keyId'/'valueId' where available.\n` +
  `  * If from a selection mark, set 'selectionMarkId'.\n` +
  `  * If from a line, set 'lineId'.\n` +
  `- Keep it faithful to the document; avoid hallucinating fields.\n`;

/**
 * Main entry: build prompt -> call OpenAI with structured output -> return & log
 */
export async function extractForm(analysis: AnalyzeOperationOutput): Promise<Form> {
  console.log('Extracting form from analysis:', JSON.stringify(analysis, null, 2));

  // Strip the Azure Document Intelligence analysis to the relevant parts
  const analysisStripped = toAnalysis(analysis);
  console.log('Stripped analysis:', JSON.stringify(analysisStripped.pages, null, 2));

  // Compile the JSON format
  const format = zodTextFormat(PageSchema, 'form_extraction');

  // Create the requests
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const promises = analysisStripped.pages.map(async (curr) => {
    const response = await openai.responses.parse({
      model: 'gpt-5',
      input: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content:
            'Produce a single JSON object matching the Form schema. Base it strictly on this analysis:',
        },
        { role: 'user', content: JSON.stringify(curr) },
      ],
      text: { format },
    });

    const page = response.output_parsed as Page | null;
    if (!page) {
      console.warn(`Unable to parse page ${curr.id}`);
      return null;
    }
    return page;
  });
  const pages = (await Promise.all(promises)).filter((p): p is Page => p !== null);
  const form: Form = {
    pages: pages,
  };
  await writeFile(
    `${uuid()}.json`,
    JSON.stringify(
      {
        pages: analysis.analyzeResult?.pages,
        keyValuePairs: analysis.analyzeResult?.keyValuePairs,
        form,
      },
      null,
      2
    )
  );
  return form;
}
