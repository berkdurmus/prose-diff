export function yjsToText(doc: { toString?: () => string; toJSON?: () => unknown }): string {
  if (doc.toString) {
    return doc.toString();
  }
  if (doc.toJSON) {
    return JSON.stringify(doc.toJSON(), null, 2);
  }
  return "";
}
