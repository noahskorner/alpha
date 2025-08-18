// npm i pdf-lib
// Types come from @azure-rest/ai-document-intelligence and your local form/analysis types.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { OriginalKeyValuePair, OriginalPage } from '../upload/analysis';
import { Form, Question } from '../upload/form';

/**
 * Fill a PDF using:
 *  - Azure DI analysis (with your stable 0-based ids via toAnalysis)
 *  - your extracted Form (questions + anchors)
 *  - user's answers
 *  - original PDF bytes
 *
 * Returns a new, filled PDF as bytes.
 */
export async function fillPdfFromAnswers(opts: {
  pdfBytes: Uint8Array; // original PDF file
  pages: Array<OriginalPage>;
  keyValuePairs: Array<OriginalKeyValuePair>;
  form: Form;
  answers: Record<string, unknown>;
}): Promise<Uint8Array> {
  const { pdfBytes, pages, keyValuePairs, form, answers } = opts;

  // Build index -> page meta from the original pages to access polygons & page sizes
  const aPages = pages ?? [];
  const pageByZeroIndex = new Map<number, (typeof aPages)[number]>();
  aPages.forEach((p, idx) => pageByZeroIndex.set(idx, p));

  // Build direct lookups for all anchorable items (ids you minted in toAnalysis)
  const keyById = new Map<string, { pageIndex: number; polygon?: number[] }>();
  const valueById = new Map<string, { pageIndex: number; polygon?: number[] }>();
  const lineById = new Map<string, { pageIndex: number; polygon?: number[]; content: string }>();
  const selMarkById = new Map<string, { pageIndex: number; polygon?: number[]; state: string }>();

  // Key/Value pairs (global across doc)
  const kvps = keyValuePairs ?? [];
  kvps.forEach((kvp, i) => {
    const keyId = `keys/${i}`;
    const valId = `values/${i}`;
    const kRegion = firstRegion(kvp.key?.boundingRegions);
    const vRegion = firstRegion(kvp.value?.boundingRegions);

    if (kRegion)
      keyById.set(keyId, { pageIndex: kRegion.pageNumber - 1, polygon: kRegion.polygon });
    if (vRegion)
      valueById.set(valId, { pageIndex: vRegion.pageNumber - 1, polygon: vRegion.polygon });
  });

  // Lines & selection marks (per page)
  aPages.forEach((pg, pIdx) => {
    pg.lines?.forEach((ln, lIdx) => {
      const id = `pages/${pIdx}/lines/${lIdx}`;
      const r = firstRegion([{ pageNumber: pg.pageNumber, polygon: ln.polygon }]);
      lineById.set(id, {
        pageIndex: r ? r.pageNumber - 1 : pIdx,
        polygon: r?.polygon,
        content: ln.content ?? '',
      });
    });
    pg.selectionMarks?.forEach((sm, sIdx) => {
      const id = `pages/${pIdx}/selection_marks/${sIdx}`;
      const r = firstRegion([{ pageNumber: pg.pageNumber, polygon: sm.polygon }]);
      selMarkById.set(id, {
        pageIndex: r ? r.pageNumber - 1 : pIdx,
        polygon: r?.polygon,
        state: sm.state ?? 'unselected',
      });
    });
  });

  // 2) Open the PDF and prep font
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const defaultFontSize = 10;

  // 3) Helpers for coordinates (use RELATIVE coordinates => robust to inches vs pixels)
  const getPdfXYFromAzure = (pageIndex: number, x: number, y: number): { x: number; y: number } => {
    const pdfPage = pdfDoc.getPage(pageIndex);
    const pdfW = pdfPage.getWidth();
    const pdfH = pdfPage.getHeight();

    const aPage = pageByZeroIndex.get(pageIndex);
    const width = aPage?.width ?? 1;
    const height = aPage?.height ?? 1;
    // Convert to relative, then map to PDF coordinates. Azure origin is top-left; PDF origin is bottom-left.
    const relX = x / width;
    const relY = y / height;
    return { x: relX * pdfW, y: (1 - relY) * pdfH };
  };

  const bboxFromPolygon = (polygon?: number[]) => {
    if (!polygon || polygon.length < 8) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (let i = 0; i < polygon.length; i += 2) {
      const x = polygon[i];
      const y = polygon[i + 1];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  };

  const centerOf = (pageIndex: number, polygon?: number[]) => {
    const box = bboxFromPolygon(polygon);
    if (!box) return null;
    const { x, y } = getPdfXYFromAzure(
      pageIndex,
      box.minX + box.width / 2,
      box.minY + box.height / 2
    );
    return { x, y, box };
  };

  const anchorBox = (pageIndex: number, polygon?: number[]) => {
    const box = bboxFromPolygon(polygon);
    if (!box) return null;
    const bl = getPdfXYFromAzure(pageIndex, box.minX, box.maxY); // bottom-left
    const tr = getPdfXYFromAzure(pageIndex, box.maxX, box.minY); // top-right
    return { x: bl.x, y: bl.y, w: tr.x - bl.x, h: tr.y - bl.y, a: box };
  };

  const drawTextAt = (
    pageIndex: number,
    text: string,
    polygon?: number[],
    fallbackOffsetPct = 0.02
  ) => {
    const page = pdfDoc.getPage(pageIndex);
    page.setFont(font);
    page.setFontSize(defaultFontSize);

    const box = anchorBox(pageIndex, polygon);
    if (box) {
      // Try to draw inside the value box; if it's tiny, anchor right of it.
      const pad = Math.min(6, box.w * 0.05);
      const usableW = Math.max(0, box.w - pad * 2);
      const x = box.x + pad;
      const y = box.y + Math.max(0, (box.h - defaultFontSize) / 2); // vertically center-ish
      page.drawText(text, { x, y, size: defaultFontSize, maxWidth: usableW });
      return;
    }

    // Fallback: if we only have a key (no value box), nudge right/down a bit relative to the key area
    if (polygon) {
      const c = centerOf(pageIndex, polygon);
      if (c?.box) {
        const page = pdfDoc.getPage(pageIndex);
        const pageW = page.getWidth();
        const pageH = page.getHeight();
        const dx = pageW * fallbackOffsetPct;
        const dy = -pageH * fallbackOffsetPct;
        page.drawText(text, {
          x: c.x + dx,
          y: c.y + dy,
          size: defaultFontSize,
        });
      }
    }
  };

  const drawCheckMark = (pageIndex: number, polygon?: number[]) => {
    const page = pdfDoc.getPage(pageIndex);
    const center = centerOf(pageIndex, polygon);
    if (!center) return;

    // Tick size based on the box
    const s = Math.max(8, Math.min(14, Math.min(center.box!.width, center.box!.height) * 0.9));

    // Build a simple ✓ path around the center (tuned visually)
    const x = center.x,
      y = center.y;
    const p = `M ${x - 0.35 * s} ${y + 0.05 * s}
             L ${x - 0.05 * s} ${y - 0.3 * s}
             L ${x + 0.45 * s} ${y + 0.35 * s}`;
    page.drawSvgPath(p, {
      borderColor: rgb(0, 0, 0),
      borderWidth: Math.max(1, s * 0.12),
    });
  };

  // 4) Walk questions and draw answers
  for (const page of form.pages) {
    for (const q of page.questions) {
      const value = answers[q.name];
      if (value == null || value === '') continue;

      // Helper to pick best anchor “write box” priority: valueId > selectionMarkId > lineId > keyId
      const pickWriteTarget = (question: Question) => {
        // check option anchors for selection marks first if select types / boolean
        const optionSelMarks: Array<{ pageIndex: number; polygon?: number[]; value: string }> = [];
        if (question.options) {
          for (const opt of question.options) {
            opt.anchors?.forEach((a) => {
              if (a?.selectionMarkId) {
                const sm = selMarkById.get(a.selectionMarkId);
                if (sm)
                  optionSelMarks.push({
                    pageIndex: sm.pageIndex,
                    polygon: sm.polygon,
                    value: opt.value,
                  });
              }
            });
          }
        }

        // question-level anchors
        const polygons: Array<{
          pageIndex: number;
          polygon?: number[];
          role: 'value' | 'key' | 'line' | 'sel';
        }> = [];
        q.anchors?.forEach((a) => {
          if (a?.valueId) {
            const v = valueById.get(a.valueId);
            if (v) polygons.push({ pageIndex: v.pageIndex, polygon: v.polygon, role: 'value' });
          }
          if (a?.selectionMarkId) {
            const s = selMarkById.get(a.selectionMarkId);
            if (s) polygons.push({ pageIndex: s.pageIndex, polygon: s.polygon, role: 'sel' });
          }
          if (a?.lineId) {
            const l = lineById.get(a.lineId);
            if (l) polygons.push({ pageIndex: l.pageIndex, polygon: l.polygon, role: 'line' });
          }
          if (a?.keyId) {
            const k = keyById.get(a.keyId);
            if (k) polygons.push({ pageIndex: k.pageIndex, polygon: k.polygon, role: 'key' });
          }
        });

        return { polygons, optionSelMarks };
      };

      const { polygons, optionSelMarks } = pickWriteTarget(q);

      switch (q.type) {
        // text-like answers
        case 'short_text':
        case 'long_text':
        case 'number':
        case 'date':
        case 'time':
        case 'email':
        case 'url':
        case 'signature':
        case 'initial': {
          // Prefer value box, else line, else key
          const firstValue =
            polygons.find((p) => p.role === 'value') ??
            polygons.find((p) => p.role === 'line') ??
            polygons.find((p) => p.role === 'key');
          if (!firstValue) break;
          drawTextAt(firstValue.pageIndex, String(value), firstValue.polygon);
          break;
        }

        case 'boolean': {
          const truthy = !!value;
          // Any selection mark anchors? If so, draw ✓ when true (and optionally draw X for false if you prefer)
          const anchors = polygons.filter((p) => p.role === 'sel');
          if (anchors.length > 0) {
            if (truthy) {
              anchors.forEach((a) => drawCheckMark(a.pageIndex, a.polygon));
            }
          } else {
            // No selection mark? Write "Yes"/"No" near value/key area
            const first =
              polygons.find((p) => p.role === 'value') ?? polygons.find((p) => p.role === 'key');
            if (first) drawTextAt(first.pageIndex, truthy ? 'Yes' : 'No', first.polygon);
          }
          break;
        }

        case 'select_one': {
          // If options have selection mark anchors, mark the one that matches
          const chosen = String(value);
          if (optionSelMarks.length) {
            optionSelMarks
              .filter((o) => o.value === chosen)
              .forEach((o) => drawCheckMark(o.pageIndex, o.polygon));
          } else {
            // Otherwise write the chosen value into the value box
            const firstValue =
              polygons.find((p) => p.role === 'value') ??
              polygons.find((p) => p.role === 'line') ??
              polygons.find((p) => p.role === 'key');
            if (firstValue) drawTextAt(firstValue.pageIndex, chosen, firstValue.polygon);
          }
          break;
        }

        case 'select_many': {
          const chosen = Array.isArray(value) ? (value as unknown[]).map(String) : [String(value)];
          if (optionSelMarks.length) {
            optionSelMarks
              .filter((o) => chosen.includes(o.value))
              .forEach((o) => drawCheckMark(o.pageIndex, o.polygon));
          } else {
            const firstValue =
              polygons.find((p) => p.role === 'value') ??
              polygons.find((p) => p.role === 'line') ??
              polygons.find((p) => p.role === 'key');
            if (firstValue) drawTextAt(firstValue.pageIndex, chosen.join(', '), firstValue.polygon);
          }
          break;
        }
      }
    }
  }

  // 5) Serialize PDF
  return await pdfDoc.save();

  // ---- Helpers ----
  function firstRegion(
    regions?: Array<{ pageNumber: number; polygon?: number[] }>
  ): { pageNumber: number; polygon?: number[] } | undefined {
    if (!regions || !regions.length) return undefined;
    // Prefer a region with a polygon; otherwise the first
    const withPoly = regions.find((r) => r.polygon && r.polygon.length >= 8);
    return withPoly ?? regions[0];
  }
}
