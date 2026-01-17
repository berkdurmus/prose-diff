import { longestCommonSubsequence } from "@/utils/lcs";
import { myersDiff, type DiffOp } from "@/core/diff/myers";

interface UniqueEntry<T> {
  item: T;
  index: number;
  hash: string;
}

export function patienceDiff<T>(
  a: T[],
  b: T[],
  hash: (item: T) => string,
): DiffOp<T>[] {
  const uniqueA = findUnique(a, hash);
  const uniqueB = findUnique(b, hash);
  const commonHashes = new Set(
    uniqueA.filter((entry) => uniqueB.some((bEntry) => bEntry.hash === entry.hash)).map((entry) => entry.hash),
  );
  const anchors = longestCommonSubsequence(
    uniqueA.filter((entry) => commonHashes.has(entry.hash)),
    uniqueB.filter((entry) => commonHashes.has(entry.hash)),
    (left, right) => left.hash === right.hash,
  );

  const ops: DiffOp<T>[] = [];
  let aIndex = 0;
  let bIndex = 0;

  for (const anchor of anchors) {
    const targetA = anchor.index;
    const targetB = uniqueB.find((entry) => entry.hash === anchor.hash)?.index ?? 0;
    ops.push(...myersDiff(a.slice(aIndex, targetA), b.slice(bIndex, targetB)));
    ops.push({
      type: "unchanged",
      value: a[targetA],
      indexA: targetA,
      indexB: targetB,
    });
    aIndex = targetA + 1;
    bIndex = targetB + 1;
  }

  ops.push(...myersDiff(a.slice(aIndex), b.slice(bIndex)));
  return ops;
}

function findUnique<T>(items: T[], hash: (item: T) => string): UniqueEntry<T>[] {
  const counts = new Map<string, number>();
  const hashed = items.map((item, index) => ({ item, index, hash: hash(item) }));
  hashed.forEach((entry) => {
    counts.set(entry.hash, (counts.get(entry.hash) ?? 0) + 1);
  });
  return hashed.filter((entry) => (counts.get(entry.hash) ?? 0) === 1);
}

