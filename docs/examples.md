# Examples

```tsx
import { DiffViewer } from "prose-diff";

export function Example() {
  return (
    <DiffViewer
      before="Hello world."
      after="Hello wonderful world."
      mode="inline"
      showStats
    />
  );
}
```
