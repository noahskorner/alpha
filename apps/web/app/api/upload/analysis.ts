import {
  DocumentPageOutput,
  DocumentSelectionMarkOutput,
  DocumentKeyValueElementOutput,
  DocumentKeyValuePairOutput,
  DocumentLineOutput,
} from '@azure-rest/ai-document-intelligence';

export interface OriginalPage extends DocumentPageOutput {
  id: string;
}

export interface OriginalLine extends DocumentLineOutput {
  id: string;
}

export interface OriginalSelectionMark extends DocumentSelectionMarkOutput {
  id: string;
}

export interface OriginalKeyValue extends DocumentKeyValueElementOutput {
  id: string;
}

export interface OriginalKeyValuePair extends DocumentKeyValuePairOutput {
  key: OriginalKeyValue;
  value?: OriginalKeyValue;
}

export interface SelectionMark {
  id: string;
  state: string;
}

export interface Page {
  id: string;
  lines?: Array<Line>;
  selectionMarks?: Array<SelectionMark>;
  keyValuePairs?: Array<KeyValuePair>;
}

export interface Line {
  id: string;
  content: string;
}

export interface KeyValue {
  id: string;
  content: string;
}

export interface KeyValuePair {
  key: KeyValue;
  value?: KeyValue;
}

export interface Analysis {
  original: {
    pages: Array<OriginalPage>;
    keyValuePairs: Array<OriginalKeyValuePair>;
  };
  pages: Array<Page>;
}
