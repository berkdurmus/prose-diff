import { diffDocuments } from "@/core/diff/document-diff";
import { prosemirrorToText } from "@/integrations/prosemirror/pm-adapter";
import type { DiffOptions } from "@/core/types/options";

export function diffProseMirror(
  before: { textContent?: string; toJSON?: () => unknown },
  after: { textContent?: string; toJSON?: () => unknown },
  options?: DiffOptions,
) {
  return diffDocuments(prosemirrorToText(before), prosemirrorToText(after), options);
}
