import { calculateSimilarity } from "@/utils/similarity";
import type { DocumentNode } from "@/core/types/document";

export function findBestSemanticMatch(
  source: DocumentNode,
  candidates: DocumentNode[],
): { match?: DocumentNode; score: number } {
  let bestScore = 0;
  let match: DocumentNode | undefined;
  for (const candidate of candidates) {
    const score = calculateSimilarity(source.content, candidate.content);
    if (score > bestScore) {
      bestScore = score;
      match = candidate;
    }
  }
  return { match, score: bestScore };
}
