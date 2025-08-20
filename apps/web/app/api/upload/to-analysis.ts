import { AnalyzeOperationOutput } from '@azure-rest/ai-document-intelligence';
import {
  LlmAnalysis,
  OriginalKeyValuePair,
  LlmKeyValue,
  LlmKeyValuePair,
  OriginalSelectionMark,
  LlmSelectionMark,
  OriginalPage,
  LlmPage,
  LlmLine,
  OriginalLine,
  OriginalAnalysis,
} from './analysis';

export function toAnalysis(analysis: AnalyzeOperationOutput): {
  original: OriginalAnalysis;
  result: LlmAnalysis;
} {
  const analyzeResult = analysis.analyzeResult;
  if (!analyzeResult) {
    throw new Error('No analyzeResult found in the analysis output');
  }

  // Map the key-value pairs
  const kvps = analyzeResult.keyValuePairs?.map((kvp, index) => {
    const keyPath = `keys/${index + 1}`;
    const valuePath = `values/${index + 1}`;
    const original: OriginalKeyValuePair = {
      ...kvp,
      key: { ...kvp.key, path: keyPath },
      value: kvp.value ? { ...kvp.value, path: valuePath } : undefined,
    };
    const key: LlmKeyValue = {
      path: keyPath,
      content: kvp.key.content,
    };
    const value: LlmKeyValue | undefined = kvp.value
      ? {
          path: valuePath,
          content: kvp.value.content,
        }
      : undefined;
    const keyValuePair: LlmKeyValuePair = {
      key,
      value,
    };

    return { original, keyValuePair };
  });

  const pages = analyzeResult.pages.map((p, pageIndex) => {
    // Map the lines
    const lines = p.lines?.map((l, lineIndex) => {
      const linePath = `pages/${pageIndex + 1}/lines/${lineIndex + 1}`;
      const original: OriginalLine = { ...l, path: linePath };
      const line: LlmLine = {
        path: linePath,
        content: l.content,
      };

      return {
        original,
        line,
      };
    });

    // Map the selection marks
    const selectionMarks = p.selectionMarks?.map((mark, selectionMarkIndex) => {
      const selectionMarkPath = `pages/${pageIndex + 1}/selection_marks/${selectionMarkIndex + 1}`;
      const original: OriginalSelectionMark = { ...mark, path: selectionMarkPath };
      const selectionMark: LlmSelectionMark = {
        path: selectionMarkPath,
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
    const pathPath = `pages/${pageIndex + 1}`;
    const original: OriginalPage = {
      ...p,
      path: pathPath,
      lines: lines?.map((l) => l.original),
      selectionMarks: selectionMarks?.map((sm) => sm.original),
    };
    const page: LlmPage = {
      path: pathPath,
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
      ...analyzeResult,
      pages: pages.map((p) => p.original),
      keyValuePairs: kvps?.map((kvp) => kvp.original) ?? [],
    },
    result: {
      pages: pages.map((p) => p.page),
    },
  };
}
