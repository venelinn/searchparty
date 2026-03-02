import type { Meta, StoryObj } from "@storybook/nextjs";
import { Colors } from "./Colors";

const meta: Meta<typeof Colors> = {
  title: "Global/Colors",
  component: Colors,
};

export default meta;

type Story = StoryObj<typeof Colors>;

export const ColorsStory: Story = {
  render: () => (
    <div className="colors__storybook">
      <Colors />
    </div>
  ),
};
