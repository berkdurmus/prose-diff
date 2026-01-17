export type DocumentNodeType =
  | "document"
  | "section"
  | "paragraph"
  | "sentence"
  | "word";

export interface DocumentNode {
  type: DocumentNodeType;
  content: string;
  children?: DocumentNode[];
  start: number;
  end: number;
  hash: string;
  id: string;
}

export interface Document {
  root: DocumentNode;
  text: string;
  metadata: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
  };
}
