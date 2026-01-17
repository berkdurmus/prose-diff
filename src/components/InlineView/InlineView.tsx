import { useMemo, useState } from "react";
import type { Change } from "@/core/types/diff-result";
import { ChangeBlock } from "@/components/InlineView/ChangeBlock";
import { CollapsedSection } from "@/components/InlineView/CollapsedSection";
import type { ThemeConfig } from "@/core/types/options";

interface InlineViewProps {
  changes: Change[];
  theme?: ThemeConfig | "light" | "dark" | "system";
  collapseThreshold?: number;
  onSelect?: (change: Change) => void;
}

export function InlineView({
  changes,
  theme,
  collapseThreshold = 8,
  onSelect,
}: InlineViewProps) {
  const [expanded, setExpanded] = useState(false);

  const unchangedBlocks = useMemo(
    () => changes.filter((change) => change.type === "unchanged").length,
    [changes],
  );

  const shouldCollapse = !expanded && unchangedBlocks > collapseThreshold;

  return (
    <div>
      {shouldCollapse && (
        <CollapsedSection
          hiddenCount={unchangedBlocks - collapseThreshold}
          onExpand={() => setExpanded(true)}
        />
      )}
      {changes
        .filter((change, index) => !shouldCollapse || change.type !== "unchanged" || index < collapseThreshold)
        .map((change, index) => (
          <ChangeBlock key={`${change.type}-${index}`} change={change} theme={theme} onSelect={onSelect} />
        ))}
    </div>
  );
}
