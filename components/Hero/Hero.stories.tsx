import type { Meta, StoryObj } from "@storybook/nextjs";
import { Hero } from "./Hero";

const meta: Meta<typeof Hero> = {
  title: "Components/Hero",
  component: Hero,
};

export default meta;

type Story = StoryObj<typeof Hero>;

const sampleImages = [
  {
    image: [
      {
        id: "sunwing_vacations_group/pool",
        type: "image",
        src: "https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885651/sunwing_vacations_group/Epic%20images/entrepreneurial.jpg",
        alt: "",
        locale: 0,
        width: 1800,
        height: 968,
      },
    ],
  },
];

export const HeroStory: Story = {
  render: (args) => <Hero {...args} />,
  args: {
    images: sampleImages,
    content: "__Home to__ North America's largest vacation brands",
    imageAlignment: "top",
  },
};
