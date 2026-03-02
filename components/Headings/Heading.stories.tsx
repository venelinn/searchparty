import type { Meta, StoryObj } from "@storybook/nextjs";
import { Heading } from "./Heading";
import defaultStyles from "./Heading.stories.module.scss";

const meta: Meta<typeof Heading> = {
  title: "Global/Heading",
  component: Heading,
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const HeadingStory: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0rem" }}>
      <Heading {...args} as="h1" size="h1">
        H1 Heading
      </Heading>
      <Heading {...args} as="h2">
        H2 Heading
      </Heading>
      <Heading {...args} as="h3" size="h3">
        H3 Title
      </Heading>
      <Heading {...args} as="h4" size="h4">
        H4 Title
      </Heading>
      <br />
      <div className={defaultStyles.body}>Paragraph/Body text</div>
      <br />
      <div className={defaultStyles.body}>
        Paragraph with link{" "}
        <a href="#demo" className="link">
          <span className="link__text">click here</span>
        </a>
      </div>
      <br />
      <div className={defaultStyles.caption}>Captions</div>
      <div className={defaultStyles.small}>Captions small</div>
      <br />
      <ul className={defaultStyles.list}>
        <li>List item</li>
        <li>List item</li>
        <li>List item</li>
      </ul>
    </div>
  ),
  storyName: "Heading",
};
