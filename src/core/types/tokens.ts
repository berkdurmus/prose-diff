export type TokenType = "word" | "whitespace" | "punctuation";

export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}
