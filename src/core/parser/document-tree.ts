import { hashString } from "@/utils/hash";
import { normalizeText } from "@/utils/normalize";
import { splitParagraphs } from "@/core/parser/paragraph-parser";
import { splitSentencesWithOffsets } from "@/core/parser/sentence-splitter";
import { tokenizeWords } from "@/core/parser/tokenizer";
import type { Document, DocumentNode } from "@/core/types/document";
import type { DiffOptions } from "@/core/types/options";

let idCounter = 0;

function createNode(
  type: DocumentNode["type"],
  content: string,
  start: number,
  end: number,
  children?: DocumentNode[],
): DocumentNode {
  idCounter += 1;
  return {
    type,
    content,
    start,
    end,
    children,
    hash: hashString(content),
    id: `node_${idCounter}`,
  };
}

export function parseDocument(text: string, options?: DiffOptions): Document {
  const normalized = normalizeText(text, {
    ignoreWhitespace: options?.ignoreWhitespace,
    normalizeUnicode: options?.normalizeUnicode,
  });

  const paragraphs = splitParagraphs(normalized);
  const paragraphNodes: DocumentNode[] = paragraphs.map((paragraph) => {
    const sentences = splitSentencesWithOffsets(paragraph.text);
    const sentenceNodes = sentences.map((sentence) => {
      const words = tokenizeWords(sentence.text);
      const wordNodes = words.map((word) =>
        createNode(
          "word",
          word,
          paragraph.start + sentence.start,
          paragraph.start + sentence.end,
        ),
      );
      return createNode(
        "sentence",
        sentence.text,
        paragraph.start + sentence.start,
        paragraph.start + sentence.end,
        wordNodes,
      );
    });
    return createNode(
      "paragraph",
      paragraph.text,
      paragraph.start,
      paragraph.end,
      sentenceNodes,
    );
  });

  const root = createNode("document", normalized, 0, normalized.length, paragraphNodes);

  return {
    root,
    text: normalized,
    metadata: {
      wordCount: paragraphNodes.reduce((sum, paragraph) => {
        const sentences = paragraph.children ?? [];
        const words = sentences.flatMap((sentence) => sentence.children ?? []);
        return sum + words.length;
      }, 0),
      sentenceCount: paragraphNodes.reduce(
        (sum, paragraph) => sum + (paragraph.children?.length ?? 0),
        0,
      ),
      paragraphCount: paragraphNodes.length,
    },
  };
}
