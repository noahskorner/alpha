import {
  DocumentPageOutput,
  DocumentSelectionMarkOutput,
  DocumentKeyValueElementOutput,
  DocumentKeyValuePairOutput,
  DocumentLineOutput,
  AnalyzeResultOutput,
} from '@azure-rest/ai-document-intelligence';

export interface OriginalAnalysis extends Omit<AnalyzeResultOutput, 'pages' | 'keyValuePairs'> {
  pages: Array<OriginalPage>;
  keyValuePairs: Array<OriginalKeyValuePair>;
}

export interface OriginalPage extends Omit<DocumentPageOutput, 'lines' | 'selectionMarks'> {
  path: string;
  lines?: Array<OriginalLine>;
  selectionMarks?: Array<OriginalSelectionMark>;
}

export interface OriginalLine extends DocumentLineOutput {
  path: string;
}

export interface OriginalSelectionMark extends DocumentSelectionMarkOutput {
  path: string;
}

export interface OriginalKeyValue extends DocumentKeyValueElementOutput {
  path: string;
}

export interface OriginalKeyValuePair extends DocumentKeyValuePairOutput {
  key: OriginalKeyValue;
  value?: OriginalKeyValue;
}

export interface LlmSelectionMark {
  path: string;
  state: string;
}

export interface LlmPage {
  path: string;
  lines?: Array<LlmLine>;
  selectionMarks?: Array<LlmSelectionMark>;
  keyValuePairs?: Array<LlmKeyValuePair>;
}

export interface LlmLine {
  path: string;
  content: string;
}

export interface LlmKeyValue {
  path: string;
  content: string;
}

export interface LlmKeyValuePair {
  key: LlmKeyValue;
  value?: LlmKeyValue;
}

export interface LlmAnalysis {
  pages: Array<LlmPage>;
}
