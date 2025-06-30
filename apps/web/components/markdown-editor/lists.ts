import { Decoration, Line } from '@uiw/react-codemirror';
import { DecorationRange } from './decoration-range';
import { replaceMarkdown } from './replace-markdown';

export function lists(
  line: Line,
  lineText: string,
  isActive: boolean,
  from: number,
  to: number,
  count: number
): { count: number; decorations: Array<DecorationRange> } {
  const isList = lineText.match(/^(\s*)([-+*]|\d+\.)\s+/);

  if (!isList) {
    return { count: 0, decorations: [] };
  }

  const isOrdered = /\d+\./.test(isList[2]);
  const updatedCount = ++count;
  return {
    count: updatedCount,
    decorations: [
      {
        from: from,
        to: to,
        decoration: Decoration.mark({
          tagName: 'li',
          class: isOrdered ? 'cm-ol-list-item' : 'cm-ul-list-item',
          attributes: isOrdered
            ? {
                'data-list-number': `${updatedCount}`,
              }
            : undefined,
        }),
      },
      ...replaceMarkdown(line.from, lineText, /^(\s*)([-+*]|\d+\.)/g, isActive),
    ],
  };
}
