import { myersDiff } from "@/core/diff/myers";
import { tokenizeWords } from "@/core/parser/tokenizer";
import type { WordChange } from "@/core/types/diff-result";

export function diffWords(before: string, after: string): WordChange[] {
  const wordsA = tokenizeWords(before);
  const wordsB = tokenizeWords(after);
  const ops = myersDiff(wordsA, wordsB);

  return ops.map((op, index) => ({
    type: op.type,
    before: op.type !== "added" ? op.value : undefined,
    after: op.type !== "removed" ? op.value : undefined,
    position: index,
  }));
}
