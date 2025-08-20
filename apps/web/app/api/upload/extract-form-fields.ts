import type { AnalyzeOperationOutput } from '@azure-rest/ai-document-intelligence';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { toAnalysis } from './to-analysis';
import { Form, FormSchema } from './form';
import { mkdir, writeFile } from 'fs/promises';
import { uuid } from '@/app/utils/uuid';

const prompt = `
You are given a compact summary of an Azure Document Intelligence analysis.
Your task: infer clean JSON "form fields" with distinct, user-facing questions.

Rules:
- Deduplicate labels and merge across pages.
- Each field must have:
  - name: concise, machine-safe, lower_snake_case
  - type: one of [short_text, long_text, number, date, time, email, url, checkbox, select_one, select_many, signature, initial]
  - anchors: one or more references back to the source analysis
- If a label implies options (e.g., selection group), include an 'options' array.
- For anchors, prefer kinds in this order:
  1. value (input location)
  2. key (label location)
  3. selectionMark (checkboxes)
  4. line (fallback)
- Anchor schema:
  {
    path: string // e.g. key -> "keys/1", value -> "values/1", selectionMark -> "pages/1/selection_marks/1", line -> "pages/1/lines/1"
  }
- Use type hints and heuristics:
  - selection_mark → checkbox
  - selection_group → select_one / select_many
  - signature → signature
  - Detect date, time, number formats
  - Regex: email, url, phone → validation.pattern
- Keep it faithful to the document. Do not hallucinate fields.
`;

/**
 * Main entry: build prompt -> call OpenAI with structured output -> return & log
 */
export async function extractFormFields(analysis: AnalyzeOperationOutput): Promise<Form> {
  // Strip the Azure Document Intelligence analysis to the relevant parts
  const uploadId = uuid();
  const analysisResponse = toAnalysis(analysis);
  await mkdir(`app/api/upload/output/${uploadId}`, { recursive: true });
  await writeFile(
    `app/api/upload/output/${uploadId}/azure-analysis.json`,
    JSON.stringify(analysisResponse.original, null, 2)
  );
  await writeFile(
    `app/api/upload/output/${uploadId}/llm-input.json`,
    JSON.stringify(analysisResponse.result, null, 2)
  );

  // Compile the JSON format
  const format = zodTextFormat(FormSchema, 'form');

  // Create the requests
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const promises = analysisResponse.result.pages.map(async (curr) => {
    const response = await openai.responses.parse({
      model: 'gpt-4o',
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

    const form = response.output_parsed as Form | null;
    if (!form) {
      console.warn(`Unable to parse page ${curr.path}`);
      return null;
    }
    return form;
  });

  const fields = (await Promise.all(promises))
    .filter((f): f is Form => f !== null)
    .flatMap((f) => f.fields);
  const form: Form = { fields };
  await writeFile(
    `app/api/upload/output/${uploadId}/llm-output.json`,
    JSON.stringify(form, null, 2)
  );
  return form;
}
