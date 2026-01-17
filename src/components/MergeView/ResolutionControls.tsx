interface ResolutionControlsProps {
  onResolve: (resolution: "left" | "right" | "both" | "custom", value?: string) => void;
}

export function ResolutionControls({ onResolve }: ResolutionControlsProps) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" onClick={() => onResolve("left")}>
        Left
      </button>
      <button type="button" onClick={() => onResolve("right")}>
        Right
      </button>
      <button type="button" onClick={() => onResolve("both")}>
        Both
      </button>
    </div>
  );
}
