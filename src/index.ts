export { DiffViewer } from "@/components/DiffViewer/DiffViewer";
export { SideBySideView } from "@/components/SideBySideView/SideBySideView";
export { InlineView } from "@/components/InlineView/InlineView";
export { MergeView } from "@/components/MergeView/MergeView";
export { ChangeStats } from "@/components/shared/ChangeStats";
export { Navigation } from "@/components/shared/Navigation";
export { ChangeHighlight } from "@/components/shared/ChangeHighlight";
export { useDiff } from "@/components/hooks/useDiff";
export { useNavigation } from "@/components/hooks/useNavigation";
export { useSyncScroll } from "@/components/hooks/useSyncScroll";
export { useKeyboardNav } from "@/components/hooks/useKeyboardNav";

export { parseDocument } from "@/core/parser/document-tree";
export { splitSentences } from "@/core/parser/sentence-splitter";
export { tokenizeWords } from "@/core/parser/tokenizer";
export { diffDocuments } from "@/core/diff/document-diff";
export { diffWords } from "@/core/diff/word-diff";
export { diffAsync } from "@/core/diff/diff-async";
export { merge3 } from "@/core/merge/three-way";
export { resolveConflict } from "@/core/merge/resolution";

export { diffYjs } from "@/integrations/yjs/yjs-diff";
export { diffProseMirror } from "@/integrations/prosemirror/pm-diff";

export { exportDiffHtml } from "@/export/html";
export { exportDiffPdf } from "@/export/pdf";

export type {
  Document,
  DocumentNode,
  DocumentNodeType,
} from "@/core/types/document";
export type {
  Change,
  ChangeType,
  Conflict,
  DiffResult,
  DiffStats,
  MergeResult,
  WordChange,
} from "@/core/types/diff-result";
export type { DiffOptions, ViewerOptions, ThemeConfig } from "@/core/types/options";
