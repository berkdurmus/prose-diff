export function prosemirrorToText(node: { textContent?: string; toJSON?: () => unknown }): string {
  if (node.textContent) {
    return node.textContent;
  }
  if (node.toJSON) {
    return JSON.stringify(node.toJSON(), null, 2);
  }
  return "";
}
