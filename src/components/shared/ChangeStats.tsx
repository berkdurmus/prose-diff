import type { DiffStats } from "@/core/types/diff-result";
import { resolveTheme } from "@/components/shared/theme";
import type { ThemeConfig } from "@/core/types/options";

interface ChangeStatsProps {
  stats: DiffStats;
  theme?: ThemeConfig | "light" | "dark" | "system";
}

export function ChangeStats({ stats, theme }: ChangeStatsProps) {
  const colors = resolveTheme(theme);
  return (
    <div
      style={{
        background: colors.muted,
        color: colors.foreground,
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span>Added: {stats.additions}</span>
      <span>Removed: {stats.deletions}</span>
      <span>Modified: {stats.modifications}</span>
      <span>Changed: {stats.percentChanged.toFixed(1)}%</span>
    </div>
  );
}
