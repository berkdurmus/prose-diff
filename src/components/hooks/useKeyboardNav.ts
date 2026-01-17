import { useEffect } from "react";

export function useKeyboardNav(
  onNext: () => void,
  onPrev: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "j" || event.key === "ArrowDown") {
        onNext();
      }
      if (event.key === "k" || event.key === "ArrowUp") {
        onPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onNext, onPrev]);
}
