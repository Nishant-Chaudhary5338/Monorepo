import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component — see the Args table for all available props.',
      },
    },
  },
  argTypes: {
    primary: { control: 'boolean' },
    backgroundColor: { control: 'text' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    label: { control: 'text' },
    onClick: { action: 'called' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ----- Default -----
export const Default: Story = {
};

// ----- Playground (edit any prop in the Controls panel) -----
export const Playground: Story = {
  args: {
    primary: false,
    backgroundColor: '',
    label: '',
  },
};

// ----- Sizes -----
export const SizeSmall: Story = {
  args: {
    size: 'small',
  },
};
export const SizeMedium: Story = {
  args: {
    size: 'medium',
  },
};
export const SizeLarge: Story = {
  args: {
    size: 'large',
  },
};

// ----- With callbacks (check Actions panel) -----
export const WithCallbacks: Story = {
  args: {
    onClick: () => console.log('onClick fired'),
  },
};

// ----- Accessibility (with ARIA attributes) -----
export const Accessibility: Story = {
  args: {
    'aria-label': 'Button accessible label',
  },
};

// ----- Interactive (automated interaction test) -----
export const Interactive: Story = {
  args: {
    onClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByRole('button');
    await userEvent.click(el);
    await expect(el).toBeInTheDocument();
  },
};
