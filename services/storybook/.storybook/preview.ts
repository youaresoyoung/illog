import type { Preview } from '@storybook/react-vite'
import '@illog/themes/themes.css'
import '@illog/ui/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
