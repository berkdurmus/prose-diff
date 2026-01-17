interface ParagraphSpan {
  text: string;
  start: number;
  end: number;
}

export function splitParagraphs(text: string): ParagraphSpan[] {
  const paragraphs: ParagraphSpan[] = [];
  const parts = text.split(/\n{2,}/);
  let cursor = 0;

  for (const part of parts) {
    const start = text.indexOf(part, cursor);
    const end = start + part.length;
    cursor = end;
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    paragraphs.push({
      text: trimmed,
      start,
      end,
    });
  }

  return paragraphs;
}
