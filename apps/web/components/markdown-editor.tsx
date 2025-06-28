'use client';

import { useState } from 'react';
import CodeMirror, {
  Decoration,
  DecorationSet,
  EditorView,
  RangeSetBuilder,
  ViewPlugin,
  ViewUpdate,
} from '@uiw/react-codemirror';

export interface MarkdownEditorProps {
  content: string;
}

export const MarkdownEditor = ({ content }: MarkdownEditorProps) => {
  const [value, setValue] = useState(content);

  return (
    <CodeMirror
      className="w-full max-w-5xl outline-none"
      value={value}
      extensions={[
        EditorView.theme({
          '.cm-line': {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            fontFamily: 'var(--font-inter), sans-serif !important',
            fontSize: '14px',
          },
          '.cm-activeLine': {
            background: 'transparent',
          },
          '.cm-gutters': { display: 'none' },
          '&.cm-focused': {
            outline: 'none',
          },
          '.cm-heading-1': {
            color: 'var(--tw-prose-headings)',
            marginTop: '0',
            marginBottom: '.888889em',
            fontSize: '2.25em',
            fontWeight: '800',
            lineHeight: '1.11111',
          },
          '.cm-heading-2': {
            color: 'var(--tw-prose-headings)',
            marginTop: '2em',
            marginBottom: '1em',
            fontSize: '1.5em',
            fontWeight: '700',
            lineHeight: '1.33333',
          },
          '.cm-heading-3': {
            color: 'var(--tw-prose-headings)',
            marginTop: '1.6em',
            marginBottom: '.6em',
            fontSize: '1.25em',
            fontWeight: '600',
            lineHeight: '1.6',
          },
        }),
        markdownPlugin,
      ]}
      onChange={(val) => setValue(val)}
    />
  );
};

const markdownPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();

      for (const { from: initialFrom, to: initialTo } of view.visibleRanges) {
        const content = view.state.doc.sliceString(initialFrom, initialTo);
        const lines = content.split('\n');

        let pos = initialFrom;
        for (const line of lines) {
          const from = pos;
          const to = pos + line.length;

          if (line.startsWith('# ')) {
            builder.add(
              from,
              to,
              Decoration.mark({
                attributes: { class: 'cm-heading-1' },
              })
            );
          }
          if (line.startsWith('## ')) {
            builder.add(
              from,
              to,
              Decoration.mark({
                attributes: { class: 'cm-heading-2' },
              })
            );
          }
          if (line.startsWith('### ')) {
            builder.add(
              from,
              to,
              Decoration.mark({
                attributes: { class: 'cm-heading-3' },
              })
            );
          }

          pos += line.length + 1;
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
