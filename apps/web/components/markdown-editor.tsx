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

      const decorators: Array<{ from: number; to: number; mark: Decoration }> = [];
      for (const { from: initialFrom, to: initialTo } of view.visibleRanges) {
        const content = view.state.doc.sliceString(initialFrom, initialTo);
        const lines = content.split('\n');
        const cursorPos = view.state.selection.main.head;
        const cursorLine = view.state.doc.lineAt(cursorPos).number;

        let pos = initialFrom;
        let listIndex = 0;
        let tableIndex = 0;
        for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
          const line = view.state.doc.line(lineNumber);
          const lineText = lines[lineNumber - 1];
          const isActive = lineNumber == cursorLine;
          const from = pos;
          const to = pos + lineText.length;

          // Headings
          const isHeading = lineText.match(/^(#{1,6})\s+/);
          if (isHeading) {
            const level = isHeading[1].length;
            decorators.push({
              from: from,
              to: to,
              mark: Decoration.mark({
                tagName: `h${level}`,
                class: `cm-heading-${level}`,
              }),
            });
          }

          // Lists
          const isList = lineText.match(/^(\s*)([-+*]|\d+\.)\s+/);
          if (isList) {
            const isOrdered = /\d+\./.test(isList[2]);
            decorators.push({
              from: from,
              to: to,
              mark: Decoration.mark({
                tagName: 'li',
                class: isOrdered ? 'cm-ol-list-item' : 'cm-ul-list-item',
                attributes: isOrdered
                  ? {
                      'data-list-number': `${++listIndex}`,
                    }
                  : undefined,
              }),
            });
          } else {
            listIndex = 0; // Reset list index for non-list lines
          }

          // Tables
          const isTableRow = lineText.match(/^\s*\|.*\|?\s*$/);
          const isTableSeparator = lineText.match(/^\s*\|?(?:\s*-+\s*\|)+\s*-+\s*\|?\s*$/);
          if (isTableSeparator) {
            decorators.push({
              from: from,
              to: to,
              mark: Decoration.mark({
                class: 'cm-table-separator',
              }),
            });
          } else if (isTableRow) {
            decorators.push({
              from: from,
              to: to,
              mark: Decoration.mark({
                class: 'cm-table-row',
                attributes: {
                  'data-row-number': `${++tableIndex}`,
                },
              }),
            });

            // Table Cells
            const columns = lineText.split('|').slice(1, -1); // remove empty leading/trailing from split
            const offset = from;
            for (const col of columns) {
              const colStart = offset + lineText.slice(offset - from).indexOf(col);
              const colEnd = colStart + col.length;

              decorators.push({
                from: colStart,
                to: colEnd,
                mark: Decoration.mark({
                  tagName: 'span',
                  class: 'cm-table-cell',
                }),
              });
            }
          } else {
            tableIndex = 0; // Reset table index
          }

          // Code

          // Tag the markdown for inactive lines
          let pattern: RegExp | null = null;

          if (isHeading) {
            pattern = /#/g;
          } else if (isList) {
            // match "-", "+", "*", or leading numbers + "." (e.g., "1.", "12.")
            pattern = /^(\s*)([-+*]|\d+\.)/g;
          } else if (isTableRow || isTableSeparator) {
            pattern = /[|:-]/g;
          }

          // If we have a pattern, apply it
          if (pattern) {
            let match;
            while ((match = pattern.exec(lineText)) !== null) {
              const matchStart = match.index;
              const matchEnd = match.index + match[0].length;

              decorators.push({
                from: line.from + matchStart,
                to: line.from + matchEnd,
                mark: Decoration.mark({
                  tagName: 'span',
                  class: 'cm-markdown',
                  attributes: {
                    'data-active': `${isActive}`,
                  },
                }),
              });
            }
          }

          pos += lineText.length + 1;
        }
      }

      // Sort the decorators
      decorators.sort(
        (a, b) => a.from - b.from || (a.mark.spec.startSide ?? 0) - (b.mark.spec.startSide ?? 0)
      );
      for (const decorator of decorators) {
        builder.add(decorator.from, decorator.to, decorator.mark);
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
