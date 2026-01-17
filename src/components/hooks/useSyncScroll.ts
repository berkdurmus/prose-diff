import { useEffect } from "react";
import type { RefObject } from "react";

export function useSyncScroll(
  leftRef: RefObject<HTMLElement>,
  rightRef: RefObject<HTMLElement>,
) {
  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) {
      return;
    }

    const onLeftScroll = () => {
      right.scrollTop = left.scrollTop;
    };
    const onRightScroll = () => {
      left.scrollTop = right.scrollTop;
    };

    left.addEventListener("scroll", onLeftScroll);
    right.addEventListener("scroll", onRightScroll);

    return () => {
      left.removeEventListener("scroll", onLeftScroll);
      right.removeEventListener("scroll", onRightScroll);
    };
  }, [leftRef, rightRef]);
}
