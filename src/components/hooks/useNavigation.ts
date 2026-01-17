import { useCallback, useMemo, useState } from "react";
import type { Change } from "@/core/types/diff-result";

export function useNavigation(changes: Change[]) {
  const changeIndices = useMemo(
    () => changes.map((change, index) => ({ change, index })).filter((item) => item.change.type !== "unchanged"),
    [changes],
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((value) => Math.min(value + 1, changeIndices.length - 1));
  }, [changeIndices.length]);

  const prev = useCallback(() => {
    setCurrentIndex((value) => Math.max(value - 1, 0));
  }, []);

  return {
    currentIndex,
    total: changeIndices.length,
    currentChange: changeIndices[currentIndex]?.change ?? null,
    next,
    prev,
  };
}
