import type { DiffResult } from "@/core/types/diff-result";

export function diffAsync(before: string, after: string): Promise<DiffResult> {
  const worker = new Worker(new URL("./diff.worker.ts", import.meta.url), {
    type: "module",
  });
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      resolve(event.data as DiffResult);
      worker.terminate();
    };
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
    worker.postMessage({ before, after });
  });
}
