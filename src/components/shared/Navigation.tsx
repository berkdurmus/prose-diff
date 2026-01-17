interface NavigationProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Navigation({ currentIndex, total, onNext, onPrev }: NavigationProps) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button type="button" onClick={onPrev} disabled={currentIndex <= 0}>
        Prev
      </button>
      <span>
        {currentIndex + 1} / {total}
      </span>
      <button type="button" onClick={onNext} disabled={currentIndex >= total - 1}>
        Next
      </button>
    </div>
  );
}
