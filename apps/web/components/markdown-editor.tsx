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
import './markdown-editor.css';

export interface MarkdownEditorProps {
  content: string;
}

export const MarkdownEditor = ({ content }: MarkdownEditorProps) => {
  const [value, setValue] = useState(content);

  return (
    <CodeMirror
      className="w-full max-w-5xl outline-none bg-transparent"
      value={value}
      theme={'none'}
      extensions={[markdownPlugin]}
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
        let listIndex = 0;
        let tableIndex = 0;
        for (const line of lines) {
          const from = pos;
          const to = pos + line.length;

          const headingMatch = line.match(/^(#{1,6})\s+/);
          if (headingMatch) {
            const level = headingMatch[1].length;
            builder.add(
              from,
              to,
              Decoration.mark({
                tagName: `h${level}`,
                class: `cm-heading-${level}`,
              })
            );
          }

          const listMatch = line.match(/^(\s*)([-+*]|\d+\.)\s+/);
          if (listMatch) {
            const isOrdered = /\d+\./.test(listMatch[2]);
            builder.add(
              from,
              to,
              Decoration.mark({
                tagName: 'li',
                class: isOrdered ? 'cm-ol-list-item' : 'cm-ul-list-item',
                attributes: isOrdered
                  ? {
                      'data-list-number': `${++listIndex}`,
                    }
                  : undefined,
              })
            );
          } else {
            listIndex = 0; // Reset list index for non-list lines
          }

          const isTableRow = line.match(/^\s*\|.*\|?\s*$/);
          const isTableSeparator = line.match(/^\s*\|?(?:\s*-+\s*\|)+\s*-+\s*\|?\s*$/);
          if (isTableSeparator) {
            builder.add(
              from,
              to,
              Decoration.mark({
                class: 'cm-table-separator',
              })
            );
          } else if (isTableRow) {
            builder.add(
              from,
              to,
              Decoration.mark({
                class: 'cm-table-row',
                attributes: {
                  'data-row-number': `${++tableIndex}`,
                },
              })
            );

            const columns = line.split('|').slice(1, -1); // remove empty leading/trailing from split
            const offset = from;
            for (const col of columns) {
              const colStart = offset + line.slice(offset - from).indexOf(col);
              const colEnd = colStart + col.length;

              builder.add(
                colStart,
                colEnd,
                Decoration.mark({
                  tagName: 'span',
                  class: 'cm-table-cell',
                })
              );
            }
          } else {
            tableIndex = 0;
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
