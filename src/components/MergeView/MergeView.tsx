import { useMemo, useState } from "react";
import { merge3 } from "@/core/merge/three-way";
import { resolveConflict } from "@/core/merge/resolution";
import type { Conflict } from "@/core/types/diff-result";

interface MergeViewProps {
  base: string;
  left: string;
  right: string;
  leftLabel?: string;
  rightLabel?: string;
  onResolve?: (conflicts: Conflict[]) => void;
}

export function MergeView({
  base,
  left,
  right,
  leftLabel = "Left",
  rightLabel = "Right",
  onResolve,
}: MergeViewProps) {
  const initial = useMemo(() => merge3(base, left, right), [base, left, right]);
  const [conflicts, setConflicts] = useState<Conflict[]>(initial.conflicts);

  const resolve = (conflict: Conflict, resolution: "left" | "right" | "both" | "custom") => {
    const resolved = resolveConflict(conflict, resolution);
    const next = conflicts.map((item) =>
      item.base.id === conflict.base.id ? { ...item, resolved, resolutionType: resolution } : item,
    );
    setConflicts(next);
    onResolve?.(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {conflicts.length === 0 && <p>No conflicts detected.</p>}
      {conflicts.map((conflict) => (
        <div key={conflict.base.id} style={{ border: "1px solid #e2e8f0", padding: 12 }}>
          <pre>{conflict.left.content}</pre>
          <pre>{conflict.right.content}</pre>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => resolve(conflict, "left")}>
              Accept {leftLabel}
            </button>
            <button type="button" onClick={() => resolve(conflict, "right")}>
              Accept {rightLabel}
            </button>
            <button type="button" onClick={() => resolve(conflict, "both")}>
              Accept Both
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
