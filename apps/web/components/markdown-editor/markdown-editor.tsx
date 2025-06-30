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
import { DecorationRange } from './decoration-range';
import { headings } from './headings';
import { lists } from './lists';
import { tables } from './tables';
import { strongs } from './strongs';
import { italics } from './italics';
import { quotes } from './quotes';

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
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();

      const decorations: Array<DecorationRange> = [];
      for (const { from: initialFrom, to: initialTo } of view.visibleRanges) {
        const content = view.state.doc.sliceString(initialFrom, initialTo);
        const lines = content.split('\n');
        const cursorPosition = view.state.selection.main.head;
        const cursorLine = view.state.doc.lineAt(cursorPosition).number;

        let position = initialFrom;
        let listCount = 0;
        let tableCount = 0;
        for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
          const line = view.state.doc.line(lineNumber);
          const lineText = lines[lineNumber - 1];
          const isActive = lineNumber == cursorLine;
          const from = position;
          const to = position + lineText.length;

          // Strongs
          decorations.push(...strongs(lineText, isActive, from));

          // Italics
          decorations.push(...italics(lineText, isActive, from));

          // Quotes
          decorations.push(...quotes(lineText, isActive, from, to));

          // Headings
          decorations.push(...headings(line, lineText, isActive, from, to));

          // Lists
          const { count: updatedListCount, decorations: listDecorations } = lists(
            line,
            lineText,
            isActive,
            from,
            to,
            listCount
          );
          listCount = updatedListCount;
          decorations.push(...listDecorations);

          // Tables
          const { count: updatedTableCount, decorations: tableDecorations } = tables(
            line,
            lineText,
            isActive,
            from,
            to,
            tableCount
          );
          tableCount = updatedTableCount;
          decorations.push(...tableDecorations);

          // Code

          // Increment the position
          position += lineText.length + 1;
        }
      }

      // Apply the decorations
      decorations.sort(
        (a, b) =>
          a.from - b.from || (a.decoration.spec.startSide ?? 0) - (b.decoration.spec.startSide ?? 0)
      );
      for (const range of decorations) {
        builder.add(range.from, range.to, range.decoration);
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
