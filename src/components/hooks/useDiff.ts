import { useMemo } from "react";
import { diffDocuments } from "@/core/diff/document-diff";
import type { DiffOptions } from "@/core/types/options";
import { useNavigation } from "@/components/hooks/useNavigation";

export function useDiff(before: string, after: string, options?: DiffOptions) {
  const result = useMemo(() => {
    try {
      return diffDocuments(before, after, options);
    } catch (error) {
      return { error: error as Error };
    }
  }, [before, after, options]);

  const navigation = useNavigation("error" in result ? [] : result.changes);

  if ("error" in result) {
    return {
      changes: [],
      stats: {
        additions: 0,
        deletions: 0,
        modifications: 0,
        moves: 0,
        unchanged: 0,
        wordsAdded: 0,
        wordsRemoved: 0,
        wordsModified: 0,
        percentChanged: 0,
      },
      isLoading: false,
      error: result.error,
      navigation,
    };
  }

  return {
    changes: result.changes,
    stats: result.stats,
    isLoading: false,
    error: null,
    navigation,
  };
}
