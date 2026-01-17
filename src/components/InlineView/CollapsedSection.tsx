interface CollapsedSectionProps {
  hiddenCount: number;
  onExpand: () => void;
}

export function CollapsedSection({ hiddenCount, onExpand }: CollapsedSectionProps) {
  return (
    <button type="button" onClick={onExpand} style={{ margin: "8px 0" }}>
      Show {hiddenCount} unchanged {hiddenCount === 1 ? "section" : "sections"}
    </button>
  );
}
