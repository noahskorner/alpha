import { AnalyzeOperationOutput } from '@azure-rest/ai-document-intelligence';
import {
  Analysis,
  OriginalKeyValuePair,
  KeyValue,
  KeyValuePair,
  OriginalSelectionMark,
  SelectionMark,
  OriginalPage,
  Page,
  Line,
} from './analysis';

export function toAnalysis(analysis: AnalyzeOperationOutput): Analysis {
  const analyzeResult = analysis.analyzeResult;
  if (!analyzeResult) {
    throw new Error('No analyzeResult found in the analysis output');
  }

  // Map the key-value pairs
  const kvps = analyzeResult.keyValuePairs?.map((kvp, index) => {
    const keyId = `keys/${index}`;
    const valueId = `values/${index}`;
    const original: OriginalKeyValuePair = {
      ...kvp,
      key: { ...kvp.key, id: keyId },
      value: kvp.value ? { ...kvp.value, id: valueId } : undefined,
    };
    const key: KeyValue = {
      id: keyId,
      content: kvp.key.content,
    };
    const value: KeyValue | undefined = kvp.value
      ? {
          id: valueId,
          content: kvp.value.content,
        }
      : undefined;
    const keyValuePair: KeyValuePair = {
      key,
      value,
    };

    return { original, keyValuePair };
  });

  const pages = analyzeResult.pages.map((p, pageIndex) => {
    // Map the lines
    const lines = p.lines?.map((l, lineIndex) => {
      const lineId = `pages/${pageIndex}/lines/${lineIndex}`;
      const original = { ...l, id: lineId };
      const line: Line = {
        id: lineId,
        content: l.content,
      };

      return {
        original,
        line,
      };
    });

    // Map the selection marks
    const selectionMarks = p.selectionMarks?.map((mark, selectionMarkIndex) => {
      const selectionMarkId = `pages/${pageIndex}/selection_marks/${selectionMarkIndex}`;
      const original: OriginalSelectionMark = { ...mark, id: selectionMarkId };
      const selectionMark: SelectionMark = {
        id: selectionMarkId,
        state: mark.state,
      };

      return {
        original,
        selectionMark,
      };
    });

    // Find the key-value pairs for this page
    const keyValuePairs = kvps
      ?.filter((kvp) => {
        return (
          kvp.original.key.boundingRegions?.some((r) => r.pageNumber === p.pageNumber) ||
          kvp.original.value?.boundingRegions?.some((r) => r.pageNumber === p.pageNumber)
        );
      })
      .map((kvp) => kvp.keyValuePair);

    // Map the page
    const pageId = `pages/${pageIndex}`;
    const original: OriginalPage = {
      ...p,
      id: pageId,
      lines: lines?.map((l) => l.original),
      selectionMarks: selectionMarks?.map((sm) => sm.original),
    };
    const page: Page = {
      id: pageId,
      lines: lines?.map((l) => l.line),
      selectionMarks: selectionMarks?.map((sm) => sm.selectionMark),
      keyValuePairs: keyValuePairs,
    };

    // Return both the original with assigned id and it's mapped page
    return {
      original,
      page,
    };
  });

  return {
    original: {
      pages: pages.map((p) => p.original),
      keyValuePairs: kvps?.map((kvp) => kvp.original) ?? [],
    },
    pages: pages.map((p) => p.page),
  };
}
