import type { DocumentNode } from "./document";

export type ChangeType =
  | "unchanged"
  | "added"
  | "removed"
  | "modified"
  | "moved";

export interface WordChange {
  type: ChangeType;
  before?: string;
  after?: string;
  position: number;
}

export interface Change {
  type: ChangeType;
  before?: DocumentNode;
  after?: DocumentNode;
  wordChanges?: WordChange[];
  confidence?: number;
  movedFrom?: number;
  movedTo?: number;
}

export interface Conflict {
  base: DocumentNode;
  left: DocumentNode;
  right: DocumentNode;
  resolved?: DocumentNode;
  resolutionType?: "left" | "right" | "both" | "custom";
}

export interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
  moves: number;
  unchanged: number;
  wordsAdded: number;
  wordsRemoved: number;
  wordsModified: number;
  percentChanged: number;
}

export interface DiffResult {
  changes: Change[];
  stats: DiffStats;
  conflicts?: Conflict[];
}

export interface MergeResult {
  base: DocumentNode;
  merged: DocumentNode;
  conflicts: Conflict[];
}
