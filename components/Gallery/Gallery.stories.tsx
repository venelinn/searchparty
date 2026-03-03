import type { Meta, StoryObj } from "@storybook/nextjs";
import { Gallery } from "./Gallery";

const meta: Meta<typeof Gallery> = {
  title: "Components/Gallery",
  component: Gallery,
};

export default meta;

type Story = StoryObj<typeof Gallery>;

const thumbs = [
  {
    src: "https://images.ctfassets.net/cktp0gqtqb5p/21L09eLNAKTqNO5iT6J1ns/66f375ebbc5b4ccd70278016ac71243b/70.jpg?w=750&h=1125&fl=progressive&q=50&fm=jpg",
    width: 750,
    height: 1125,
    title: "Baby",
    alt: "Baby",
  },
  {
    src: "https://images.ctfassets.net/cktp0gqtqb5p/7HqfYeVkTlTy0gnspkNAa7/8e27bcc05c5802368842b4b05323576f/61.jpg?w=750&h=500&fl=progressive&q=50&fm=jpg",
    width: 750,
    height: 500,
    title: "Baby",
    alt: "Baby",
  },
  {
    src: "https://images.ctfassets.net/cktp0gqtqb5p/2mgJsDW3LeMhequafcQajv/75959b5cff945047169dbb9d90495204/56.jpg?w=750&h=500&fl=progressive&q=50&fm=jpg",
    width: 750,
    height: 500,
    title: "Baby",
    alt: "Baby",
  },
  {
    src: "https://images.ctfassets.net/cktp0gqtqb5p/6FvQKOfc7CuV7P6ZhXZ1nb/a6197c046c7ffb3bf4fb20308d860d0c/41.jpg?w=750&h=1125&fl=progressive&q=50&fm=jpg",
    width: 750,
    height: 1125,
    title: "Baby",
    alt: "Baby",
  },
];

const full = [
  { id: "156c9447-6df1-5c22-9e83-e8ddf93d03dd", src: thumbs[0].src, alt: "Baby", isVideo: false },
  { id: "6002df12-321d-5a0a-9537-206644f1b22b", src: thumbs[1].src, alt: "Baby", isVideo: false },
  { id: "af585830-010d-572f-8b62-2c0c6e79e584", src: thumbs[2].src, alt: "Baby", isVideo: false },
  { id: "a254aa80-7bf4-5e6c-a1ae-c749996af4bc", src: thumbs[3].src, alt: "Baby", isVideo: false },
];

export const GalleryStory: Story = {
  args: {
    thumbs,
    full,
    itemsPerRow: 2,
  },
  argTypes: {
    itemsPerRow: {
      options: [2, 3, 4],
      control: { type: "select" },
    },
  },
};
