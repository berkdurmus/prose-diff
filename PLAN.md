# Prose Diff

**Semantic Diff Viewer for Collaborative Writing**

A React library that provides intelligent, human-readable comparisons between text versions. Unlike traditional line-based diffs designed for code, Prose Diff understands natural language structure and shows changes at the sentence, paragraph, and section level.

---

## Table of Contents

1. [Vision & Problem Statement](#vision--problem-statement)
2. [Core Features](#core-features)
3. [Technical Architecture](#technical-architecture)
4. [Data Structures](#data-structures)
5. [Diff Algorithm Deep Dive](#diff-algorithm-deep-dive)
6. [Component Library](#component-library)
7. [API Reference](#api-reference)
8. [Implementation Phases](#implementation-phases)
9. [Tech Stack](#tech-stack)
10. [Testing Strategy](#testing-strategy)
11. [Performance Considerations](#performance-considerations)
12. [Accessibility](#accessibility)
13. [Future Roadmap](#future-roadmap)
14. [Contributing](#contributing)

---

## Vision & Problem Statement

### The Problem

Traditional diff tools (like `git diff`) are optimized for code:

- They compare line-by-line
- They assume lines are independent units
- They don't understand semantic meaning

For prose, this creates terrible user experiences:

```diff
- The quick brown fox jumps over the lazy dog.
+ The swift brown fox leaps over the sleepy dog.
```

A line-based diff shows the entire sentence as changed. But a writer wants to see:

- "quick" → "swift"
- "jumps" → "leaps"
- "lazy" → "sleepy"

### The Vision

Prose Diff treats text as a hierarchy of semantic units:

- **Document** → Sections → Paragraphs → Sentences → Words → Characters

Changes are detected and displayed at the most appropriate level, making it easy for writers and editors to understand exactly what changed.

### Use Cases

1. **Beta Reader Feedback**: See exactly what edits a beta reader suggested
2. **Co-authoring**: Review changes from collaborators before merging
3. **Revision Tracking**: Compare any two versions of a manuscript
4. **Editor Workflow**: Professional editors can show authors proposed changes
5. **Version Control**: Git-like history for creative writing projects

---

## Core Features

### MVP Features (Phase 1)

- [ ] **Sentence-level diff detection**

  - Identify added, removed, and modified sentences
  - Handle sentence boundary detection (periods, question marks, etc.)

- [ ] **Word-level highlighting within sentences**

  - When a sentence is modified, highlight specific word changes
  - Support for moved words within sentences

- [ ] **Three view modes**

  - Side-by-side view
  - Inline/unified view
  - Hybrid view (paragraphs side-by-side, changes inline)

- [ ] **Change statistics**
  - Words added/removed/modified
  - Sentences added/removed/modified
  - Percentage changed

### Enhanced Features (Phase 2)

- [ ] **Paragraph restructuring detection**

  - Detect when paragraphs are moved, split, or merged
  - Visual indicators for structural changes

- [ ] **Semantic similarity matching**

  - Identify rephrased content (same meaning, different words)
  - Confidence scores for "same content" detection

- [ ] **Change categorization**

  - Cosmetic (punctuation, formatting)
  - Minor (word choice, small edits)
  - Major (new content, deletions, restructuring)

- [ ] **Navigation and filtering**
  - Jump to next/previous change
  - Filter by change type
  - Collapse unchanged sections

### Advanced Features (Phase 3)

- [ ] **Three-way merge UI**

  - Base version, Version A, Version B
  - Conflict detection and resolution interface
  - Accept/reject individual changes

- [ ] **CRDT Integration**

  - Native support for Yjs documents
  - Real-time diff updates
  - Collaborative conflict resolution

- [ ] **Comments on changes**

  - Annotate specific changes with notes
  - Discussion threads on contentious edits

- [ ] **Export capabilities**
  - Export diff as HTML report
  - Export as PDF with change tracking
  - Generate change summary document

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Prose Diff Library                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Parsing    │    │   Diffing    │    │    Rendering     │  │
│  │    Layer     │───▶│    Engine    │───▶│    Components    │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                   │                     │             │
│         ▼                   ▼                     ▼             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Tokenizer   │    │  Myers Diff  │    │   DiffViewer     │  │
│  │  Sentence    │    │  Patience    │    │   SideBySide     │  │
│  │  Paragraph   │    │  Semantic    │    │   InlineView     │  │
│  │  Section     │    │  Matching    │    │   MergeView      │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Module Breakdown

```
prose-diff/
├── src/
│   ├── core/
│   │   ├── parser/
│   │   │   ├── tokenizer.ts          # Text → tokens
│   │   │   ├── sentence-splitter.ts  # Sentence boundary detection
│   │   │   ├── paragraph-parser.ts   # Paragraph structure
│   │   │   └── document-tree.ts      # Hierarchical document model
│   │   │
│   │   ├── diff/
│   │   │   ├── myers.ts              # Myers diff algorithm
│   │   │   ├── patience.ts           # Patience diff (better for prose)
│   │   │   ├── semantic-matcher.ts   # Similarity detection
│   │   │   ├── word-diff.ts          # Word-level diffing
│   │   │   ├── sentence-diff.ts      # Sentence-level diffing
│   │   │   └── document-diff.ts      # Full document diffing
│   │   │
│   │   ├── merge/
│   │   │   ├── three-way.ts          # Three-way merge logic
│   │   │   ├── conflict-detector.ts  # Identify conflicts
│   │   │   └── resolution.ts         # Merge resolution helpers
│   │   │
│   │   └── types/
│   │       ├── tokens.ts             # Token type definitions
│   │       ├── diff-result.ts        # Diff output types
│   │       └── options.ts            # Configuration types
│   │
│   ├── components/
│   │   ├── DiffViewer/
│   │   │   ├── DiffViewer.tsx        # Main component
│   │   │   ├── DiffViewer.styles.ts  # Styled components / CSS
│   │   │   └── DiffViewer.test.tsx   # Component tests
│   │   │
│   │   ├── SideBySideView/
│   │   │   ├── SideBySideView.tsx
│   │   │   ├── SyncScroll.tsx        # Synchronized scrolling
│   │   │   └── LineNumbers.tsx       # Optional line numbers
│   │   │
│   │   ├── InlineView/
│   │   │   ├── InlineView.tsx
│   │   │   ├── ChangeBlock.tsx       # Individual change display
│   │   │   └── CollapsedSection.tsx  # Collapsed unchanged text
│   │   │
│   │   ├── MergeView/
│   │   │   ├── MergeView.tsx         # Three-way merge UI
│   │   │   ├── ConflictBlock.tsx     # Conflict display
│   │   │   └── ResolutionControls.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── ChangeHighlight.tsx   # Highlighted text span
│   │   │   ├── ChangeStats.tsx       # Statistics display
│   │   │   ├── Navigation.tsx        # Next/prev change buttons
│   │   │   └── ChangeTypeIcon.tsx    # Visual change indicators
│   │   │
│   │   └── hooks/
│   │       ├── useDiff.ts            # Main diff hook
│   │       ├── useNavigation.ts      # Change navigation
│   │       ├── useSyncScroll.ts      # Scroll synchronization
│   │       └── useKeyboardNav.ts     # Keyboard shortcuts
│   │
│   ├── integrations/
│   │   ├── yjs/
│   │   │   ├── yjs-adapter.ts        # Yjs document support
│   │   │   └── yjs-diff.ts           # Diff Yjs documents
│   │   │
│   │   └── prosemirror/
│   │       ├── pm-adapter.ts         # ProseMirror support
│   │       └── pm-diff.ts            # Diff PM documents
│   │
│   ├── utils/
│   │   ├── levenshtein.ts            # Edit distance
│   │   ├── lcs.ts                    # Longest common subsequence
│   │   ├── similarity.ts             # Text similarity scoring
│   │   ├── normalize.ts              # Text normalization
│   │   └── hash.ts                   # Fast text hashing
│   │
│   └── index.ts                      # Public API exports
│
├── stories/                          # Storybook stories
│   ├── DiffViewer.stories.tsx
│   ├── SideBySideView.stories.tsx
│   └── MergeView.stories.tsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/                     # Sample text pairs
│
└── docs/
    ├── api.md
    ├── algorithms.md
    └── examples.md
```

---

## Data Structures

### Document Tree

The parser converts raw text into a hierarchical structure:

```typescript
interface DocumentNode {
  type: "document" | "section" | "paragraph" | "sentence" | "word";
  content: string;
  children?: DocumentNode[];

  // Position tracking
  start: number; // Character offset in original text
  end: number;

  // Metadata
  hash: string; // Fast comparison hash
  id: string; // Unique identifier for tracking
}

interface Document {
  root: DocumentNode;
  text: string;
  metadata: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
  };
}
```

### Diff Result

The diff engine produces a structured result:

```typescript
type ChangeType = "unchanged" | "added" | "removed" | "modified" | "moved";

interface Change {
  type: ChangeType;

  // The content
  before?: DocumentNode; // For removed/modified
  after?: DocumentNode; // For added/modified

  // For modified content, detailed word-level changes
  wordChanges?: WordChange[];

  // Confidence score for semantic matching (0-1)
  confidence?: number;

  // For moved content
  movedFrom?: number;
  movedTo?: number;
}

interface WordChange {
  type: ChangeType;
  before?: string;
  after?: string;
  position: number;
}

interface DiffResult {
  changes: Change[];

  stats: {
    additions: number;
    deletions: number;
    modifications: number;
    moves: number;
    unchanged: number;

    // Word-level stats
    wordsAdded: number;
    wordsRemoved: number;
    wordsModified: number;

    // Percentages
    percentChanged: number;
  };

  // For three-way merge
  conflicts?: Conflict[];
}

interface Conflict {
  base: DocumentNode;
  left: DocumentNode;
  right: DocumentNode;
  resolved?: DocumentNode;
  resolutionType?: "left" | "right" | "both" | "custom";
}
```

### Configuration Options

```typescript
interface DiffOptions {
  // Granularity
  granularity: "character" | "word" | "sentence" | "paragraph";

  // Semantic matching
  enableSemanticMatching: boolean;
  semanticThreshold: number; // 0-1, similarity score threshold

  // Display options
  contextLines: number; // Unchanged lines to show around changes
  collapseThreshold: number; // Collapse sections larger than this

  // Whitespace handling
  ignoreWhitespace: boolean;
  normalizeUnicode: boolean;

  // Performance
  maxDocumentSize: number; // Warn/fail above this
  timeout: number; // Max processing time in ms
}

interface ViewerOptions {
  mode: "side-by-side" | "inline" | "hybrid";

  theme: "light" | "dark" | "system" | ThemeConfig;

  // Colors
  additionColor: string;
  deletionColor: string;
  modificationColor: string;

  // Features
  showLineNumbers: boolean;
  showStats: boolean;
  enableNavigation: boolean;
  enableKeyboardShortcuts: boolean;

  // Callbacks
  onChangeSelect?: (change: Change) => void;
  onResolve?: (conflict: Conflict, resolution: DocumentNode) => void;
}
```

---

## Diff Algorithm Deep Dive

### Overview

The diffing process happens in multiple passes:

```
Raw Text A ──┐
             ├──▶ Parse ──▶ Align ──▶ Compare ──▶ Refine ──▶ DiffResult
Raw Text B ──┘
```

### Pass 1: Parsing

Convert raw text to document trees using NLP-aware tokenization.

**Sentence Boundary Detection:**

```typescript
// Naive approach fails on:
// "Dr. Smith went to Washington D.C. He arrived at 3 p.m."
// "She said, 'Hello.' Then she left."

// Use a rule-based + ML approach:
const ABBREVIATIONS = new Set(['dr', 'mr', 'mrs', 'ms', 'prof', 'sr', 'jr', ...]);
const SENTENCE_ENDINGS = /[.!?]+["'"]?\s+(?=[A-Z])/;

function splitSentences(text: string): string[] {
  // 1. Protect known abbreviations
  // 2. Protect decimal numbers
  // 3. Protect quoted endings
  // 4. Split on sentence boundaries
  // 5. Restore protected sequences
}
```

### Pass 2: Alignment (Patience Diff)

Standard Myers diff works poorly for prose because it optimizes for minimal edit distance, not semantic meaning. Patience diff is better:

```typescript
// Patience Diff Algorithm:
// 1. Find unique lines that appear exactly once in both texts
// 2. Find the longest common subsequence of these unique lines
// 3. Recursively diff the sections between the matching lines

function patienceDiff<T>(a: T[], b: T[], hash: (item: T) => string): DiffOp[] {
  // Find unique elements
  const uniqueA = findUnique(a, hash);
  const uniqueB = findUnique(b, hash);

  // Find elements unique in both
  const common = intersection(uniqueA, uniqueB);

  // LCS of common unique elements
  const lcs = longestCommonSubsequence(
    a.filter((x) => common.has(hash(x))),
    b.filter((x) => common.has(hash(x))),
  );

  // Recursively diff between anchors
  return recursiveDiff(a, b, lcs);
}
```

### Pass 3: Comparison

For aligned sections, determine change type:

```typescript
function compareNodes(before: DocumentNode, after: DocumentNode): Change {
  // Exact match
  if (before.hash === after.hash) {
    return { type: "unchanged", before, after };
  }

  // Check if moved (same content, different position)
  // Check if semantically similar (rephrased)
  const similarity = calculateSimilarity(before.content, after.content);

  if (similarity > options.semanticThreshold) {
    return {
      type: "modified",
      before,
      after,
      confidence: similarity,
      wordChanges: diffWords(before.content, after.content),
    };
  }

  // Different enough to be add/remove
  return null; // Will be handled as separate add/remove
}
```

### Pass 4: Word-Level Refinement

For modified sentences, compute word-level changes:

```typescript
function diffWords(before: string, after: string): WordChange[] {
  const wordsA = tokenizeWords(before);
  const wordsB = tokenizeWords(after);

  // Use Myers diff at word level
  const ops = myersDiff(wordsA, wordsB);

  return ops.map((op) => ({
    type: op.type,
    before: op.type !== "added" ? wordsA[op.indexA] : undefined,
    after: op.type !== "removed" ? wordsB[op.indexB] : undefined,
    position: op.position,
  }));
}
```

### Semantic Similarity

For detecting rephrased content:

```typescript
// Multiple signals combined:

function calculateSimilarity(a: string, b: string): number {
  const scores = [
    // 1. Jaccard similarity of word sets
    jaccardSimilarity(tokenize(a), tokenize(b)) * 0.3,

    // 2. Normalized Levenshtein distance
    (1 - levenshtein(a, b) / Math.max(a.length, b.length)) * 0.3,

    // 3. Longest common subsequence ratio
    lcsRatio(a, b) * 0.2,

    // 4. N-gram overlap (trigrams)
    ngramOverlap(a, b, 3) * 0.2,
  ];

  return scores.reduce((sum, s) => sum + s, 0);
}

// Jaccard similarity: |A ∩ B| / |A ∪ B|
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
```

---

## Component Library

### Main Component: DiffViewer

```tsx
import { DiffViewer } from "prose-diff";

function MyComponent() {
  const before = `The quick brown fox jumps over the lazy dog.
    
It was a beautiful day in the neighborhood.`;

  const after = `The swift brown fox leaps over the sleepy dog.
    
It was a gorgeous day in the neighborhood.
    
A new paragraph was added here.`;

  return (
    <DiffViewer
      before={before}
      after={after}
      mode="side-by-side"
      theme="light"
      showStats={true}
      onChangeSelect={(change) => console.log("Selected:", change)}
    />
  );
}
```

### Hook: useDiff

For custom UIs:

```tsx
import { useDiff } from "prose-diff";

function CustomDiffUI({ before, after }) {
  const { changes, stats, isLoading, error, navigation } = useDiff(
    before,
    after,
    {
      granularity: "sentence",
      enableSemanticMatching: true,
    },
  );

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <Stats {...stats} />
      <Navigation {...navigation} />
      {changes.map((change, i) => (
        <CustomChangeBlock key={i} change={change} />
      ))}
    </div>
  );
}
```

### Three-Way Merge

```tsx
import { MergeView } from "prose-diff";

function MergeEditor({ base, versionA, versionB, onSave }) {
  const [resolved, setResolved] = useState(null);

  return (
    <MergeView
      base={base}
      left={versionA}
      right={versionB}
      leftLabel="Your Changes"
      rightLabel="Their Changes"
      onResolve={(conflicts) => {
        setResolved(applyResolutions(base, conflicts));
      }}
      renderConflict={(conflict, resolve) => (
        <ConflictBlock
          conflict={conflict}
          onAcceptLeft={() => resolve("left")}
          onAcceptRight={() => resolve("right")}
          onAcceptBoth={() => resolve("both")}
          onCustom={(text) => resolve("custom", text)}
        />
      )}
    />
  );
}
```

---

## API Reference

### Core Functions

```typescript
// Main diff function
function diff(before: string, after: string, options?: DiffOptions): DiffResult;

// Parse text to document tree
function parse(text: string): Document;

// Compare two document trees
function compareDocuments(a: Document, b: Document): DiffResult;

// Three-way merge
function merge3(base: string, left: string, right: string): MergeResult;

// Apply changes to produce final text
function applyChanges(base: string, changes: Change[]): string;
```

### Utility Functions

```typescript
// Text similarity (0-1)
function similarity(a: string, b: string): number;

// Edit distance
function editDistance(a: string, b: string): number;

// Sentence splitting
function splitSentences(text: string): string[];

// Word tokenization
function tokenize(text: string): string[];
```

---

## Implementation Phases

### Phase 1: Core MVP (Weeks 1-3)

**Week 1: Parsing & Data Structures**

- [ ] Implement tokenizer
- [ ] Implement sentence splitter with abbreviation handling
- [ ] Implement paragraph parser
- [ ] Build document tree structure
- [ ] Write unit tests for all parsers

**Week 2: Diff Algorithm**

- [ ] Implement Myers diff
- [ ] Implement Patience diff
- [ ] Implement word-level diff
- [ ] Implement sentence alignment
- [ ] Build diff result aggregation

**Week 3: Basic React Components**

- [ ] Build DiffViewer shell component
- [ ] Implement side-by-side view
- [ ] Implement inline view
- [ ] Add change highlighting
- [ ] Add basic styling (light/dark themes)

**Deliverable:** Working diff viewer with side-by-side and inline modes

---

### Phase 2: Enhanced Features (Weeks 4-6)

**Week 4: Semantic Matching**

- [ ] Implement Jaccard similarity
- [ ] Implement LCS ratio
- [ ] Implement n-gram overlap
- [ ] Build combined similarity scorer
- [ ] Add "rephrased" detection

**Week 5: Navigation & UX**

- [ ] Add change navigation (next/prev)
- [ ] Add keyboard shortcuts
- [ ] Implement collapsible unchanged sections
- [ ] Add change type filtering
- [ ] Build stats display component

**Week 6: Polish & Optimization**

- [ ] Performance profiling
- [ ] Implement web workers for large docs
- [ ] Add loading states
- [ ] Improve styling and animations
- [ ] Write Storybook stories

**Deliverable:** Full-featured diff viewer with semantic matching

---

### Phase 3: Advanced Features (Weeks 7-9)

**Week 7: Three-Way Merge**

- [ ] Implement three-way diff algorithm
- [ ] Build conflict detection
- [ ] Create MergeView component
- [ ] Add resolution controls

**Week 8: Integrations**

- [ ] Yjs adapter
- [ ] ProseMirror adapter
- [ ] Real-time diff updates

**Week 9: Export & Documentation**

- [ ] HTML export
- [ ] PDF export (via html2pdf)
- [ ] Comprehensive documentation
- [ ] Example applications

**Deliverable:** Production-ready library with CRDT support

---

## Tech Stack

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "diff": "^5.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@testing-library/react": "^14.0.0",
    "vitest": "^1.0.0",
    "storybook": "^7.6.0",
    "@storybook/react-vite": "^7.6.0",
    "tailwindcss": "^3.4.0"
  },
  "peerDependencies": {
    "yjs": "^13.6.0",
    "@tiptap/core": "^2.1.0"
  }
}
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ProseDiff",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `prose-diff.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

---

## Testing Strategy

### Unit Tests

```typescript
// tests/unit/sentence-splitter.test.ts
import { splitSentences } from "../src/core/parser/sentence-splitter";

describe("splitSentences", () => {
  it("handles basic sentences", () => {
    const text = "Hello world. How are you? I am fine!";
    expect(splitSentences(text)).toEqual([
      "Hello world.",
      "How are you?",
      "I am fine!",
    ]);
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
    expect(splitSentences(text)).toEqual([
      'She said, "Hello."',
      "Then she left.",
    ]);
  });

  it("handles ellipsis", () => {
    const text = "Wait... What happened? I don't know.";
    expect(splitSentences(text)).toEqual([
      "Wait...",
      "What happened?",
      "I don't know.",
    ]);
  });
});
```

### Integration Tests

```typescript
// tests/integration/diff.test.ts
import { diff } from "../src";

describe("diff integration", () => {
  it("detects word changes within sentences", () => {
    const before = "The quick brown fox jumps over the lazy dog.";
    const after = "The swift brown fox leaps over the sleepy dog.";

    const result = diff(before, after);

    expect(result.changes).toHaveLength(1);
    expect(result.changes[0].type).toBe("modified");
    expect(result.changes[0].wordChanges).toContainEqual(
      expect.objectContaining({ before: "quick", after: "swift" }),
    );
  });

  it("detects added paragraphs", () => {
    const before = "Paragraph one.\n\nParagraph two.";
    const after = "Paragraph one.\n\nNew paragraph.\n\nParagraph two.";

    const result = diff(before, after, { granularity: "paragraph" });

    expect(result.stats.additions).toBe(1);
  });
});
```

### Visual Regression Tests

```typescript
// tests/visual/DiffViewer.visual.test.ts
import { test, expect } from "@playwright/test";

test("side-by-side view renders correctly", async ({ page }) => {
  await page.goto("/storybook/iframe.html?id=diffviewer--side-by-side");
  await expect(page).toHaveScreenshot("side-by-side.png");
});

test("handles long documents", async ({ page }) => {
  await page.goto("/storybook/iframe.html?id=diffviewer--long-document");
  await expect(page).toHaveScreenshot("long-document.png");
});
```

### Test Fixtures

Create realistic test cases:

```
tests/fixtures/
├── simple/
│   ├── word-change.before.txt
│   ├── word-change.after.txt
│   └── word-change.expected.json
├── complex/
│   ├── restructured-paragraphs.before.txt
│   ├── restructured-paragraphs.after.txt
│   └── restructured-paragraphs.expected.json
└── edge-cases/
    ├── empty-document.txt
    ├── unicode-heavy.txt
    └── very-long-paragraph.txt
```

---

## Performance Considerations

### Benchmarks

Target performance for common cases:

| Document Size  | Parse Time | Diff Time | Render Time |
| -------------- | ---------- | --------- | ----------- |
| 1KB (short)    | < 5ms      | < 10ms    | < 16ms      |
| 10KB (chapter) | < 20ms     | < 50ms    | < 50ms      |
| 100KB (novel)  | < 100ms    | < 500ms   | < 200ms     |

### Optimization Strategies

1. **Lazy Parsing**: Only parse visible sections initially
2. **Web Workers**: Offload diff computation to background thread
3. **Virtualization**: Only render visible changes for large diffs
4. **Memoization**: Cache parsed documents and intermediate results
5. **Hashing**: Use fast hashing for quick equality checks

```typescript
// Web Worker usage
const diffWorker = new Worker(new URL("./diff.worker.ts", import.meta.url));

export function diffAsync(before: string, after: string): Promise<DiffResult> {
  return new Promise((resolve) => {
    diffWorker.postMessage({ before, after });
    diffWorker.onmessage = (e) => resolve(e.data);
  });
}
```

---

## Accessibility

### Requirements

- [ ] Full keyboard navigation
- [ ] Screen reader support with ARIA labels
- [ ] Color-blind friendly themes
- [ ] Reduced motion option
- [ ] Focus management

### Implementation

```tsx
// Accessible change block
function ChangeBlock({ change }: { change: Change }) {
  const label = getChangeLabel(change); // "Modified sentence, 3 words changed"

  return (
    <div
      role="listitem"
      aria-label={label}
      tabIndex={0}
      className={styles.changeBlock}
    >
      <span className="sr-only">{change.type}:</span>
      <ChangeContent change={change} />
    </div>
  );
}

// Keyboard navigation
function useKeyboardNav(changes: Change[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "j" || e.key === "ArrowDown") {
        setCurrentIndex((i) => Math.min(i + 1, changes.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        setCurrentIndex((i) => Math.max(i - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changes.length]);

  return { currentIndex, setCurrentIndex };
}
```

---

## Future Roadmap

### v1.1 - Enhanced Visualization

- [ ] Animated transitions between versions
- [ ] Timeline view showing document evolution
- [ ] Contributor heatmap

### v1.2 - AI-Powered Features

- [ ] Smart change categorization (style, content, structure)
- [ ] Automatic merge conflict resolution suggestions
- [ ] Writing style consistency detection

### v1.3 - Ecosystem

- [ ] VS Code extension
- [ ] CLI tool for terminal use
- [ ] GitHub Action for PR reviews

### v2.0 - Platform Features

- [ ] Cloud-hosted diff service
- [ ] Shareable diff links
- [ ] Team collaboration features

---

## Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/prose-diff.git
cd prose-diff

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run Storybook
npm run storybook

# Build library
npm run build
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Write tests for all new features
- Document public APIs with JSDoc

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Write tests
4. Ensure all tests pass
5. Submit PR with clear description

---

## License

MIT License - see LICENSE file for details.

---

## Acknowledgments

- Inspired by Git's diff algorithm
- Uses concepts from [diff-match-patch](https://github.com/google/diff-match-patch)
- Built for the collaborative writing community
