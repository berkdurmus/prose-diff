import type { RefObject } from "react";
import { useSyncScroll } from "@/components/hooks/useSyncScroll";

interface SyncScrollProps {
  leftRef: RefObject<HTMLElement>;
  rightRef: RefObject<HTMLElement>;
}

export function SyncScroll({ leftRef, rightRef }: SyncScrollProps) {
  useSyncScroll(leftRef, rightRef);
  return null;
}
