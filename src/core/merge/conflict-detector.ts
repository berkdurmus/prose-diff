import { diffDocuments } from "@/core/diff/document-diff";
import type { Conflict } from "@/core/types/diff-result";
import type { DiffOptions } from "@/core/types/options";

export function detectConflicts(
  base: string,
  left: string,
  right: string,
  options?: DiffOptions,
): Conflict[] {
  const leftDiff = diffDocuments(base, left, options);
  const rightDiff = diffDocuments(base, right, options);

  const conflicts: Conflict[] = [];
  const max = Math.max(leftDiff.changes.length, rightDiff.changes.length);

  for (let i = 0; i < max; i += 1) {
    const leftChange = leftDiff.changes[i];
    const rightChange = rightDiff.changes[i];
    if (!leftChange || !rightChange) {
      continue;
    }
    const leftChanged = leftChange.type !== "unchanged";
    const rightChanged = rightChange.type !== "unchanged";
    if (leftChanged && rightChanged) {
      const leftContent = leftChange.after?.content ?? leftChange.before?.content ?? "";
      const rightContent = rightChange.after?.content ?? rightChange.before?.content ?? "";
      if (leftContent !== rightContent && leftChange.before && rightChange.before) {
        conflicts.push({
          base: leftChange.before,
          left: leftChange.after ?? leftChange.before,
          right: rightChange.after ?? rightChange.before,
        });
      }
    }
  }

  return conflicts;
}
