import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    }
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      esbuild: {
        jsx: 'automatic',
        jsxDev: false
      }
    })
  }
}
export default config
