export function normalizeText(
  text: string,
  options?: { ignoreWhitespace?: boolean; normalizeUnicode?: boolean },
): string {
  let result = text;
  if (options?.normalizeUnicode) {
    result = result.normalize("NFC");
  }
  if (options?.ignoreWhitespace) {
    result = result.replace(/\s+/g, " ").trim();
  }
  return result;
}
