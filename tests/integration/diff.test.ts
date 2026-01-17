import { describe, it, expect } from "vitest";
import { diffDocuments } from "@/core/diff/document-diff";

describe("diff integration", () => {
  it("detects word changes within sentences", () => {
    const before = "The quick brown fox jumps over the lazy dog.";
    const after = "The swift brown fox leaps over the sleepy dog.";

    const result = diffDocuments(before, after);

    expect(result.changes).toHaveLength(1);
    expect(result.changes[0].type).toBe("modified");
    expect(result.changes[0].wordChanges).toEqual(
      expect.arrayContaining([expect.objectContaining({ before: "quick" })]),
    );
  });

  it("detects added paragraphs", () => {
    const before = "Paragraph one.\n\nParagraph two.";
    const after = "Paragraph one.\n\nNew paragraph.\n\nParagraph two.";

    const result = diffDocuments(before, after, { granularity: "paragraph" });

    expect(result.stats.additions).toBeGreaterThan(0);
  });
});
