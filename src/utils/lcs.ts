export function longestCommonSubsequence<T>(
  a: T[],
  b: T[],
  equals: (left: T, right: T) => boolean = (left, right) => left === right,
): T[] {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0),
  );

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (equals(a[i - 1], b[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: T[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 && j > 0) {
    if (equals(a[i - 1], b[j - 1])) {
      result.unshift(a[i - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  return result;
}

export function lcsRatio(a: string, b: string): number {
  if (!a.length && !b.length) {
    return 1;
  }
  if (!a.length || !b.length) {
    return 0;
  }
  const lcs = longestCommonSubsequence(a.split(""), b.split(""));
  return lcs.length / Math.max(a.length, b.length);
}
