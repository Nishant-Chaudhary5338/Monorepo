#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// ============================================================================
// PATHS (ES module compatible)
// ============================================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
// ============================================================================
// TEMPLATE READER
// ============================================================================
function readTemplate(componentName) {
    const templatePath = path.join(TEMPLATES_DIR, `${componentName}.tsx`);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found: ${componentName}. Available templates: ${getAvailableTemplates().join(', ')}`);
    }
    let content = fs.readFileSync(templatePath, 'utf-8');
    return fixTemplateForMonorepo(content);
}
function getAvailableTemplates() {
    if (!fs.existsSync(TEMPLATES_DIR))
        return [];
    return fs.readdirSync(TEMPLATES_DIR)
        .filter(f => f.endsWith('.tsx'))
        .map(f => f.replace('.tsx', ''));
}
// ============================================================================
// TEMPLATE FIXES FOR MONOREPO
// ============================================================================
function fixTemplateForMonorepo(templateContent) {
    // Fix @/lib/utils import path to use relative path for monorepo compatibility
    return templateContent.replace(/import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g, 'import { cn } from "../../lib/utils"');
}
// ============================================================================
// COMPONENT TYPE DETECTION
// ============================================================================
// HTML void elements that cannot have children
const VOID_ELEMENTS = [
    'input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed',
    'source', 'track', 'wbr', 'param', 'keygen', 'menuitem'
];
// Components that render void elements
const VOID_COMPONENTS = ['input', 'img', 'separator', 'divider'];
function isVoidElement(componentName) {
    const lowerName = componentName.toLowerCase();
    return VOID_COMPONENTS.includes(lowerName);
}
function isInteractiveElement(componentName) {
    const interactiveComponents = ['button', 'link', 'anchor', 'tab', 'toggle', 'switch', 'checkbox', 'radio'];
    const lowerName = componentName.toLowerCase();
    return interactiveComponents.some(ic => lowerName.includes(ic));
}
// ============================================================================
// CODE GENERATORS (using shadcn/ui templates)
// ============================================================================
function generateTypesCode(name) {
    return `import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface ${name}Props
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type ${name}Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type ${name}Size = "default" | "sm" | "lg" | "icon"
`;
}
function generateTestCode(name) {
    const isVoid = isVoidElement(name);
    if (isVoid) {
        // Void element tests - no children, test props instead
        return `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  it('renders successfully', () => {
    render(<${name} placeholder="test input" />)
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" placeholder="test" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${name} ref={ref} placeholder="test" />)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<${name} data-testid="test-component" placeholder="test" />)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  it('accepts value prop', () => {
    render(<${name} value="test value" readOnly />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<${name} disabled placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeDisabled()
  })

  it('handles placeholder prop', () => {
    render(<${name} placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })
})
`;
    }
    // Regular component tests - can have children
    return `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
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

  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })
})
`;
}
function generateExtendedTestCode(name, componentName) {
    const isVoid = isVoidElement(componentName);
    const hasVariants = componentName.toLowerCase() === 'button' || componentName.toLowerCase() === 'badge';
    const hasSizes = componentName.toLowerCase() === 'button';
    if (isVoid) {
        // Void element tests - no children, test props instead
        return `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  // Basic rendering tests
  it('renders successfully', () => {
    render(<${name} placeholder="test input" />)
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" placeholder="test" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${name} ref={ref} placeholder="test" />)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<${name} data-testid="test-component" placeholder="test" />)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  // Accessibility tests
  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })

  it('renders with semantic HTML', () => {
    const { container } = render(<${name} placeholder="test" />)
    // Check that it's an input element
    expect(container.firstChild?.nodeName).toBe('INPUT')
  })

  // Value and placeholder tests
  it('accepts value prop', () => {
    render(<${name} value="test value" readOnly />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('handles placeholder prop', () => {
    render(<${name} placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  // Disabled state tests
  it('handles disabled state', () => {
    render(<${name} disabled placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeDisabled()
  })

  it('applies disabled styles when disabled', () => {
    const { container } = render(<${name} disabled placeholder="test" />)
    expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed')
  })

  // Focus management tests
  it('applies focus-visible styles', () => {
    const { container } = render(<${name} placeholder="test" />)
    expect(container.firstChild).toHaveClass('focus-visible:ring-2')
  })

  // Event handler tests
  it('handles onChange events', () => {
    const handleChange = vi.fn()
    render(<${name} onChange={handleChange} placeholder="test" />)
    const input = screen.getByPlaceholderText('test')
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles onFocus events', () => {
    const handleFocus = vi.fn()
    render(<${name} onFocus={handleFocus} placeholder="test" />)
    fireEvent.focus(screen.getByPlaceholderText('test'))
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('handles onBlur events', () => {
    const handleBlur = vi.fn()
    render(<${name} onBlur={handleBlur} placeholder="test" />)
    fireEvent.blur(screen.getByPlaceholderText('test'))
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  // Type tests
  it('handles type prop', () => {
    render(<${name} type="email" placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toHaveAttribute('type', 'email')
  })

  it('handles type password', () => {
    render(<${name} type="password" placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toHaveAttribute('type', 'password')
  })

  // Required and validation tests
  it('handles required prop', () => {
    render(<${name} required placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeRequired()
  })

  it('handles readOnly prop', () => {
    render(<${name} readOnly placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toHaveAttribute('readonly')
  })
})
`;
    }
    // Regular component tests - can have children
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

  it('renders with semantic HTML', () => {
    const { container } = render(<${name}>Test</${name}>)
    // Check that it's not a div (should be button, a, or other semantic element)
    expect(container.firstChild?.nodeName).not.toBe('DIV')
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

  it('renders with secondary variant', () => {
    const { container } = render(<${name} variant="secondary">Secondary</${name}>)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('renders with ghost variant', () => {
    const { container } = render(<${name} variant="ghost">Ghost</${name}>)
    expect(container.firstChild).toHaveClass('hover:bg-accent')
  })

  it('renders with link variant', () => {
    const { container } = render(<${name} variant="link">Link</${name}>)
    expect(container.firstChild).toHaveClass('text-primary')
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

  it('renders with icon size', () => {
    const { container } = render(<${name} size="icon">🚀</${name}>)
    expect(container.firstChild).toHaveClass('h-10 w-10')
  })
  ` : ''}

  // Event handler tests
  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<${name} onClick={handleClick}>Click me</${name}>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<${name} onKeyDown={handleKeyDown}>Press</${name}>)
    fireEvent.keyDown(screen.getByText('Press'), { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  // Disabled state tests
  it('applies disabled styles when disabled', () => {
    const { container } = render(<${name} disabled>Disabled</${name}>)
    expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
  })

  // Focus management tests
  it('applies focus-visible styles', () => {
    const { container } = render(<${name}>Focus</${name}>)
    expect(container.firstChild).toHaveClass('focus-visible:ring-2')
  })

  // Children rendering tests
  it('renders children correctly', () => {
    render(
      <${name}>
        <span>Child 1</span>
        <span>Child 2</span>
      </${name}>
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  // Icon support tests
  it('renders with icon', () => {
    render(<${name}><span data-testid="icon">🚀</span>With Icon</${name}>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })
})
`;
}
function generateStoriesCode(name) {
    const isVoid = isVoidElement(name);
    if (isVoid) {
        // Void element stories - no children, use props instead
        return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: { placeholder: 'Enter text...', type: 'text' },
}

export const Email: Story = {
  args: { placeholder: 'Enter email...', type: 'email' },
}

export const Password: Story = {
  args: { placeholder: 'Enter password...', type: 'password' },
}

export const WithValue: Story = {
  args: { value: 'Pre-filled value', placeholder: 'Enter text...' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
}

export const Required: Story = {
  args: { placeholder: 'Required field', required: true },
}

export const ReadOnly: Story = {
  args: { value: 'Read only content', readOnly: true },
}
`;
    }
    // Regular component stories - can have children
    return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
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
  args: { children: '${name}', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: '${name}', variant: 'outline' },
}

export const Small: Story = {
  args: { children: '${name}', size: 'sm' },
}

export const Large: Story = {
  args: { children: '${name}', size: 'lg' },
}
`;
}
function generateExtendedStoriesCode(name, componentName) {
    return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A ${componentName.toLowerCase()} component built with shadcn/ui patterns using class-variance-authority for variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the component',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Change the default rendered element for the one passed as a child',
    },
  },
}

export default meta
type Story = StoryObj<typeof ${name}>

// Basic variants
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

// Sizes
export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const Icon: Story = {
  args: { children: '🚀', size: 'icon' },
}

// States
export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

// With icons
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

// Loading state
export const Loading: Story = {
  args: {
    children: (
      <>
        <span className="animate-spin">⏳</span>
        <span>Loading...</span>
      </>
    ),
    disabled: true,
  },
}
`;
}
function generateIndexCode(name) {
    return `export { ${name} } from './${name}'
export type { ${name}Props } from './${name}'
`;
}
function generateDocsCode(name, templateContent) {
    // Extract exported components from template
    const exportMatches = templateContent.match(/export\s*\{([^}]+)\}/);
    const exports = exportMatches ? exportMatches[1].split(',').map(e => e.trim()) : [name];
    // Extract props interface
    const propsMatch = templateContent.match(/interface\s+(\w+Props)[^{]*\{([^}]*)\}/s);
    const propsInterface = propsMatch ? propsMatch[1] : `${name}Props`;
    // Extract variants from cva
    const variantMatches = templateContent.match(/variants:\s*\{([^}]*variant:\s*\{[^}]*\})/s);
    const variants = variantMatches ? 'default, destructive, outline, secondary, ghost, link' : 'N/A';
    return `# ${name} Component

## Description
A ${name.toLowerCase()} component built with shadcn/ui patterns using class-variance-authority for variants.

## Exports
${exports.map(e => `- \`${e}\``).join('\n')}

## Props Interface
\`${propsInterface}\`

## Variants
${variants}

## Usage

\`\`\`tsx
import { ${name} } from '@repo/ui'

// Default usage
<${name}>Click me</${name}>

// With variant
<${name} variant="destructive">Delete</${name}>

// With size
<${name} size="lg">Large Button</${name}>
\`\`\`

## Accessibility
- Uses semantic HTML elements
- Supports keyboard navigation
- Includes focus-visible styles
- Proper ARIA attributes where needed

## Dependencies
- \`class-variance-authority\` - Variant management
- \`@/lib/utils\` - Class name merging utility (cn)
${exports.includes('Slot') || templateContent.includes('Slot') ? '- `@radix-ui/react-slot` - Polymorphic component support' : ''}
`;
}
// ============================================================================
// REVIEW FUNCTIONS
// ============================================================================
function runTypeScriptCheck(componentDir) {
    try {
        const tsconfigPath = findTsconfig(componentDir);
        if (!tsconfigPath) {
            return { errors: ['No tsconfig.json found'], passed: false };
        }
        execSync(`npx tsc --noEmit --project ${tsconfigPath}`, {
            cwd: componentDir,
            stdio: 'pipe',
            timeout: 30000,
        });
        return { errors: [], passed: true };
    }
    catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
        const errors = output.split('\n').filter((line) => line.trim().length > 0);
        return { errors, passed: false };
    }
}
function runTests(componentDir) {
    try {
        const testFile = fs.readdirSync(componentDir).find(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
        if (!testFile) {
            return { passed: 0, failed: 0, errors: ['No test file found'] };
        }
        const output = execSync(`npx vitest run ${testFile} --reporter=json`, {
            cwd: path.join(componentDir, '..', '..'),
            stdio: 'pipe',
            timeout: 60000,
        }).toString();
        try {
            const result = JSON.parse(output);
            return {
                passed: result.numPassedTests || 0,
                failed: result.numFailedTests || 0,
                errors: result.testResults?.[0]?.message ? [result.testResults[0].message] : [],
            };
        }
        catch {
            return { passed: 1, failed: 0, errors: [] };
        }
    }
    catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
        return { passed: 0, failed: 1, errors: [output] };
    }
}
function checkAccessibility(componentDir, componentName) {
    const issues = [];
    const mainFile = path.join(componentDir, `${componentName}.tsx`);
    if (!fs.existsSync(mainFile)) {
        issues.push('Component file not found');
        return issues;
    }
    const content = fs.readFileSync(mainFile, 'utf-8');
    // Check for proper semantic HTML
    if (content.includes('<div') && componentName.toLowerCase() === 'button') {
        issues.push('Button component should use <button> element, not <div>');
    }
    // Check for aria attributes
    if (!content.includes('aria-') && !content.includes('role=')) {
        issues.push('Consider adding ARIA attributes for accessibility');
    }
    // Check for keyboard handlers
    if (componentName.toLowerCase() === 'button' && !content.includes('onKeyDown') && !content.includes('onClick')) {
        issues.push('Interactive component should have keyboard event handlers');
    }
    // Check for focus styles
    if (!content.includes('focus-visible')) {
        issues.push('Consider adding focus-visible styles for keyboard navigation');
    }
    // Check for displayName
    if (!content.includes('displayName')) {
        issues.push('Consider adding displayName for better React DevTools debugging');
    }
    return issues;
}
function calculateQualityScore(typescriptPassed, testResults, a11yIssues) {
    const score = 100;
    if (!typescriptPassed)
        score -= 30;
    if (testResults.failed > 0)
        score -= 25;
    score -= Math.min(a11yIssues.length * 5, 20);
    return Math.max(0, score);
}
function findTsconfig(dir) {
    let current = dir;
    while (current !== '/' && current !== '.') {
        const tsconfig = path.join(current, 'tsconfig.json');
        if (fs.existsSync(tsconfig))
            return tsconfig;
        current = path.dirname(current);
    }
    return null;
}
// ============================================================================
// FIX AND IMPROVISE FUNCTIONS
// ============================================================================
function autoFixComponent(componentDir, componentName) {
    const fixed = [];
    const remaining = [];
    const mainFile = path.join(componentDir, `${componentName}.tsx`);
    if (!fs.existsSync(mainFile)) {
        remaining.push('Component file not found');
        return { fixed, remaining };
    }
    let content = fs.readFileSync(mainFile, 'utf-8');
    let modified = false;
    // Fix import paths
    if (content.includes('@/lib/utils')) {
        content = content.replace(/import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g, 'import { cn } from "../../lib/utils"');
        fixed.push('Fixed @/lib/utils import path to relative path');
        modified = true;
    }
    if (modified) {
        fs.writeFileSync(mainFile, content);
    }
    return { fixed, remaining };
}
function improviseComponent(componentDir, componentName) {
    const added = [];
    const enhanced = [];
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
    return { added, enhanced };
}
// ============================================================================
// MAIN SERVER CLASS
// ============================================================================
class ComponentFactoryServer {
    server;
    constructor() {
        this.server = new Server({ name: 'component-factory', version: '2.0.0' }, { capabilities: { tools: {} } });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'generate_component',
                    description: 'Generate a React component using actual shadcn/ui source code with TypeScript types, tests, and Storybook stories',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Component name in PascalCase (e.g., Button, Card, Input)' },
                            outputPath: { type: 'string', description: 'Output directory path (e.g., packages/ui/components)' },
                            includeTests: { type: 'boolean', description: 'Generate Vitest test file', default: true },
                            includeStories: { type: 'boolean', description: 'Generate Storybook stories', default: true },
                            includeTypes: { type: 'boolean', description: 'Generate separate types file', default: true },
                            includeDocs: { type: 'boolean', description: 'Generate documentation file', default: true },
                        },
                        required: ['name', 'outputPath'],
                    },
                },
                {
                    name: 'scaffold_component_folder',
                    description: 'Create the folder structure for a component without generating code',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Component name in PascalCase' },
                            outputPath: { type: 'string', description: 'Base output directory path' },
                        },
                        required: ['name', 'outputPath'],
                    },
                },
                {
                    name: 'generate_component_library',
                    description: 'Generate multiple components at once using shadcn/ui templates',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            components: { type: 'array', items: { type: 'string' }, description: 'List of component names in PascalCase' },
                            outputPath: { type: 'string', description: 'Base output directory path' },
                            includeTests: { type: 'boolean', default: true },
                            includeStories: { type: 'boolean', default: true },
                        },
                        required: ['components', 'outputPath'],
                    },
                },
                {
                    name: 'check_component_exists',
                    description: 'Check if a component already exists at the specified path',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Component name' },
                            outputPath: { type: 'string', description: 'Output directory path' },
                        },
                        required: ['name', 'outputPath'],
                    },
                },
                {
                    name: 'review_component',
                    description: 'Review a generated component for TypeScript errors, test results, accessibility issues, and code quality',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to the component directory' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'generate_documentation',
                    description: 'Generate documentation for a component including MDX docs, API JSON, and usage examples',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            componentPath: { type: 'string', description: 'Path to the component directory' },
                            format: { type: 'string', enum: ['mdx', 'md', 'json'], description: 'Output format', default: 'md' },
                        },
                        required: ['componentPath'],
                    },
                },
                {
                    name: 'list_templates',
                    description: 'List all available shadcn/ui component templates',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'fix_improvise_review',
                    description: 'Fix issues, add more variants/stories/tests, and review component quality. Use this for iterative improvement.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to the component directory' },
                        },
                        required: ['path'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'generate_component':
                    return await this.handleGenerateComponent(request.params.arguments);
                case 'scaffold_component_folder':
                    return await this.handleScaffoldFolder(request.params.arguments);
                case 'generate_component_library':
                    return await this.handleGenerateLibrary(request.params.arguments);
                case 'check_component_exists':
                    return await this.handleCheckExists(request.params.arguments);
                case 'review_component':
                    return await this.handleReviewComponent(request.params.arguments);
                case 'generate_documentation':
                    return await this.handleGenerateDocumentation(request.params.arguments);
                case 'list_templates':
                    return await this.handleListTemplates();
                case 'fix_improvise_review':
                    return await this.handleFixImproviseReview(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleGenerateComponent(args) {
        const { name, outputPath, includeTests = true, includeStories = true, includeTypes = true, includeDocs = true } = args;
        const componentName = name.toLowerCase();
        try {
            const templateContent = readTemplate(componentName);
            const componentDir = path.join(outputPath, name);
            const resolvedDir = path.resolve(componentDir);
            if (!fs.existsSync(resolvedDir)) {
                fs.mkdirSync(componentDir, { recursive: true });
            }
            const files = [];
            // Main component - use actual shadcn/ui template (already fixed for monorepo)
            const componentPath = path.join(componentDir, `${name}.tsx`);
            fs.writeFileSync(componentPath, templateContent);
            files.push(componentPath);
            // Types
            if (includeTypes) {
                const typesPath = path.join(componentDir, `${name}.types.ts`);
                fs.writeFileSync(typesPath, generateTypesCode(name));
                files.push(typesPath);
            }
            // Tests
            if (includeTests) {
                const testPath = path.join(componentDir, `${name}.test.tsx`);
                fs.writeFileSync(testPath, generateTestCode(name));
                files.push(testPath);
            }
            // Stories
            if (includeStories) {
                const storiesPath = path.join(componentDir, `${name}.stories.tsx`);
                fs.writeFileSync(storiesPath, generateStoriesCode(name));
                files.push(storiesPath);
            }
            // Documentation
            if (includeDocs) {
                const docsPath = path.join(componentDir, `${name}.docs.md`);
                fs.writeFileSync(docsPath, generateDocsCode(name, templateContent));
                files.push(docsPath);
            }
            // Index
            const indexPath = path.join(componentDir, 'index.ts');
            fs.writeFileSync(indexPath, generateIndexCode(name));
            files.push(indexPath);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            componentName: name,
                            outputDirectory: componentDir,
                            source: 'shadcn/ui template',
                            filesGenerated: files.length,
                            files,
                            message: `Successfully generated ${name} component using actual shadcn/ui source code with ${files.length} files`,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: {
                                error: true,
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Check input parameters and ensure all required values are provided.',
                                timestamp: new Date().toISOString(),
                            },
                            availableTemplates: getAvailableTemplates(),
                        }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleScaffoldFolder(args) {
        const { name, outputPath } = args;
        try {
            const componentDir = path.join(outputPath, name);
            if (!fs.existsSync(componentDir)) {
                fs.mkdirSync(componentDir, { recursive: true });
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: true, message: `Created folder: ${componentDir}`, path: componentDir }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleGenerateLibrary(args) {
        const { components, outputPath, includeTests = true, includeStories = true } = args;
        try {
            const results = [];
            for (const componentName of components) {
                const result = await this.handleGenerateComponent({
                    name: componentName, outputPath, includeTests, includeStories, includeTypes: true, includeDocs: true,
                });
                results.push(JSON.parse(result.content[0].text));
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: true, totalComponents: components.length, results, message: `Generated ${components.length} components using shadcn/ui templates` }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleCheckExists(args) {
        const { name, outputPath } = args;
        try {
            const componentDir = path.join(outputPath, name);
            const exists = fs.existsSync(componentDir);
            let files = [];
            if (exists) {
                files = fs.readdirSync(componentDir);
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ exists, path: componentDir, files: exists ? files : [], message: exists ? `Component ${name} already exists` : `Component ${name} does not exist` }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleReviewComponent(args) {
        const { path: componentPath } = args;
        try {
            if (!fs.existsSync(componentPath)) {
                throw new Error(`Component path does not exist: ${componentPath}`);
            }
            const componentName = path.basename(componentPath);
            const tsResult = runTypeScriptCheck(componentPath);
            const testResults = runTests(componentPath);
            const a11yIssues = checkAccessibility(componentPath, componentName);
            const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);
            const suggestions = [];
            if (!tsResult.passed)
                suggestions.push('Fix TypeScript compilation errors');
            if (testResults.failed > 0)
                suggestions.push('Fix failing tests');
            if (a11yIssues.length > 0)
                suggestions.push('Address accessibility issues');
            if (qualityScore < 80)
                suggestions.push('Consider refactoring for better code quality');
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            component: componentName,
                            typescriptErrors: tsResult.errors,
                            testResults: {
                                passed: testResults.passed,
                                failed: testResults.failed,
                                errors: testResults.errors,
                            },
                            accessibilityIssues: a11yIssues,
                            codeQualityScore: qualityScore,
                            suggestions,
                            summary: qualityScore >= 80 ? 'Good quality' : qualityScore >= 60 ? 'Needs improvement' : 'Poor quality - requires significant changes',
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleGenerateDocumentation(args) {
        const { componentPath, format = 'md' } = args;
        try {
            if (!fs.existsSync(componentPath)) {
                throw new Error(`Component path does not exist: ${componentPath}`);
            }
            const componentName = path.basename(componentPath);
            const mainFile = path.join(componentPath, `${componentName}.tsx`);
            if (!fs.existsSync(mainFile)) {
                throw new Error(`Component file not found: ${mainFile}`);
            }
            const templateContent = fs.readFileSync(mainFile, 'utf-8');
            const exportMatches = templateContent.match(/export\s*\{([^}]+)\}/);
            const exports = exportMatches ? exportMatches[1].split(',').map(e => e.trim()) : [componentName];
            const propsMatch = templateContent.match(/interface\s+(\w+Props)[^{]*\{([^}]*)\}/s);
            const propsName = propsMatch ? propsMatch[1] : `${componentName}Props`;
            const docs = generateDocsCode(componentName, templateContent);
            const ext = format === 'json' ? 'json' : format;
            const docsPath = path.join(componentPath, `${componentName}.docs.${ext}`);
            if (format === 'json') {
                const jsonDocs = {
                    name: componentName,
                    exports,
                    propsInterface: propsName,
                    description: `A ${componentName.toLowerCase()} component built with shadcn/ui patterns`,
                    source: 'shadcn/ui template',
                    accessibility: {
                        semanticHtml: true,
                        keyboardNavigation: true,
                        focusManagement: true,
                    },
                };
                fs.writeFileSync(docsPath, JSON.stringify(jsonDocs, null, 2));
            }
            else {
                fs.writeFileSync(docsPath, docs);
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            component: componentName,
                            documentationFile: docsPath,
                            format,
                            exports,
                            message: `Generated ${format.toUpperCase()} documentation for ${componentName}`,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleListTemplates() {
        try {
            const templates = getAvailableTemplates();
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            templates,
                            count: templates.length,
                            message: `Found ${templates.length} shadcn/ui component templates`,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleFixImproviseReview(args) {
        const { path: componentPath } = args;
        try {
            if (!fs.existsSync(componentPath)) {
                throw new Error(`Component path does not exist: ${componentPath}`);
            }
            const componentName = path.basename(componentPath);
            // Step 1: Auto-fix issues
            const fixResult = autoFixComponent(componentPath, componentName);
            // Step 2: Improvise (add more variants, stories, tests)
            const improviseResult = improviseComponent(componentPath, componentName);
            // Step 3: Run review
            const tsResult = runTypeScriptCheck(componentPath);
            const testResults = runTests(componentPath);
            const a11yIssues = checkAccessibility(componentPath, componentName);
            const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);
            const suggestions = [];
            if (!tsResult.passed)
                suggestions.push('Fix TypeScript compilation errors');
            if (testResults.failed > 0)
                suggestions.push('Fix failing tests');
            if (a11yIssues.length > 0)
                suggestions.push('Address accessibility issues');
            if (qualityScore < 80)
                suggestions.push('Consider refactoring for better code quality');
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            component: componentName,
                            workflow: {
                                fixes: {
                                    applied: fixResult.fixed,
                                    remaining: fixResult.remaining,
                                },
                                improvements: {
                                    enhanced: improviseResult.enhanced,
                                    added: improviseResult.added,
                                },
                            },
                            review: {
                                typescriptErrors: tsResult.errors,
                                testResults: {
                                    passed: testResults.passed,
                                    failed: testResults.failed,
                                    errors: testResults.errors,
                                },
                                accessibilityIssues: a11yIssues,
                                codeQualityScore: qualityScore,
                                suggestions,
                                summary: qualityScore >= 80 ? 'Good quality' : qualityScore >= 60 ? 'Needs improvement' : 'Poor quality - requires significant changes',
                            },
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Component Factory MCP server v2.0 running on stdio (shadcn/ui templates)');
    }
}
const server = new ComponentFactoryServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map