'use client';

import React, { useEffect, useRef } from 'react';
import type { Schema, Template } from '@pdfme/common';
import { Designer } from '@pdfme/ui';
import {
  text,
  image,
  table,
  select,
  date,
  time,
  dateTime,
  // These are supported feature types; available via @pdfme/schemas
  // (If your installed version doesn't export them, remove or swap for custom plugins)
  // @see https://pdfme.com/docs/supported-features
  checkbox,
  radioGroup,
  multiVariableText,
} from '@pdfme/schemas';

export type PdfBuilderProps = {
  /** base PDF: ArrayBuffer | Uint8Array | base64 string | { width,height,padding } */
  basePdf: Template['basePdf'];
  schemas: Array<Schema>;
  /** optional: handle template changes */
  onTemplateChange?: (template: Template) => void;
};

export default function PdfBuilder({ basePdf, schemas, onTemplateChange }: PdfBuilderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<InstanceType<typeof Designer> | null>(null);

  // Designer init
  useEffect(() => {
    if (!containerRef.current) return;

    // Build plugin map. qrcode comes from barcodes.
    const plugins = {
      text,
      multiVariableText,
      image,
      table,
      select,
      date,
      time,
      dateTime,
      checkbox,
      radioGroup,
    };

    const d = new Designer({
      domContainer: containerRef.current,
      template: {
        schemas: [schemas],
        basePdf: basePdf,
      },
      options: {
        sidebarOpen: true,
      },
      plugins,
    });

    // notify caller on changes
    d.onChangeTemplate((t) => {
      onTemplateChange?.(t);
    });

    // Very light selection tracking (Designer maintains its own UI/props panel)
    // We can infer selection via saving template (or wire your own overlay)
    // For simplicity, we leave detailed selection to the built-in property panel.

    designerRef.current = d;
    return () => d.destroy();
  }, [basePdf, schemas, onTemplateChange]);

  // If basePdf changes at runtime, update the template
  useEffect(() => {
    if (!designerRef.current) return;
    const t = designerRef.current.getTemplate();
    if (t.basePdf !== basePdf) {
      designerRef.current.updateTemplate({ ...t, basePdf });
    }
  }, [basePdf]);

  return (
    <section style={{ position: 'relative' }} className="w-full">
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </section>
  );
}
