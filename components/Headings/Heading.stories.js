import React from "react";
import { Heading } from "./Heading";
import defaultStyles from "./Heading.stories.module.scss";

export default {
  title: "Global/Heading",
  component: Heading,
};

export const HeadingStory = (args) => (
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
    <div className={defaultStyles.body}>Paragraph with link <a href="#" className="link"><span className="link__text">click here</span></a></div>
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
);

HeadingStory.storyName = "Heading";