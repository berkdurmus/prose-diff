import { useRef } from "react";
import type { Change } from "@/core/types/diff-result";
import { ChangeHighlight } from "@/components/shared/ChangeHighlight";
import { ChangeTypeIcon } from "@/components/shared/ChangeTypeIcon";
import type { ThemeConfig } from "@/core/types/options";
import { resolveTheme } from "@/components/shared/theme";
import { useSyncScroll } from "@/components/hooks/useSyncScroll";

interface SideBySideViewProps {
  changes: Change[];
  theme?: ThemeConfig | "light" | "dark" | "system";
  onSelect?: (change: Change) => void;
}

export function SideBySideView({ changes, theme, onSelect }: SideBySideViewProps) {
  const colors = resolveTheme(theme);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useSyncScroll(leftRef, rightRef);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div ref={leftRef} style={{ maxHeight: 480, overflow: "auto" }}>
        {changes.map((change, index) => (
          <div
            key={`left-${index}`}
            role="listitem"
            onClick={() => onSelect?.(change)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 8,
              background:
                change.type === "removed" || change.type === "modified"
                  ? colors.deletion
                  : colors.muted,
            }}
          >
            <ChangeTypeIcon type={change.type} />{" "}
            {change.type === "modified" && change.wordChanges ? (
              <ChangeHighlight changes={change.wordChanges} theme={theme} />
            ) : (
              <span>{change.before?.content ?? ""}</span>
            )}
          </div>
        ))}
      </div>
      <div ref={rightRef} style={{ maxHeight: 480, overflow: "auto" }}>
        {changes.map((change, index) => (
          <div
            key={`right-${index}`}
            role="listitem"
            onClick={() => onSelect?.(change)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              marginBottom: 8,
              background:
                change.type === "added" || change.type === "modified"
                  ? colors.addition
                  : colors.muted,
            }}
          >
            <ChangeTypeIcon type={change.type} />{" "}
            {change.type === "modified" && change.wordChanges ? (
              <ChangeHighlight changes={change.wordChanges} theme={theme} />
            ) : (
              <span>{change.after?.content ?? ""}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
