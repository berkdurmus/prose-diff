# Prose Diff API

## Core

- `diffDocuments(before, after, options)` returns `DiffResult`
- `parseDocument(text, options)` returns `Document`
- `merge3(base, left, right)` returns `MergeResult`

## Components

- `DiffViewer` main UI component
- `SideBySideView` and `InlineView` for custom layouts
- `MergeView` for conflict resolution
