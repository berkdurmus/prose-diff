import type { Conflict } from "@/core/types/diff-result";
import type { DocumentNode } from "@/core/types/document";

export function resolveConflict(
  conflict: Conflict,
  resolution: "left" | "right" | "both" | "custom",
  customText?: string,
): DocumentNode {
  if (resolution === "left") {
    return conflict.left;
  }
  if (resolution === "right") {
    return conflict.right;
  }
  if (resolution === "both") {
    return {
      ...conflict.left,
      content: `${conflict.left.content}\n${conflict.right.content}`,
    };
  }
  return {
    ...conflict.left,
    content: customText ?? conflict.left.content,
  };
}
