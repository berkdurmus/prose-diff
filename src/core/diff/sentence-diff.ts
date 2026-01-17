import { patienceDiff } from "@/core/diff/patience";
import { myersDiff, type DiffOp } from "@/core/diff/myers";
import type { DocumentNode } from "@/core/types/document";

export function diffSentences(
  before: DocumentNode[],
  after: DocumentNode[],
): DiffOp<DocumentNode>[] {
  if (!before.length && !after.length) {
    return [];
  }
  if (!before.length || !after.length) {
    return myersDiff(before, after);
  }
  const ops = patienceDiff(before, after, (node) => node.hash);
  if (!ops.length) {
    return myersDiff(before, after);
  }
  return ops;
}
