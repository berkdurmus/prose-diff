import type { DiffResult } from "@/core/types/diff-result";

export function exportDiffHtml(result: DiffResult): string {
  const rows = result.changes
    .map((change) => {
      const before = change.before?.content ?? "";
      const after = change.after?.content ?? "";
      return `<tr><td>${change.type}</td><td>${before}</td><td>${after}</td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Prose Diff Export</title>
    <style>
      table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
      th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
      th { background: #f8fafc; }
    </style>
  </head>
  <body>
    <h1>Prose Diff Export</h1>
    <table>
      <thead>
        <tr><th>Type</th><th>Before</th><th>After</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
</html>`;
}
