/** @type { import('@storybook/nextjs').StorybookConfig } */
import path from "path";
import dotenv from "dotenv";
import webpack from "webpack";
dotenv.config();
const config = {
  stories: [
		'../components/**/*.mdx',
		'../components/**/*.stories.@(js|jsx|ts|tsx)'
	],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/nextjs",
		options: {
      nextConfigPath: path.resolve(__dirname, "../next.config.js")
    }
  },

  docs: {},

  webpackFinal: async storybookWebpackConfig => {
  const plugins = storybookWebpackConfig.plugins || [];
  const newConfig = {
    ...storybookWebpackConfig,
    plugins: [...plugins, new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    })]
  };
  return newConfig;
},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
