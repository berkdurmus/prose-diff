import type { Meta, StoryObj } from "@storybook/react";
import { MergeView } from "@/components/MergeView/MergeView";

const meta: Meta<typeof MergeView> = {
  title: "MergeView",
  component: MergeView,
};

export default meta;
type Story = StoryObj<typeof MergeView>;

const base = "The quick brown fox jumps over the lazy dog.";
const left = "The quick brown fox jumps over the sleepy dog.";
const right = "The swift brown fox jumps over the lazy dog.";

export const Default: Story = {
  args: {
    base,
    left,
    right,
  },
};
