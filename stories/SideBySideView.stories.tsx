import type { Meta, StoryObj } from "@storybook/react";
import { SideBySideView } from "@/components/SideBySideView/SideBySideView";
import { diffDocuments } from "@/core/diff/document-diff";

const meta: Meta<typeof SideBySideView> = {
  title: "SideBySideView",
  component: SideBySideView,
};

export default meta;
type Story = StoryObj<typeof SideBySideView>;

const before = "The quick brown fox jumps over the lazy dog.";
const after = "The swift brown fox leaps over the sleepy dog.";
const result = diffDocuments(before, after);

export const Default: Story = {
  args: {
    changes: result.changes,
  },
};
