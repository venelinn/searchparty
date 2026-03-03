import type { Preview } from '@storybook/nextjs';
import "../styles/globals.scss";
// import { getMessages } from "../utils/getMessages";
// import "./styles.scss";

const ThemeAndLocaleDecorator = (
  Story: React.ComponentType<object>,
) => {
  return (
    <main>
      <Story />
    </main>
  );
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [ThemeAndLocaleDecorator],
};

export default preview;
