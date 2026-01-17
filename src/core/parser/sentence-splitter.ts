const ABBREVIATIONS = new Set([
  "dr",
  "mr",
  "mrs",
  "ms",
  "prof",
  "sr",
  "jr",
  "st",
  "vs",
  "etc",
  "e.g",
  "i.e",
  "u.s",
  "u.k",
]);

interface SentenceSpan {
  text: string;
  start: number;
  end: number;
}

function isAbbreviation(token: string): boolean {
  return ABBREVIATIONS.has(token.toLowerCase().replace(/\.$/, ""));
}

function isDecimal(text: string, index: number): boolean {
  const prev = text[index - 1];
  const next = text[index + 1];
  return Boolean(prev && next && /\d/.test(prev) && /\d/.test(next));
}

export function splitSentences(text: string): string[] {
  return splitSentencesWithOffsets(text).map((sentence) => sentence.text);
}

export function splitSentencesWithOffsets(text: string): SentenceSpan[] {
  const sentences: SentenceSpan[] = [];
  let start = 0;
  let index = 0;

  while (index < text.length) {
    const char = text[index];
    if (char === "." || char === "!" || char === "?") {
      if (isDecimal(text, index)) {
        index += 1;
        continue;
      }

      const slice = text.slice(start, index + 1);
      const tokenMatch = slice.trim().split(/\s+/).pop() ?? "";
      if (isAbbreviation(tokenMatch)) {
        index += 1;
        continue;
      }

      let end = index + 1;
      while (end < text.length && /["')\]]/.test(text[end])) {
        end += 1;
      }

      const nextChar = text[end];
      if (nextChar && !/\s/.test(nextChar)) {
        index += 1;
        continue;
      }

      const sentence = text.slice(start, end).trim();
      if (sentence) {
        sentences.push({
          text: sentence,
          start,
          end,
        });
      }
      start = end;
      index = end;
      continue;
    }
    index += 1;
  }

  const remainder = text.slice(start).trim();
  if (remainder) {
    sentences.push({
      text: remainder,
      start,
      end: text.length,
    });
  }

  return sentences;
}
