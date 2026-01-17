import type { ChangeType } from "@/core/types/diff-result";

const LABELS: Record<ChangeType, string> = {
  unchanged: "*",
  added: "+",
  removed: "-",
  modified: "~",
  moved: "M",
};

export function ChangeTypeIcon({ type }: { type: ChangeType }) {
  return <span aria-hidden="true">{LABELS[type]}</span>;
}
