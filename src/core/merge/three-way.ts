import { parseDocument } from "@/core/parser/document-tree";
import { detectConflicts } from "@/core/merge/conflict-detector";
import type { MergeResult } from "@/core/types/diff-result";
import type { DiffOptions } from "@/core/types/options";
import type { DocumentNode } from "@/core/types/document";

export function merge3(
  base: string,
  left: string,
  right: string,
  options?: DiffOptions,
): MergeResult {
  const baseDoc = parseDocument(base, options);
  const conflicts = detectConflicts(base, left, right, options);

  const mergedContent = resolveMergeContent(baseDoc.root, conflicts);

  return {
    base: baseDoc.root,
    merged: mergedContent,
    conflicts,
  };
}

function resolveMergeContent(baseNode: DocumentNode, conflicts: MergeResult["conflicts"]): DocumentNode {
  if (!baseNode.children?.length) {
    return baseNode;
  }
  const conflictMap = new Map(conflicts.map((conflict) => [conflict.base.id, conflict]));
  const children = baseNode.children.map((child) => {
    const conflict = conflictMap.get(child.id);
    if (!conflict) {
      return child;
    }
    return conflict.resolved ?? conflict.base;
  });
  return {
    ...baseNode,
    children,
  };
}
