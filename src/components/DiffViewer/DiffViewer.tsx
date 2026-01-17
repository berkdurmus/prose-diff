import type { DiffOptions, ViewerOptions } from "@/core/types/options";
import { useDiff } from "@/components/hooks/useDiff";
import { useKeyboardNav } from "@/components/hooks/useKeyboardNav";
import { SideBySideView } from "@/components/SideBySideView/SideBySideView";
import { InlineView } from "@/components/InlineView/InlineView";
import { ChangeStats } from "@/components/shared/ChangeStats";
import { Navigation } from "@/components/shared/Navigation";

interface DiffViewerProps extends ViewerOptions {
  before: string;
  after: string;
  diffOptions?: DiffOptions;
}

export function DiffViewer({
  before,
  after,
  diffOptions,
  mode = "side-by-side",
  theme,
  showStats = true,
  enableNavigation = true,
  enableKeyboardShortcuts = true,
  collapseThreshold = 8,
  onChangeSelect,
}: DiffViewerProps & { collapseThreshold?: number }) {
  const { changes, stats, navigation } = useDiff(before, after, diffOptions);
  useKeyboardNav(navigation.next, navigation.prev, enableKeyboardShortcuts && enableNavigation);

  const viewProps = {
    changes,
    theme,
    onSelect: onChangeSelect,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {showStats && <ChangeStats stats={stats} theme={theme} />}
      {enableNavigation && navigation.total > 0 && (
        <Navigation
          currentIndex={navigation.currentIndex}
          total={navigation.total}
          onNext={navigation.next}
          onPrev={navigation.prev}
        />
      )}
      {mode === "side-by-side" && <SideBySideView {...viewProps} />}
      {mode === "inline" && (
        <InlineView {...viewProps} collapseThreshold={collapseThreshold} />
      )}
      {mode === "hybrid" && (
        <InlineView {...viewProps} collapseThreshold={collapseThreshold} />
      )}
    </div>
  );
}
