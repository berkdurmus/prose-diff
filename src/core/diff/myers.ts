export type DiffOpType = "added" | "removed" | "unchanged";

export interface DiffOp<T> {
  type: DiffOpType;
  value: T;
  indexA?: number;
  indexB?: number;
}

export function myersDiff<T>(
  a: T[],
  b: T[],
  equals: (left: T, right: T) => boolean = (left, right) => left === right,
): DiffOp<T>[] {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const v = new Map<number, number>();
  v.set(1, 0);

  const traces: Map<number, number>[] = [];

  for (let d = 0; d <= max; d += 1) {
    const snapshot = new Map(v);
    traces.push(snapshot);
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
        x = v.get(k + 1) ?? 0;
      } else {
        x = (v.get(k - 1) ?? 0) + 1;
      }
      let y = x - k;
      while (x < n && y < m && equals(a[x], b[y])) {
        x += 1;
        y += 1;
      }
      v.set(k, x);
      if (x >= n && y >= m) {
        return buildDiff(a, b, traces, equals);
      }
    }
  }

  return [];
}

function buildDiff<T>(
  a: T[],
  b: T[],
  traces: Map<number, number>[],
  equals: (left: T, right: T) => boolean,
): DiffOp<T>[] {
  const ops: DiffOp<T>[] = [];
  let x = a.length;
  let y = b.length;

  for (let d = traces.length - 1; d >= 0; d -= 1) {
    const v = traces[d];
    const k = x - y;
    let prevK: number;

    if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = v.get(prevK) ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      x -= 1;
      y -= 1;
      ops.unshift({
        type: "unchanged",
        value: a[x],
        indexA: x,
        indexB: y,
      });
    }

    if (d === 0) {
      break;
    }

    if (x === prevX) {
      y -= 1;
      ops.unshift({
        type: "added",
        value: b[y],
        indexB: y,
      });
    } else {
      x -= 1;
      ops.unshift({
        type: "removed",
        value: a[x],
        indexA: x,
      });
    }
  }

  return ops;
}
