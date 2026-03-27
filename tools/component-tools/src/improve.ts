#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ImproveResult {
  enhanced: string[];
  added: string[];
}

function generateExtendedTestCode(name: string, componentName: string): string {
  const hasVariants = componentName.toLowerCase() === 'button' || componentName.toLowerCase() === 'badge';
  const hasSizes = componentName.toLowerCase() === 'button';
  
  return `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  // Basic rendering tests
  it('renders successfully', () => {
    render(<${name}>Test Content</${name}>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class">Test</${name}>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${name} ref={ref}>Test</${name}>)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<${name} data-testid="test-component">Test</${name}>)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  // Accessibility tests
  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })

  ${hasVariants ? `
  // Variant tests
  it('renders with default variant', () => {
    const { container } = render(<${name} variant="default">Default</${name}>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('renders with destructive variant', () => {
    const { container } = render(<${name} variant="destructive">Destructive</${name}>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('renders with outline variant', () => {
    const { container } = render(<${name} variant="outline">Outline</${name}>)
    expect(container.firstChild).toHaveClass('border-input')
  })
  ` : ''}

  ${hasSizes ? `
  // Size tests
  it('renders with default size', () => {
    const { container } = render(<${name} size="default">Default</${name}>)
    expect(container.firstChild).toHaveClass('h-10')
  })

  it('renders with small size', () => {
    const { container } = render(<${name} size="sm">Small</${name}>)
    expect(container.firstChild).toHaveClass('h-9')
  })

  it('renders with large size', () => {
    const { container } = render(<${name} size="lg">Large</${name}>)
    expect(container.firstChild).toHaveClass('h-11')
  })
  ` : ''}

  // Event handler tests
  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<${name} onClick={handleClick}>Click me</${name}>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Disabled state tests
  it('applies disabled styles when disabled', () => {
    const { container } = render(<${name} disabled>Disabled</${name}>)
    expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
  })
})
`;
}

function generateExtendedStoriesCode(name: string, componentName: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: { children: '${name}', variant: 'default', size: 'default' },
}

export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
}

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
}

export const Link: Story = {
  args: { children: 'Link', variant: 'link' },
}

export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const Icon: Story = {
  args: { children: '🚀', size: 'icon' },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>📧</span>
        <span>Email</span>
      </>
    ),
  },
}
`;
}

function improviseComponent(componentDir: string, componentName: string): ImproveResult {
  const enhanced: string[] = [];
  const added: string[] = [];

  // Enhance test file with more comprehensive tests
  const testFile = path.join(componentDir, `${componentName}.test.tsx`);
  if (fs.existsSync(testFile)) {
    const extendedTests = generateExtendedTestCode(componentName, componentName);
    fs.writeFileSync(testFile, extendedTests);
    enhanced.push('Extended test file with comprehensive test cases');
  }

  // Enhance stories file with more variants and states
  const storiesFile = path.join(componentDir, `${componentName}.stories.tsx`);
  if (fs.existsSync(storiesFile)) {
    const extendedStories = generateExtendedStoriesCode(componentName, componentName);
    fs.writeFileSync(storiesFile, extendedStories);
    enhanced.push('Extended stories file with more variants and states');
  }

  return { enhanced, added };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: improve <component-path>');
    console.error('Example: improve packages/ui/components/Button');
    process.exit(1);
  }

  const componentPath = args[0];
  
  if (!fs.existsSync(componentPath)) {
    console.error(`Error: Component path does not exist: ${componentPath}`);
    process.exit(1);
  }

  const componentName = path.basename(componentPath);
  
  try {
    const result = improviseComponent(componentPath, componentName);
    
    if (result.enhanced.length > 0 || result.added.length > 0) {
      console.log(JSON.stringify({
        success: true,
        component: componentName,
        improvements: {
          enhanced: result.enhanced,
          added: result.added,
        },
        message: `Enhanced ${result.enhanced.length} file(s)`,
      }, null, 2));
      process.exit(0);
    } else {
      console.log(JSON.stringify({
        success: true,
        component: componentName,
        improvements: {
          enhanced: [],
          added: [],
        },
        message: 'No improvements needed',
      }, null, 2));
      process.exit(0);
    }
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, null, 2));
    process.exit(1);
  }
}

main();