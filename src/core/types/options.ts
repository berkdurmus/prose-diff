import type { Change, Conflict } from "./diff-result";
import type { DocumentNode } from "./document";

export interface DiffOptions {
  granularity?: "character" | "word" | "sentence" | "paragraph";
  enableSemanticMatching?: boolean;
  semanticThreshold?: number;
  contextLines?: number;
  collapseThreshold?: number;
  ignoreWhitespace?: boolean;
  normalizeUnicode?: boolean;
  maxDocumentSize?: number;
  timeout?: number;
}

export interface ThemeConfig {
  background: string;
  foreground: string;
  addition: string;
  deletion: string;
  modification: string;
  muted: string;
}

export interface ViewerOptions {
  mode?: "side-by-side" | "inline" | "hybrid";
  theme?: "light" | "dark" | "system" | ThemeConfig;
  additionColor?: string;
  deletionColor?: string;
  modificationColor?: string;
  showLineNumbers?: boolean;
  showStats?: boolean;
  enableNavigation?: boolean;
  enableKeyboardShortcuts?: boolean;
  onChangeSelect?: (change: Change) => void;
  onResolve?: (conflict: Conflict, resolution: DocumentNode) => void;
}
