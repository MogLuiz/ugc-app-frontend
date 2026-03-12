import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (config) => {
    const plugins = config.plugins ?? [];
    plugins.push(tailwindcss());
    plugins.push(tsconfigPaths());
    config.plugins = plugins;
    return config;
  }
};

export default config;
