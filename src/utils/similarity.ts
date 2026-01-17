import { levenshtein } from "@/utils/levenshtein";
import { lcsRatio } from "@/utils/lcs";

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (!setA.size && !setB.size) {
    return 1;
  }
  const intersection = new Set([...setA].filter((item) => setB.has(item)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export function ngramOverlap(a: string, b: string, size: number): number {
  if (!a.length && !b.length) {
    return 1;
  }
  if (!a.length || !b.length) {
    return 0;
  }
  const ngrams = (text: string) => {
    const values: string[] = [];
    for (let i = 0; i <= text.length - size; i += 1) {
      values.push(text.slice(i, i + size));
    }
    return values;
  };
  const aNgrams = ngrams(a);
  const bNgrams = new Set(ngrams(b));
  const matches = aNgrams.filter((value) => bNgrams.has(value)).length;
  return matches / Math.max(aNgrams.length, 1);
}

export function calculateSimilarity(a: string, b: string): number {
  if (!a.length && !b.length) {
    return 1;
  }
  if (!a.length || !b.length) {
    return 0;
  }
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  const scores = [
    jaccardSimilarity(tokensA, tokensB) * 0.3,
    (1 - levenshtein(a, b) / Math.max(a.length, b.length)) * 0.3,
    lcsRatio(a, b) * 0.2,
    ngramOverlap(a, b, 3) * 0.2,
  ];
  return scores.reduce((sum, value) => sum + value, 0);
}
