import type { ThemeConfig } from "@/core/types/options";

export const lightTheme: ThemeConfig = {
  background: "#ffffff",
  foreground: "#0f172a",
  addition: "#d1fae5",
  deletion: "#fee2e2",
  modification: "#fef3c7",
  muted: "#f1f5f9",
};

export const darkTheme: ThemeConfig = {
  background: "#0f172a",
  foreground: "#f8fafc",
  addition: "#064e3b",
  deletion: "#7f1d1d",
  modification: "#78350f",
  muted: "#1f2937",
};

export function resolveTheme(
  theme: "light" | "dark" | "system" | ThemeConfig | undefined,
): ThemeConfig {
  if (!theme || theme === "system") {
    return lightTheme;
  }
  if (theme === "light") {
    return lightTheme;
  }
  if (theme === "dark") {
    return darkTheme;
  }
  return theme;
}
