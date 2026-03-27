#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface ComponentInfo {
  name: string;
  file: string;
  props: string[];
  hasVariants: boolean;
  hasSizes: boolean;
  isVoidElement: boolean;
  isInteractive: boolean;
}

// ============================================================================
// COMPONENT ANALYSIS
// ============================================================================

function scanDirectory(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'build', 'dist', '.next', '__tests__'].includes(entry.name)) continue;
      files.push(...scanDirectory(fullPath));
    } else if (entry.name.match(/\.(tsx|jsx)$/)) {
      if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

function analyzeComponent(content: string, filePath: string): ComponentInfo | null {
  const fileName = path.basename(filePath, path.extname(filePath));
  const name = fileName.replace(/[^a-zA-Z0-9]/g, '');

  // Check if it's a React component
  const isComponent = content.match(/(?:export\s+(?:default\s+)?)?(?:const|function)\s+[A-Z]\w+/) ||
    content.includes('React.FC') || content.includes('forwardRef');
  if (!isComponent) return null;

  // Extract props
  const propsInterface = content.match(/interface\s+\w*Props\s*\{([^}]*)\}/s);
  const props: string[] = [];
  if (propsInterface) {
    const propRegex = /(\w+)(?:\?)?\s*:/g;
    let match;
    while ((match = propRegex.exec(propsInterface[1])) !== null) {
      props.push(match[1]);
    }
  }

  const hasVariants = content.includes('variant') && (content.includes('cva') || content.includes("'default'") || content.includes("'destructive'"));
  const hasSizes = content.includes('size') && (content.includes("'sm'") || content.includes("'lg'") || content.includes("'icon'"));
  const isVoidElement = ['input', 'img', 'separator', 'divider', 'hr', 'br'].some(v => name.toLowerCase().includes(v));
  const isInteractive = ['button', 'link', 'tab', 'toggle', 'checkbox', 'radio', 'switch'].some(i => name.toLowerCase().includes(i));

  return { name, file: filePath, props, hasVariants, hasSizes, isVoidElement, isInteractive };
}

// ============================================================================
// STORY GENERATOR
// ============================================================================

function generateStory(info: ComponentInfo): string {
  const { name, props, hasVariants, hasSizes, isVoidElement, isInteractive } = info;

  const renderContent = isVoidElement ? 'placeholder="Enter text..."' : '{children}';
  const childrenLine = isVoidElement ? '' : `\n  args: {\n    children: '${name} content',\n  },`;

  const stories = `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  tags: ['autodocs'],
  argTypes: {`;

  // Generate argTypes for props
  for (const prop of props) {
    if (prop === 'variant') {
      stories += `
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },`;
    } else if (prop === 'size') {
      stories += `
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon'],
    },`;
    } else if (prop === 'disabled') {
      stories += `
    disabled: {
      control: 'boolean',
    },`;
    } else if (prop === 'children' || prop === 'className') {
      // skip
    }
  }

  stories += `
  },
};

export default meta;
type Story = StoryObj<typeof ${name}>;

// Default story
export const Default: Story = {${childrenLine}
};

// With custom className
export const WithClassName: Story = {
  args: {
    ${renderContent},
    className: 'border-2 border-blue-500',
  },
};
`;

  if (hasVariants) {
    stories += `
// Variant stories
export const Destructive: Story = {
  args: {
    ${renderContent},
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    ${renderContent},
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    ${renderContent},
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    ${renderContent},
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    ${renderContent},
    variant: 'link',
  },
};
`;
  }

  if (hasSizes) {
    stories += `
// Size stories
export const Small: Story = {
  args: {
    ${renderContent},
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    ${renderContent},
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    ${isVoidElement ? 'placeholder="🔍"' : 'children: "🔍"'},
    size: 'icon',
  },
};
`;
  }

  if (isInteractive) {
    stories += `
// Interaction stories
export const Disabled: Story = {
  args: {
    ${renderContent},
    disabled: true,
  },
};
`;
  }

  // Accessibility story
  stories += `
// Accessibility
export const WithAriaLabel: Story = {
  args: {
    ${renderContent},
    'aria-label': '${name} accessible label',
  },
};
`;

  return stories;
}

function findExistingStories(dir: string): string[] {
  const stories: string[] = [];
  if (!fs.existsSync(dir)) return stories;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.endsWith('.stories.tsx') || entry.name.endsWith('.stories.ts')) {
      stories.push(entry.name.replace(/\.(stories\.(tsx|ts))$/, ''));
    }
  }
  return stories;
}

// ============================================================================
// MAIN SERVER
// ============================================================================

class StorybookGeneratorServer extends McpServerBase {

  constructor() {
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  protected registerTools(): void {
    

    
  }

  private async handleGenerate(args: unknown) {
    const { path: targetPath, outputPath, overwrite = false } = args;
    try {
      const isDir = fs.statSync(targetPath).isDirectory();
      const files = isDir ? scanDirectory(targetPath) : [targetPath];
      const results: unknown[] = [];

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const info = analyzeComponent(content, file);
        if (!info) continue;

        const dir = path.dirname(file);
        const existingStories = findExistingStories(dir);
        if (existingStories.includes(info.name) && !overwrite) {
          results.push({ file, skipped: true, reason: 'Story already exists' });
          continue;
        }

        const storyContent = generateStory(info);
        const storyDir = outputPath || dir;
        const storyPath = path.join(storyDir, `${info.name}.stories.tsx`);

        fs.mkdirSync(path.dirname(storyPath), { recursive: true });
        fs.writeFileSync(storyPath, storyContent);
        results.push({ file, storyPath, component: info.name, props: info.props });
      }

      return this.success({generated: results.length, results});
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleCoverage(args: unknown) {
    const { path: targetPath } = args;
    try {
      const isDir = fs.statSync(targetPath).isDirectory();
      const files = isDir ? scanDirectory(targetPath) : [targetPath];
      const components: unknown[] = [];
      const withStories = 0;
      const withoutStories = 0;

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const info = analyzeComponent(content, file);
        if (!info) continue;

        const dir = path.dirname(file);
        const storiesPath = path.join(dir, `${info.name}.stories.tsx`);
        const hasStories = fs.existsSync(storiesPath);

        if (hasStories) withStories++;
        else withoutStories++;

        components.push({
          name: info.name,
          file,
          hasStories,
          storiesPath: hasStories ? storiesPath : null,
        });
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            summary: {
              totalComponents: components.length,
              withStories,
              withoutStories,
              coveragePercent: components.length > 0 ? Math.round((withStories / components.length) * 100) : 100,
            },
            components,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
        isError: true,
      };
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new StorybookGeneratorServer().run().catch(console.error);