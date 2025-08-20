'use client';

import { useEffect, useMemo, useState } from 'react';
import { toSchemas } from './to-schemas';
import { form } from './form';
import { analysis } from './analysis';
import PdfBuilder from './pdf-builder';

export default function EditForm() {
  const [basePdf, setBasePdf] = useState<ArrayBuffer | null>(null);
  const schemas = useMemo(() => {
    return toSchemas(form, analysis);
  }, []);

  // (A) Load a bundled PDF from /public on first render (optional)
  useEffect(() => {
    // Comment this out if you only want user-uploaded files
    fetch('/examples/w9.pdf')
      .then((r) => r.arrayBuffer())
      .then(setBasePdf)
      .catch(console.error);
  }, []);

  useEffect(() => {
    console.log('schemas', schemas);
  }, [schemas]);

  return (
    <div style={{ height: '100vh' }}>
      {basePdf && (
        <PdfBuilder
          basePdf={basePdf}
          schemas={schemas}
          onTemplateChange={(t) => console.log('template changed', t)}
        />
      )}
    </div>
  );
}
