#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
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
// NAME VALIDATION
// ============================================================================

function validateComponentName(name: string): { valid: boolean; suggestion?: string; error?: string } {
  // Check for hyphens (invalid JavaScript identifier)
  if (name.includes('-')) {
    const suggestion = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return {
      valid: false,
      suggestion,
      error: `Component name "${name}" contains hyphens which are invalid JavaScript identifiers. Use "${suggestion}" instead.`,
    };
  }

  // Check for other invalid characters
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return {
      valid: false,
      error: `Component name "${name}" must be in PascalCase (start with uppercase letter, contain only alphanumeric characters)`,
    };
  }

  return { valid: true };
}

// ============================================================================
// TEMPLATE READER
// ============================================================================

function readTemplate(componentName: string): string {
  const templatePath = path.join(TEMPLATES_DIR, `${componentName}.tsx`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${componentName}. Available templates: ${getAvailableTemplates().join(', ')}`);
  }
  let content = fs.readFileSync(templatePath, 'utf-8');
  return fixTemplateForMonorepo(content);
}

function getAvailableTemplates(): string[] {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];
  return fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.tsx'))
    .map(f => f.replace('.tsx', ''));
}

// ============================================================================
// TEMPLATE FIXES FOR MONOREPO
// ============================================================================

function fixTemplateForMonorepo(templateContent: string): string {
  // Fix @/lib/utils import path to use relative path for monorepo compatibility
  return templateContent.replace(
    /import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g,
    'import { cn } from "../../lib/utils"'
  );
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
const VOID_COMPONENTS = ['input', 'img', 'separator', 'divider'] as const;

function isVoidElement(componentName: string): boolean {
  const lowerName = componentName.toLowerCase();
  return VOID_COMPONENTS.includes(lowerName as typeof VOID_COMPONENTS[number]);
}

function isInteractiveElement(componentName: string): boolean {
  const interactiveComponents = ['button', 'link', 'anchor', 'tab', 'toggle', 'switch', 'checkbox', 'radio'] as const;
  const lowerName = componentName.toLowerCase();
  return interactiveComponents.some(ic => lowerName.includes(ic));
}

// ============================================================================
// CODE GENERATORS (using shadcn/ui templates)
// ============================================================================

function generateTypesCode(name: string): string {
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

function generateTestCode(name: string): string {
  const isVoid = isVoidElement(name);
  
  if (isVoid) {
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

function generateExtendedTestCode(name: string, componentName: string): string {
  const isVoid = isVoidElement(componentName);
  const hasVariants = componentName.toLowerCase() === 'button' || componentName.toLowerCase() === 'badge';
  const hasSizes = componentName.toLowerCase() === 'button';
  
  if (isVoid) {
    return `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })

  it('handles onChange events', () => {
    const handleChange = vi.fn()
    render(<${name} onChange={handleChange} placeholder="test" />)
    const input = screen.getByPlaceholderText('test')
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('handles disabled state', () => {
    render(<${name} disabled placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeDisabled()
  })
})
`;
  }
  
  return `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })

  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<${name} onClick={handleClick}>Click me</${name}>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies disabled styles when disabled', () => {
    const { container } = render(<${name} disabled>Disabled</${name}>)
    expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
  })
})
`;
}

function generateStoriesCode(name: string): string {
  const isVoid = isVoidElement(name);
  
  if (isVoid) {
    return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: { placeholder: 'Enter text...', type: 'text' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
}
`;
  }
  
  return `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ${name}>

export const Default: Story = {
  args: { children: '${name}', variant: 'default' },
}

export const Destructive: Story = {
  args: { children: '${name}', variant: 'destructive' },
}
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

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
`;
}

function generateIndexCode(name: string): string {
  return `export { ${name} } from './${name}'
export type { ${name}Props, ${name}Variant, ${name}Size } from './${name}.types'
`;
}

