import React from "react";
import { Hero } from "./Hero";

export default {
  title: "Components/Hero",
  component: Hero,
};

export const HeroStory = {
	render: args => <Hero {...args} />,
	args: {
		heading: "sample",
		image: [
			{
				id: "sunwing_vacations_group/pool",
				type: "image",
				src: "https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885651/sunwing_vacations_group/Epic%20images/entrepreneurial.jpg",
				alt: "",
				locale: 0,
				width: 1800,
				height: 968
			}
		],
		headingAlignment: "center",
	},
	argTypes: {
    heading: {
			options: ["none", "sample"],
			mapping: {
				none: undefined,
				sample: "__Home to__ North America’s largest vacation brands",
			},
			control: {
				type: "radio",
			},
		},
		headingAlignment: {
			options: ["left", "center", "right"],
			mapping: {
				left: "left",
				center: "center",
				right: "right",
			},
			control: {
				type: "radio",
			},
		},
  },
};
