import type { DiffResult } from "@/core/types/diff-result";
import { exportDiffHtml } from "@/export/html";

export function exportDiffPdf(result: DiffResult): string {
  return exportDiffHtml(result);
}
