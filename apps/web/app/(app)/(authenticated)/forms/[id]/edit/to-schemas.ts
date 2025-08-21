import { OriginalAnalysis } from '@/app/api/upload/analysis';
import { Anchor, AnchorKind, Form, FormField, FormFieldType } from '@/app/api/upload/form';
import { BoundingRegionOutput } from '@azure-rest/ai-document-intelligence';
import type { Schema } from '@pdfme/common';

export type SchemaType =
  | 'text'
  | 'multiVariableText'
  | 'image'
  | 'table'
  | 'select'
  | 'date'
  | 'time'
  | 'dateTime'
  | 'checkbox'
  | 'radioGroup';

export function toSchemas(form: Form, analysis: OriginalAnalysis): Array<Schema> {
  const all: Schema[] = [];

  for (const question of form.fields) {
    const regions = collectRegionsForQuestion(question, analysis);

    // If we got nothing resolvable, emit a single default box so authors can move it.
    const effectiveRegions = regions.length > 0 ? regions : [defaultRegion()];

    const isSplit = effectiveRegions.length > 1;

    for (const r of effectiveRegions) {
      const schema: Schema = {
        name: question.name,
        type: toType(question.type),
        content: '', // not sure yet
        position: { x: r.x, y: r.y },
        width: r.width,
        height: r.height,
        rotate: 0,
        opacity: 1,
        readOnly: question.readOnly ?? false,
        required: question.required ?? false,
        __bodyRange: { start: 0, end: 12 },
        __isSplit: isSplit,
      };

      all.push(schema);
    }
  }

  return all;
}

export function toType(type: FormFieldType): SchemaType {
  switch (type) {
    case 'short_text':
      return 'text';
    case 'long_text':
      return 'multiVariableText';
    case 'number':
      return 'text'; // TODO: Might need a custom type for numbers
    case 'date':
      return 'date';
    case 'time':
      return 'time';
    case 'email':
      return 'text';
    case 'url':
      return 'text';
    case 'checkbox':
      return 'checkbox';
    case 'select_one':
      return 'select';
    case 'select_many':
      return 'select';
    case 'signature':
      return 'text'; // TODO: Might need a custom type for signatures
    case 'initial':
      return 'text'; // TODO: Might need a custom type for initials
  }
}

/** A normalized rectangle in page coordinates. */
interface Rect {
  pageNumber: number; // 1-based (Azure DI)
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Preference order when multiple anchors exist on a question. */
const KIND_PRIORITY: AnchorKind[] = ['value', 'selectionMark', 'line', 'key'];

/** Gather all rects for a question from its anchors, respecting priority but keeping them all. */
function collectRegionsForQuestion(question: FormField, analysis: OriginalAnalysis): Rect[] {
  const anchors = question.anchors ?? [];
  if (anchors.length === 0) return [];

  const sorted = [...anchors];
  // .sort(
  //   (a, b) => KIND_PRIORITY.indexOf(a.kind) - KIND_PRIORITY.indexOf(b.kind)
  // );

  const results: Rect[] = [];

  for (const a of sorted) {
    const rects = regionsForAnchor(a, analysis);
    for (const r of rects) {
      results.push(r);
    }
  }

  return results;
}

/** Resolve one anchor to 0..N rects. */
function regionsForAnchor(anchor: Anchor, analysis: OriginalAnalysis): Rect[] {
  if (anchor.path.includes('key')) {
    const el = analysis.keyValuePairs?.find((kvp) => kvp.key.path === anchor.path);
    return el ? boundingRegionsToRects(el.key.boundingRegions) : [];
  }
  if (anchor.path.includes('value')) {
    const el = analysis.keyValuePairs?.find((kvp) => kvp.value?.path === anchor.path);
    return el ? boundingRegionsToRects(el.value?.boundingRegions) : [];
  }
  if (anchor.path.includes('line')) {
    const line = analysis.pages.flatMap((p) => p.lines)?.find((l) => l?.path === anchor.path);
    if (!line) return [];
    const pageNumber = pageNumberFromLinePath(line.path);
    const poly = line.polygon;
    return poly ? [polygonToRect(poly, pageNumber)] : [];
  }
  if (anchor.path.includes('selectionMark')) {
    const mark = analysis.pages
      .flatMap((p) => p.selectionMarks)
      ?.find((m) => m?.path === anchor.path);
    if (!mark) return [];
    const pageNumber = pageNumberFromMarkPath(mark.path);
    const poly = mark.polygon;
    return poly ? [polygonToRect(poly, pageNumber)] : [];
  }

  return [];
}

/** Convert Azure DI bounding regions to rects. */
function boundingRegionsToRects(regions?: Array<BoundingRegionOutput>): Rect[] {
  if (!regions || regions.length === 0) return [];
  return regions.map((r) => polygonToRect(r.polygon, r.pageNumber));
}

/** Convert polygon [x1,y1,...,xN,yN] to Rect. */
function polygonToRect(polygon: number[] | undefined, pageNumber: number): Rect {
  if (!polygon || polygon.length < 8) {
    // fallback 0-size at origin of page
    return { pageNumber, x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < polygon.length; i += 2) {
    const x = polygon[i]!;
    const y = polygon[i + 1]!;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  const k = 25.4;
  return {
    pageNumber,
    x: minX * k,
    y: minY * k,
    width: Math.max(0, maxX - minX) * k,
    height: Math.max(0, maxY - minY) * k,
  };
}

/** Default placeholder region when no anchors resolve. */
function defaultRegion(): Rect {
  // Default to page 1-ish position/size; authors can move it.
  return { pageNumber: 1, x: 72, y: 144, width: 180, height: 24 };
}

function pageNumberFromLinePath(path: string): number {
  const m = /^pages\/(\d+)\/lines\/(\d+)$/.exec(path);
  if (!m) return 1;
  const p = Number(m[1]);
  return p ?? 1;
}

function pageNumberFromMarkPath(path: string): number {
  const m = /^pages\/(\d+)\/selection_marks\/(\d+)$/.exec(path);
  if (!m) return 1;
  const p = Number(m[1]);
  return p ?? 1;
}
