import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Design System',
          ['Tokens', 'Signal & Flame', '*'],
          'Components',
          '*',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#09090b' },
        { name: 'gray', value: '#f4f4f5' },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375)',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        mobileLg: {
          name: 'Mobile L (425)',
          styles: { width: '425px', height: '812px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        laptop: {
          name: 'Laptop (1024)',
          styles: { width: '1024px', height: '768px' },
          type: 'desktop',
        },
        desktop: {
          name: 'Desktop (1280)',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide (1440)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'desktop',
    },
  },
}

export default preview
