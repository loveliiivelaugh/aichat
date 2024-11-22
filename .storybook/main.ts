import path from "path";
import type { StorybookConfig } from "@storybook/react-webpack5";

// const {ModuleFederationPlugin} = require('@module-federation/enhanced/rspack');
const { ModuleFederationPlugin } = require("webpack").container;
// const { withStorybookModuleFederation } = require('storybook-module-federation');


const moduleFederationConfig = {
  name: 'aichat',
  filename: 'remoteEntry.js',
  exposes: {},
  remotes: {
    mf2: 'mf2@https://cherrytopframeworktester.netlify.app/remoteEntry.js',
    // mf2: 'mf2@http://localhost:8082/remoteEntry.js',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: "^18.2.0",
      eager: true
    },
    'react-dom': {
      singleton: true,
      requiredVersion: "^18.2.0",
      eager: true
    },
    // For advanced/complex state management
    zustand: { 
      singleton: true, 
      requiredVersion: "^4.1.1" ,
      eager: true
    },
  },
};

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm"
  ],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      fsCache: true,
      lazyCompilation: true,
    },
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        // if any alias can be configured here
        ...config.resolve?.alias,
        "@": path.resolve(__dirname, "./src"),
        "@api": path.resolve(__dirname, "./src/utilities/api"),
        "@store": path.resolve(__dirname, "./src/utilities/store"),
        "@scripts": path.resolve(__dirname, "./src/utilities/scripts"),
        "@helpers": path.resolve(__dirname, "./src/utilities/helpers"),
        "@components": path.resolve(__dirname, "./src/components"),
      },

      fallback: {
        fs: false,
        os: false,
        module: false,
        path: false
      }
    };

    config.plugins = config?.plugins ? [...config.plugins] : [];

    //Add ModuleFederationPlugin here to integrate with Webpack
    config.plugins.push(new ModuleFederationPlugin(moduleFederationConfig));

    return config;
  }
};

export default config;
