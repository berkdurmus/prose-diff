interface LineNumbersProps {
  count: number;
}

export function LineNumbers({ count }: LineNumbersProps) {
  return (
    <div style={{ textAlign: "right", paddingRight: 8, color: "#94a3b8" }}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{index + 1}</div>
      ))}
    </div>
  );
}
