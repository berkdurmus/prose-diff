import { diffDocuments } from "@/core/diff/document-diff";

self.onmessage = (event: MessageEvent<{ before: string; after: string }>) => {
  const { before, after } = event.data;
  const result = diffDocuments(before, after);
  self.postMessage(result);
};
