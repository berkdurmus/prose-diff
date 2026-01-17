import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DiffViewer } from "@/components/DiffViewer/DiffViewer";

describe("DiffViewer visual", () => {
  it("renders side-by-side view", () => {
    const { container } = render(
      <DiffViewer
        before="Hello world."
        after="Hello wonderful world."
        mode="side-by-side"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
