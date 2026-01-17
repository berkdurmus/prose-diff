import type { Token } from "@/core/types/tokens";

const WORD_PATTERN = /[\p{L}\p{N}'-]+/u;
const PUNCTUATION_PATTERN = /[^\p{L}\p{N}\s]+/u;

export function tokenizeWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (/\s/.test(char)) {
      const start = index;
      while (index < text.length && /\s/.test(text[index])) {
        index += 1;
      }
      tokens.push({
        type: "whitespace",
        value: text.slice(start, index),
        start,
        end: index,
      });
      continue;
    }

    const wordMatch = text.slice(index).match(WORD_PATTERN);
    if (wordMatch && wordMatch.index === 0) {
      const value = wordMatch[0];
      tokens.push({
        type: "word",
        value,
        start: index,
        end: index + value.length,
      });
      index += value.length;
      continue;
    }

    const punctuationMatch = text.slice(index).match(PUNCTUATION_PATTERN);
    if (punctuationMatch && punctuationMatch.index === 0) {
      const value = punctuationMatch[0];
      tokens.push({
        type: "punctuation",
        value,
        start: index,
        end: index + value.length,
      });
      index += value.length;
      continue;
    }

    tokens.push({
      type: "punctuation",
      value: char,
      start: index,
      end: index + 1,
    });
    index += 1;
  }

  return tokens;
}
