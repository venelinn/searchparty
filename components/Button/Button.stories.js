import React from "react";
import { Button } from "./Button";

export default {
  title: "Global/Button",
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Button label",
};