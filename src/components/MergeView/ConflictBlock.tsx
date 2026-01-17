import type { Conflict } from "@/core/types/diff-result";

interface ConflictBlockProps {
  conflict: Conflict;
  onAcceptLeft: () => void;
  onAcceptRight: () => void;
  onAcceptBoth: () => void;
}

export function ConflictBlock({
  conflict,
  onAcceptLeft,
  onAcceptRight,
  onAcceptBoth,
}: ConflictBlockProps) {
  return (
    <div style={{ border: "1px solid #e2e8f0", padding: 12, borderRadius: 8 }}>
      <p>Conflict detected</p>
      <div style={{ display: "grid", gap: 8 }}>
        <pre>{conflict.left.content}</pre>
        <pre>{conflict.right.content}</pre>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={onAcceptLeft}>
          Accept Left
        </button>
        <button type="button" onClick={onAcceptRight}>
          Accept Right
        </button>
        <button type="button" onClick={onAcceptBoth}>
          Accept Both
        </button>
      </div>
    </div>
  );
}
