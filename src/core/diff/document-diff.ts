import { parseDocument } from "@/core/parser/document-tree";
import { diffSentences } from "@/core/diff/sentence-diff";
import { diffWords } from "@/core/diff/word-diff";
import { calculateSimilarity } from "@/utils/similarity";
import { tokenizeWords } from "@/core/parser/tokenizer";
import type { Document } from "@/core/types/document";
import type { Change, DiffResult, DiffStats } from "@/core/types/diff-result";
import type { DiffOptions } from "@/core/types/options";
import type { DocumentNode } from "@/core/types/document";

const DEFAULT_OPTIONS: Required<Pick<
  DiffOptions,
  "granularity" | "enableSemanticMatching" | "semanticThreshold"
>> = {
  granularity: "sentence",
  enableSemanticMatching: true,
  semanticThreshold: 0.6,
};

function flattenNodes(document: Document, type: DocumentNode["type"]): DocumentNode[] {
  const result: DocumentNode[] = [];
  const walk = (node: DocumentNode) => {
    if (node.type === type) {
      result.push(node);
    }
    (node.children ?? []).forEach(walk);
  };
  walk(document.root);
  return result;
}

function createStats(changes: Change[], beforeText: string, afterText: string): DiffStats {
  const additions = changes.filter((change) => change.type === "added").length;
  const deletions = changes.filter((change) => change.type === "removed").length;
  const modifications = changes.filter((change) => change.type === "modified").length;
  const moves = changes.filter((change) => change.type === "moved").length;
  const unchanged = changes.filter((change) => change.type === "unchanged").length;

  const wordsAdded = tokenizeWords(afterText).length;
  const wordsRemoved = tokenizeWords(beforeText).length;
  const wordsModified = changes.reduce((sum, change) => {
    if (!change.wordChanges) {
      return sum;
    }
    return (
      sum +
      change.wordChanges.filter(
        (wordChange) => wordChange.type === "added" || wordChange.type === "removed",
      ).length
    );
  }, 0);

  const total = additions + deletions + modifications + moves + unchanged;
  const percentChanged = total ? ((additions + deletions + modifications + moves) / total) * 100 : 0;

  return {
    additions,
    deletions,
    modifications,
    moves,
    unchanged,
    wordsAdded,
    wordsRemoved,
    wordsModified,
    percentChanged,
  };
}

function matchModified(
  removed: DocumentNode[],
  added: DocumentNode[],
  options: DiffOptions,
): { modified: Change[]; remainingRemoved: DocumentNode[]; remainingAdded: DocumentNode[] } {
  const modified: Change[] = [];
  const remainingRemoved = [...removed];
  const remainingAdded = [...added];
  const threshold = options.semanticThreshold ?? DEFAULT_OPTIONS.semanticThreshold;

  for (const before of removed) {
    let bestIndex = -1;
    let bestScore = 0;
    for (let i = 0; i < remainingAdded.length; i += 1) {
      const after = remainingAdded[i];
      const score = calculateSimilarity(before.content, after.content);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    if (bestIndex >= 0 && bestScore >= threshold) {
      const after = remainingAdded.splice(bestIndex, 1)[0];
      const beforeIndex = remainingRemoved.indexOf(before);
      if (beforeIndex >= 0) {
        remainingRemoved.splice(beforeIndex, 1);
      }
      modified.push({
        type: "modified",
        before,
        after,
        confidence: bestScore,
        wordChanges: diffWords(before.content, after.content),
      });
    }
  }

  return { modified, remainingRemoved, remainingAdded };
}

export function diffDocuments(
  beforeText: string,
  afterText: string,
  options: DiffOptions = {},
): DiffResult {
  const beforeDocument = parseDocument(beforeText, options);
  const afterDocument = parseDocument(afterText, options);
  const granularity = options.granularity ?? DEFAULT_OPTIONS.granularity;

  const beforeNodes =
    granularity === "paragraph"
      ? flattenNodes(beforeDocument, "paragraph")
      : flattenNodes(beforeDocument, "sentence");
  const afterNodes =
    granularity === "paragraph"
      ? flattenNodes(afterDocument, "paragraph")
      : flattenNodes(afterDocument, "sentence");

  const ops = diffSentences(beforeNodes, afterNodes);

  const changes: Change[] = [];
  let removedBuffer: DocumentNode[] = [];
  let addedBuffer: DocumentNode[] = [];

  const flushBuffers = () => {
    if (!removedBuffer.length && !addedBuffer.length) {
      return;
    }
    if (options.enableSemanticMatching ?? DEFAULT_OPTIONS.enableSemanticMatching) {
      const { modified, remainingRemoved, remainingAdded } = matchModified(
        removedBuffer,
        addedBuffer,
        options,
      );
      changes.push(...modified);
      remainingRemoved.forEach((node) => changes.push({ type: "removed", before: node }));
      remainingAdded.forEach((node) => changes.push({ type: "added", after: node }));
    } else {
      removedBuffer.forEach((node) => changes.push({ type: "removed", before: node }));
      addedBuffer.forEach((node) => changes.push({ type: "added", after: node }));
    }
    removedBuffer = [];
    addedBuffer = [];
  };

  for (const op of ops) {
    if (op.type === "unchanged") {
      flushBuffers();
      changes.push({
        type: "unchanged",
        before: op.value,
        after: op.value,
      });
    } else if (op.type === "removed") {
      removedBuffer.push(op.value);
    } else {
      addedBuffer.push(op.value);
    }
  }
  flushBuffers();

  return {
    changes,
    stats: createStats(changes, beforeText, afterText),
  };
}
