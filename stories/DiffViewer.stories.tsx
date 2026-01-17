import type { Meta, StoryObj } from "@storybook/react";
import { DiffViewer } from "@/components/DiffViewer/DiffViewer";

const meta: Meta<typeof DiffViewer> = {
  title: "DiffViewer",
  component: DiffViewer,
};

export default meta;
type Story = StoryObj<typeof DiffViewer>;

const before = `The quick brown fox jumps over the lazy dog.

It was a beautiful day in the neighborhood.`;

const after = `The swift brown fox leaps over the sleepy dog.

It was a gorgeous day in the neighborhood.

A new paragraph was added here.`;

export const SideBySide: Story = {
  args: {
    before,
    after,
    mode: "side-by-side",
    showStats: true,
  },
};

export const Inline: Story = {
  args: {
    before,
    after,
    mode: "inline",
    showStats: true,
  },
};
