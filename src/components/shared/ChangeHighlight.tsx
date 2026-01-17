import type { WordChange } from "@/core/types/diff-result";
import { resolveTheme } from "@/components/shared/theme";
import type { ThemeConfig } from "@/core/types/options";

interface ChangeHighlightProps {
  changes: WordChange[];
  theme?: ThemeConfig | "light" | "dark" | "system";
}

export function ChangeHighlight({ changes, theme }: ChangeHighlightProps) {
  const colors = resolveTheme(theme);
  return (
    <span>
      {changes.map((change, index) => {
        const content = change.after ?? change.before ?? "";
        if (change.type === "unchanged") {
          return <span key={`${content}-${index}`}>{content} </span>;
        }
        if (change.type === "added") {
          return (
            <mark
              key={`${content}-${index}`}
              style={{ backgroundColor: colors.addition, padding: "0 2px" }}
            >
              {content}{" "}
            </mark>
          );
        }
        if (change.type === "removed") {
          return (
            <mark
              key={`${content}-${index}`}
              style={{
                backgroundColor: colors.deletion,
                textDecoration: "line-through",
                padding: "0 2px",
              }}
            >
              {content}{" "}
            </mark>
          );
        }
        return (
          <mark
            key={`${content}-${index}`}
            style={{ backgroundColor: colors.modification, padding: "0 2px" }}
          >
            {content}{" "}
          </mark>
        );
      })}
    </span>
  );
}
