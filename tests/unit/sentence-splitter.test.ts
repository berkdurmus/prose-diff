import { describe, it, expect } from "vitest";
import { splitSentences } from "@/core/parser/sentence-splitter";

describe("splitSentences", () => {
  it("handles basic sentences", () => {
    const text = "Hello world. How are you? I am fine!";
    expect(splitSentences(text)).toEqual(["Hello world.", "How are you?", "I am fine!"]);
  });

  it("handles abbreviations", () => {
    const text = "Dr. Smith went to Washington D.C. He liked it.";
    expect(splitSentences(text)).toEqual([
      "Dr. Smith went to Washington D.C.",
      "He liked it.",
    ]);
  });

  it("handles quotes", () => {
    const text = 'She said, "Hello." Then she left.';
    expect(splitSentences(text)).toEqual(['She said, "Hello."', "Then she left."]);
  });

  it("handles ellipsis", () => {
    const text = "Wait... What happened? I don't know.";
    expect(splitSentences(text)).toEqual(["Wait...", "What happened?", "I don't know."]);
  });
});
