import React from "react";
import { Colors } from "./Colors";

export default {
  title: "Global/Colors",
  component: Colors,
};

const Template = (args) => <div className="colors__storybook"><Colors {...args} /></div>;

export const ColorsStory = Template.bind({});
ColorsStory.args;