function generateDocsCode(name: string, templateContent: string): string {
  const exportMatches = templateContent.match(/export\s*\{([^}]+)\}/);
  const exports = exportMatches ? exportMatches[1].split(',').map(e => e.trim()) : [name];

  return `# ${name} Component

## Description
A ${name.toLowerCase()} component built with shadcn/ui patterns using class-variance-authority for variants.

## Exports
${exports.map(e => `- \`${e}\``).join('\n')}

## Usage

\`\`\`tsx
import { ${name} } from '@repo/ui'

<${name}>Click me</${name}>
<${name} variant="destructive">Delete</${name}>
\`\`\`

## Dependencies
- \`class-variance-authority\` - Variant management
- \`@/lib/utils\` - Class name merging utility (cn)
`;
}

// ============================================================================
// REVIEW FUNCTIONS
// ============================================================================

function runTypeScriptCheck(componentDir: string): { errors: string[], passed: boolean } {
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
  } catch (error: unknown) {
    const err = error as { stdout?: { toString(): string }; stderr?: { toString(): string }; message: string };
    const output = err.stdout?.toString() || err.stderr?.toString() || err.message;
    const errors = output.split('\n').filter((line: string) => line.trim().length > 0);
    return { errors, passed: false };
  }
}

function runTests(componentDir: string): { passed: number, failed: number, errors: string[] } {
  try {
    const testFile = fs.readdirSync(componentDir).find(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
    if (!testFile) {
      return { passed: 0, failed: 0, errors: ['No test file found'] };
    }

    // Use absolute path so cwd offset doesn't affect test file resolution
    const absoluteTestPath = path.resolve(componentDir, testFile);
    const projectRoot = path.join(componentDir, '..', '..');
    const outputFile = path.join(projectRoot, `.vitest-result-${Date.now()}.json`);

    try {
      execSync(
        `npx vitest run "${absoluteTestPath}" --reporter=json --outputFile="${outputFile}"`,
        { cwd: projectRoot, stdio: 'pipe', timeout: 60000 },
      );
    } catch {
      // vitest exits non-zero on test failure; output file still written
    }

    if (!fs.existsSync(outputFile)) {
      return { passed: 0, failed: 1, errors: ['Test runner produced no output'] };
    }

    try {
      const output = fs.readFileSync(outputFile, 'utf-8');
      fs.unlinkSync(outputFile);
      const result = JSON.parse(output);
      return {
        passed: result.numPassedTests || 0,
        failed: result.numFailedTests || 0,
        errors: result.testResults?.[0]?.message ? [result.testResults[0].message] : [],
      };
    } catch {
      fs.existsSync(outputFile) && fs.unlinkSync(outputFile);
      return { passed: 0, failed: 1, errors: ['Failed to parse test output'] };
    }
  } catch (error: unknown) {
    const err = error as { stdout?: { toString(): string }; stderr?: { toString(): string }; message: string };
    const output = err.stdout?.toString() || err.stderr?.toString() || err.message;
    return { passed: 0, failed: 1, errors: [output] };
  }
}

function checkAccessibility(componentDir: string, componentName: string): string[] {
  const issues: string[] = [];
  const mainFile = path.join(componentDir, `${componentName}.tsx`);

  if (!fs.existsSync(mainFile)) {
    issues.push('Component file not found');
    return issues;
  }

  const content = fs.readFileSync(mainFile, 'utf-8');

  if (content.includes('<div') && componentName.toLowerCase() === 'button') {
    issues.push('Button component should use <button> element, not <div>');
  }

  if (!content.includes('aria-') && !content.includes('role=')) {
    issues.push('Consider adding ARIA attributes for accessibility');
  }

  if (!content.includes('focus-visible')) {
    issues.push('Consider adding focus-visible styles for keyboard navigation');
  }

  if (!content.includes('displayName')) {
    issues.push('Consider adding displayName for better React DevTools debugging');
  }

  return issues;
}

function calculateQualityScore(
  typescriptPassed: boolean,
  testResults: { passed: number, failed: number },
  a11yIssues: string[]
): number {
  let score = 100;

  if (!typescriptPassed) score -= 30;
  if (testResults.failed > 0) score -= 25;
  score -= Math.min(a11yIssues.length * 5, 20);

  return Math.max(0, score);
}

function findTsconfig(dir: string): string | null {
  let current = dir;
  while (current !== '/' && current !== '.') {
    const tsconfig = path.join(current, 'tsconfig.json');
    if (fs.existsSync(tsconfig)) return tsconfig;
    current = path.dirname(current);
  }
  return null;
}

// ============================================================================
// FIX AND IMPROVISE FUNCTIONS
// ============================================================================

function autoFixComponent(componentDir: string, componentName: string): { fixed: string[], remaining: string[] } {
  const fixed: string[] = [];
  const remaining: string[] = [];
  const mainFile = path.join(componentDir, `${componentName}.tsx`);

  if (!fs.existsSync(mainFile)) {
    remaining.push('Component file not found');
    return { fixed, remaining };
  }

  let content = fs.readFileSync(mainFile, 'utf-8');
  let modified = false;

  if (content.includes('@/lib/utils')) {
    content = content.replace(
      /import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g,
      'import { cn } from "../../lib/utils"'
    );
    fixed.push('Fixed @/lib/utils import path to relative path');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(mainFile, content);
  }

  return { fixed, remaining };
}

function improviseComponent(componentDir: string, componentName: string): { added: string[], enhanced: string[] } {
  const added: string[] = [];
  const enhanced: string[] = [];

  const testFile = path.join(componentDir, `${componentName}.test.tsx`);
  if (fs.existsSync(testFile)) {
    const extendedTests = generateExtendedTestCode(componentName, componentName);
    fs.writeFileSync(testFile, extendedTests);
    enhanced.push('Extended test file with comprehensive test cases');
  }

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

class ComponentFactoryServer extends McpServerBase {
  constructor() {
    super({ name: 'component-factory', version: '2.0.0' });
  }

  protected registerTools(): void {
    this.addTool(
      'generate_component',
      'Generate a React component using actual shadcn/ui source code with TypeScript types, tests, and Storybook stories',
      {
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
      this.handleGenerateComponent.bind(this)
    );

    this.addTool(
      'scaffold_component_folder',
      'Create the folder structure for a component without generating code',
      {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Component name in PascalCase' },
          outputPath: { type: 'string', description: 'Base output directory path' },
        },
        required: ['name', 'outputPath'],
      },
      this.handleScaffoldFolder.bind(this)
    );

    this.addTool(
      'generate_component_library',
      'Generate multiple components at once using shadcn/ui templates',
      {
        type: 'object',
        properties: {
          components: { type: 'array', items: { type: 'string' }, description: 'List of component names in PascalCase' },
          outputPath: { type: 'string', description: 'Base output directory path' },
          includeTests: { type: 'boolean', default: true },
          includeStories: { type: 'boolean', default: true },
        },
        required: ['components', 'outputPath'],
      },
      this.handleGenerateLibrary.bind(this)
    );

    this.addTool(
      'check_component_exists',
      'Check if a component already exists at the specified path',
      {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Component name' },
          outputPath: { type: 'string', description: 'Output directory path' },
        },
        required: ['name', 'outputPath'],
      },
      this.handleCheckExists.bind(this)
    );

    this.addTool(
      'review_component',
      'Review a generated component for TypeScript errors, test results, accessibility issues, and code quality',
      {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the component directory' },
        },
        required: ['path'],
      },
      this.handleReviewComponent.bind(this)
    );

    this.addTool(
      'generate_documentation',
      'Generate documentation for a component including MDX docs, API JSON, and usage examples',
      {
        type: 'object',
        properties: {
          componentPath: { type: 'string', description: 'Path to the component directory' },
          format: { type: 'string', enum: ['mdx', 'md', 'json'], description: 'Output format', default: 'md' },
        },
        required: ['componentPath'],
      },
      this.handleGenerateDocumentation.bind(this)
    );

    this.addTool(
      'list_templates',
      'List all available shadcn/ui component templates',
      { type: 'object', properties: {} },
      this.handleListTemplates.bind(this)
    );

    this.addTool(
      'fix_improvise_review',
      'Fix issues, add more variants/stories/tests, and review component quality. Use this for iterative improvement.',
      {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the component directory' },
        },
        required: ['path'],
      },
      this.handleFixImproviseReview.bind(this)
    );
  }

  private async handleGenerateComponent(args: unknown): Promise<ToolResult> {
    const { name, outputPath, includeTests = true, includeStories = true, includeTypes = true, includeDocs = true } = args as {
      name: string;
      outputPath: string;
      includeTests?: boolean;
      includeStories?: boolean;
      includeTypes?: boolean;
      includeDocs?: boolean;
    };

    // Validate component name
    const validation = validateComponentName(name);
    if (!validation.valid) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: {
              code: 'INVALID_NAME',
              message: validation.error,
              suggestion: validation.suggestion,
            },
          }, null, 2),
        }],
        isError: true,
      };
    }

    const componentName = name.toLowerCase();

    const templateContent = readTemplate(componentName);
    const componentDir = path.join(outputPath, name);

    const resolvedDir = path.resolve(componentDir);
    
    // Ensure parent directory exists first
    const parentDir = path.dirname(resolvedDir);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    
    // Create component directory (clear if exists to ensure clean generation)
    if (fs.existsSync(resolvedDir)) {
      // Clear existing directory for fresh generation
      fs.rmSync(resolvedDir, { recursive: true, force: true });
    }
    fs.mkdirSync(resolvedDir, { recursive: true });

    const files: string[] = [];

    const componentPath = path.join(componentDir, `${name}.tsx`);
    fs.writeFileSync(componentPath, templateContent);
    files.push(componentPath);

    if (includeTypes) {
      const typesPath = path.join(componentDir, `${name}.types.ts`);
      fs.writeFileSync(typesPath, generateTypesCode(name));
      files.push(typesPath);
    }

    if (includeTests) {
      const testPath = path.join(componentDir, `${name}.test.tsx`);
      fs.writeFileSync(testPath, generateTestCode(name));
      files.push(testPath);
    }

    if (includeStories) {
      const storiesPath = path.join(componentDir, `${name}.stories.tsx`);
      fs.writeFileSync(storiesPath, generateStoriesCode(name));
      files.push(storiesPath);
    }

    if (includeDocs) {
      const docsPath = path.join(componentDir, `${name}.docs.md`);
      fs.writeFileSync(docsPath, generateDocsCode(name, templateContent));
      files.push(docsPath);
    }

    const indexPath = path.join(componentDir, 'index.ts');
    fs.writeFileSync(indexPath, generateIndexCode(name));
    files.push(indexPath);

    return this.success({
      componentName: name,
      outputDirectory: componentDir,
      source: 'shadcn/ui template',
      filesGenerated: files.length,
      files,
      message: `Successfully generated ${name} component using actual shadcn/ui source code with ${files.length} files`,
    });
  }

  private async handleScaffoldFolder(args: unknown): Promise<ToolResult> {
    const { name, outputPath } = args as { name: string; outputPath: string };
    const componentDir = path.join(outputPath, name);
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    return this.success({ message: `Created folder: ${componentDir}`, path: componentDir });
  }

  private async handleGenerateLibrary(args: unknown): Promise<ToolResult> {
    const { components, outputPath, includeTests = true, includeStories = true } = args as {
      components: string[];
      outputPath: string;
      includeTests?: boolean;
      includeStories?: boolean;
    };
    
    const results: unknown[] = [];
    for (const componentName of components) {
      const result = await this.handleGenerateComponent({
        name: componentName,
        outputPath,
        includeTests,
        includeStories,
        includeTypes: true,
        includeDocs: true,
      });
      results.push(JSON.parse(result.content[0].text || '{}'));
    }
    
    return this.success({
      totalComponents: components.length,
      results,
      message: `Generated ${components.length} components using shadcn/ui templates`,
    });
  }

  private async handleCheckExists(args: unknown): Promise<ToolResult> {
    const { name, outputPath } = args as { name: string; outputPath: string };
    const componentDir = path.join(outputPath, name);
    const exists = fs.existsSync(componentDir);
    let files: string[] = [];
    if (exists) {
      files = fs.readdirSync(componentDir);
    }
    return this.success({
      exists,
      path: componentDir,
      files: exists ? files : [],
      message: exists ? `Component ${name} already exists` : `Component ${name} does not exist`,
    });
  }

  private async handleReviewComponent(args: unknown): Promise<ToolResult> {
    const { path: componentPath } = args as { path: string };
    
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Component path does not exist: ${componentPath}`);
    }

    const componentName = path.basename(componentPath);
    const tsResult = runTypeScriptCheck(componentPath);
    const testResults = runTests(componentPath);
    const a11yIssues = checkAccessibility(componentPath, componentName);
    const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);

    const suggestions: string[] = [];
    if (!tsResult.passed) suggestions.push('Fix TypeScript compilation errors');
    if (testResults.failed > 0) suggestions.push('Fix failing tests');
    if (a11yIssues.length > 0) suggestions.push('Address accessibility issues');
    if (qualityScore < 80) suggestions.push('Consider refactoring for better code quality');

    return this.success({
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
    });
  }

  private async handleGenerateDocumentation(args: unknown): Promise<ToolResult> {
    const { componentPath, format = 'md' } = args as { componentPath: string; format?: string };
    
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

    const docs = generateDocsCode(componentName, templateContent);
    const ext = format === 'json' ? 'json' : format;
    const docsPath = path.join(componentPath, `${componentName}.docs.${ext}`);

    if (format === 'json') {
      const jsonDocs = {
        name: componentName,
        exports,
        description: `A ${componentName.toLowerCase()} component built with shadcn/ui patterns`,
        source: 'shadcn/ui template',
      };
      fs.writeFileSync(docsPath, JSON.stringify(jsonDocs, null, 2));
    } else {
      fs.writeFileSync(docsPath, docs);
    }

    return this.success({
      component: componentName,
      documentationFile: docsPath,
      format,
      exports,
      message: `Generated ${format.toUpperCase()} documentation for ${componentName}`,
    });
  }

  private async handleListTemplates(_args: unknown): Promise<ToolResult> {
    const templates = getAvailableTemplates();
    return this.success({
      templates,
      count: templates.length,
      message: `Found ${templates.length} shadcn/ui component templates`,
    });
  }

  private async handleFixImproviseReview(args: unknown): Promise<ToolResult> {
    const { path: componentPath } = args as { path: string };
    
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Component path does not exist: ${componentPath}`);
    }

    const componentName = path.basename(componentPath);
    
    const fixResult = autoFixComponent(componentPath, componentName);
    const improviseResult = improviseComponent(componentPath, componentName);
    
    const tsResult = runTypeScriptCheck(componentPath);
    const testResults = runTests(componentPath);
    const a11yIssues = checkAccessibility(componentPath, componentName);
    const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);

    const suggestions: string[] = [];
    if (!tsResult.passed) suggestions.push('Fix TypeScript compilation errors');
    if (testResults.failed > 0) suggestions.push('Fix failing tests');
    if (a11yIssues.length > 0) suggestions.push('Address accessibility issues');
    if (qualityScore < 80) suggestions.push('Consider refactoring for better code quality');

    return this.success({
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
    });
  }
}

// ============================================================================
// START SERVER
// ============================================================================

new ComponentFactoryServer().run().catch(console.error);