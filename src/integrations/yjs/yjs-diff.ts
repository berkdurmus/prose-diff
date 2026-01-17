import { diffDocuments } from "@/core/diff/document-diff";
import { yjsToText } from "@/integrations/yjs/yjs-adapter";
import type { DiffOptions } from "@/core/types/options";

export function diffYjs(
  beforeDoc: { toString?: () => string; toJSON?: () => unknown },
  afterDoc: { toString?: () => string; toJSON?: () => unknown },
  options?: DiffOptions,
) {
  return diffDocuments(yjsToText(beforeDoc), yjsToText(afterDoc), options);
}
