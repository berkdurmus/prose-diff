import type { Change } from "@/core/types/diff-result";
import { ChangeHighlight } from "@/components/shared/ChangeHighlight";
import { ChangeTypeIcon } from "@/components/shared/ChangeTypeIcon";
import type { ThemeConfig } from "@/core/types/options";
import { resolveTheme } from "@/components/shared/theme";

interface ChangeBlockProps {
  change: Change;
  theme?: ThemeConfig | "light" | "dark" | "system";
  onSelect?: (change: Change) => void;
}

export function ChangeBlock({ change, theme, onSelect }: ChangeBlockProps) {
  const colors = resolveTheme(theme);
  const background =
    change.type === "added"
      ? colors.addition
      : change.type === "removed"
        ? colors.deletion
        : change.type === "modified"
          ? colors.modification
          : "transparent";

  return (
    <div
      role="listitem"
      onClick={() => onSelect?.(change)}
      style={{
        padding: "6px 8px",
        borderRadius: 6,
        marginBottom: 6,
        background,
      }}
    >
      <ChangeTypeIcon type={change.type} />{" "}
      {change.type === "modified" && change.wordChanges ? (
        <ChangeHighlight changes={change.wordChanges} theme={theme} />
      ) : (
        <span>{change.after?.content ?? change.before?.content ?? ""}</span>
      )}
    </div>
  );
}
