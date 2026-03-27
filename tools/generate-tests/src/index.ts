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
  isForwardRef: boolean;
  isVoidElement: boolean;
  isInteractive: boolean;
  hasVariants: boolean;
  hasSizes: boolean;
  propsInterface: string;
  propsFields: string[];
  exports: string[];
}

interface FunctionInfo {
  name: string;
  params: string[];
  isAsync: boolean;
  isExported: boolean;
  returnType: string;
}

interface HookInfo {
  name: string;
  params: string[];
  returns: string[];
  isExported: boolean;
}

interface ClassInfo {
  name: string;
  methods: string[];
  properties: string[];
  isExported: boolean;
}

// ============================================================================
// SOURCE ANALYSIS
// ============================================================================

function analyzeSource(content: string, filePath: string): {
  components: ComponentInfo[];
  functions: FunctionInfo[];
  hooks: HookInfo[];
  classes: ClassInfo[];
  isReactFile: boolean;
  imports: string[];
} {
  const components: ComponentInfo[] = [];
  const functions: FunctionInfo[] = [];
  const hooks: HookInfo[] = [];
  const classes: ClassInfo[] = [];
  const imports: string[] = [];

  const isReactFile = content.includes('react') || content.includes('jsx') || content.includes('tsx') || content.includes('React');

  // Extract imports
  const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Detect React components with forwardRef
  const forwardRefRegex = /(?:export\s+)?(?:const|function)\s+(\w+)\s*=\s*(?:React\.)?forwardRef\s*[<(]/g;
  while ((match = forwardRefRegex.exec(content)) !== null) {
    const name = match[1];
    const propsInterface = extractPropsInterface(content, name);
    components.push({
      name,
      isForwardRef: true,
      isVoidElement: isVoidComponent(name),
      isInteractive: isInteractiveComponent(name),
      hasVariants: content.includes('variant') && content.includes('cva'),
      hasSizes: content.includes('size') && content.includes('cva'),
      propsInterface,
      propsFields: extractPropsFields(content, propsInterface),
      exports: extractExports(content),
    });
  }

  // Detect regular components
  const componentRegex = /(?:export\s+)?(?:const|function)\s+([A-Z]\w+)\s*(?:[:<].*?)?(?:=\s*(?:\(|React\.(?:memo|forwardRef)))/g;
  while ((match = componentRegex.exec(content)) !== null) {
    const name = match[1];
    if (components.find(c => c.name === name)) continue;
    const propsInterface = extractPropsInterface(content, name);
    components.push({
      name,
      isForwardRef: false,
      isVoidElement: isVoidComponent(name),
      isInteractive: isInteractiveComponent(name),
      hasVariants: content.includes('variant') && content.includes('cva'),
      hasSizes: content.includes('size') && content.includes('cva'),
      propsInterface,
      propsFields: extractPropsFields(content, propsInterface),
      exports: extractExports(content),
    });
  }

  // Detect functions
  const fnRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
  while ((match = fnRegex.exec(content)) !== null) {
    const name = match[1];
    if (name[0] === name[0].toUpperCase() && isReactFile) continue; // Skip components
    if (name.startsWith('use') && name[3] === name[3].toUpperCase()) {
      // It's a hook
      hooks.push({
        name,
        params: match[2].split(',').map(p => p.trim()).filter(Boolean),
        returns: [],
        isExported: content.includes(`export ${match[0]}`) || content.includes(`export async ${match[0]}`),
      });
    } else {
      functions.push({
        name,
        params: match[2].split(',').map(p => p.trim()).filter(Boolean),
        isAsync: match[0].includes('async'),
        isExported: content.includes(`export ${match[0]}`) || content.includes(`export async ${match[0]}`),
        returnType: '',
      });
    }
  }

  // Detect arrow function hooks
  const hookArrowRegex = /(?:export\s+)?(?:const|let)\s+(use[A-Z]\w+)\s*=\s*(?:\(([^)]*)\)|(\w+))\s*(?::.*?)?\s*=>/g;
  while ((match = hookArrowRegex.exec(content)) !== null) {
    const name = match[1];
    if (hooks.find(h => h.name === name)) continue;
    hooks.push({
      name,
      params: (match[2] || match[3] || '').split(',').map(p => p.trim()).filter(Boolean),
      returns: [],
      isExported: content.includes(`export const ${name}`) || content.includes(`export let ${name}`),
    });
  }

  // Detect classes
  const classRegex = /(?:export\s+)?class\s+(\w+)/g;
  while ((match = classRegex.exec(content)) !== null) {
    const name = match[1];
    const methods: string[] = [];
    const properties: string[] = [];
    const methodRegex = /(?:async\s+)?(\w+)\s*\(/g;
    let methodMatch;
    const classBody = content.slice(match.index);
    while ((methodMatch = methodRegex.exec(classBody)) !== null) {
      if (methodMatch.index > 500) break; // Stop after reasonable class body length
      methods.push(methodMatch[1]);
    }
    classes.push({
      name,
      methods,
      properties,
      isExported: content.includes(`export class ${name}`),
    });
  }

  return { components, functions, hooks, classes, isReactFile, imports };
}

function extractPropsInterface(content: string, componentName: string): string {
  const patterns = [
    new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]*)\\}`, 's'),
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*\\{([^}]*)\\}`, 's'),
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*React\\.ComponentProps[^\\n]*`, 's'),
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[0];
  }
  return '';
}

function extractPropsFields(content: string, propsInterface: string): string[] {
  if (!propsInterface) return [];
  const fieldRegex = /(\w+)(?:\?)?\s*:/g;
  const fields: string[] = [];
  let match;
  while ((match = fieldRegex.exec(propsInterface)) !== null) {
    fields.push(match[1]);
  }
  return fields;
}

function extractExports(content: string): string[] {
  const exports: string[] = [];
  const namedExportRegex = /export\s+\{([^}]+)\}/g;
  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    match[1].split(',').forEach(e => {
      const trimmed = e.trim().split(/\s+as\s+/)[0].trim();
      if (trimmed) exports.push(trimmed);
    });
  }
  const directExportRegex = /export\s+(?:const|function|class|type|interface)\s+(\w+)/g;
  while ((match = directExportRegex.exec(content)) !== null) {
    if (!exports.includes(match[1])) exports.push(match[1]);
  }
  return exports;
}

function isVoidComponent(name: string): boolean {
  const voids = ['input', 'img', 'separator', 'divider', 'br', 'hr'] as const;
  return voids.includes(name.toLowerCase());
}

function isInteractiveComponent(name: string): boolean {
  const interactive = ['button', 'link', 'anchor', 'tab', 'toggle', 'switch', 'checkbox', 'radio'] as const;
  return interactive.some(i => name.toLowerCase().includes(i));
}

// ============================================================================
// TEST GENERATORS
// ============================================================================

function generateComponentTests(info: ComponentInfo): string {
  const { name, isVoidElement, hasVariants, hasSizes, propsFields } = info;

  const renderProps = isVoidElement ? 'placeholder="test"' : 'children="Test Content"';
  const closeTag = isVoidElement ? '/>' : `>Test Content</${name}>`;

  let tests = `import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  it('renders successfully', () => {
    render(<${name} ${renderProps} />)
    expect(${isVoidElement ? 'screen.getByPlaceholderText("test")' : 'screen.getByText("Test Content")'}).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" ${renderProps} />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${name} ref={ref} ${renderProps} />)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<${name} data-testid="test-component" ${renderProps} />)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  it('has correct displayName', () => {
    expect(${name}.displayName).toBe('${name}')
  })
`;

  if (hasVariants) {
    tests += `
  // Variant tests
  it('renders with default variant', () => {
    const { container } = render(<${name} variant="default" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with destructive variant', () => {
    const { container } = render(<${name} variant="destructive" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with outline variant', () => {
    const { container } = render(<${name} variant="outline" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with secondary variant', () => {
    const { container } = render(<${name} variant="secondary" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with ghost variant', () => {
    const { container } = render(<${name} variant="ghost" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with link variant', () => {
    const { container } = render(<${name} variant="link" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })
`;
  }

  if (hasSizes) {
    tests += `
  // Size tests
  it('renders with default size', () => {
    const { container } = render(<${name} size="default" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with small size', () => {
    const { container } = render(<${name} size="sm" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with large size', () => {
    const { container } = render(<${name} size="lg" ${renderProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with icon size', () => {
    const { container } = render(<${name} size="icon" ${isVoidElement ? 'placeholder="i"' : '>🚀</' + name + '>'} />)
    expect(container.firstChild).toBeInTheDocument()
  })
`;
  }

  if (isVoidElement) {
    tests += `
  // Input-specific tests
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

  it('handles type prop', () => {
    render(<${name} type="email" placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toHaveAttribute('type', 'email')
  })

  it('handles required prop', () => {
    render(<${name} required placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeRequired()
  })
`;
  } else {
    tests += `
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

  it('applies disabled styles when disabled', () => {
    const { container } = render(<${name} disabled>Disabled</${name}>)
    expect(container.firstChild).toBeInTheDocument()
  })
`;
  }

  tests += `
  // Accessibility tests
  it('supports aria-label', () => {
    render(<${name} aria-label="custom-label" ${renderProps} />)
    expect(screen.getByLabelText('custom-label')).toBeInTheDocument()
  })

  it('supports data-testid', () => {
    render(<${name} data-testid="a11y-test" ${renderProps} />)
    expect(screen.getByTestId('a11y-test')).toBeInTheDocument()
  })
})
`;

  return tests;
}

function generateFunctionTests(info: FunctionInfo): string {
  const { name, params, isAsync } = info;
  const paramList = params.map(p => {
    const cleanName = p.replace(/[:?].*$/, '').trim();
    return cleanName;
  }).filter(Boolean);

  const awaitKeyword = isAsync ? 'await ' : '';

  let tests = `import { describe, it, expect } from 'vitest'
${isAsync ? '' : ''}

describe('${name}', () => {
  it('is defined', () => {
    expect(${name}).toBeDefined()
  })
`;

  if (paramList.length > 0) {
    tests += `
  it('handles valid input', () => {
    const result = ${awaitKeyword}${name}(${paramList.map(p => generateMockValue(p)).join(', ')})
    expect(result).toBeDefined()
  })

  it('handles edge cases', () => {
    // Test with minimal/empty input
    const result = ${awaitKeyword}${name}(${paramList.map(() => 'undefined').join(', ')})
    expect(result).toBeDefined()
  })
`;
  } else {
    tests += `
  it('returns expected output', () => {
    const result = ${awaitKeyword}${name}()
    expect(result).toBeDefined()
  })
`;
  }

  tests += `})
`;
  return tests;
}

function generateHookTests(info: HookInfo): string {
  const { name, params } = info;
  const paramList = params.map(p => p.replace(/[:?].*$/, '').trim()).filter(Boolean);

  return `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ${name} } from './${name.replace('use', '').toLowerCase()}' // Adjust import path

describe('${name}', () => {
  it('is defined', () => {
    expect(${name}).toBeDefined()
  })

  it('returns expected values', () => {
    const { result } = renderHook(() => ${name}(${paramList.map(p => generateMockValue(p)).join(', ')}))
    expect(result.current).toBeDefined()
  })

  it('handles updates correctly', () => {
    const { result } = renderHook(() => ${name}(${paramList.map(p => generateMockValue(p)).join(', ')}))
    expect(result.current).toBeDefined()
    // Add act() calls for state updates
  })

  it('cleans up on unmount', () => {
    const { unmount } = renderHook(() => ${name}(${paramList.map(p => generateMockValue(p)).join(', ')}))
    expect(() => unmount()).not.toThrow()
  })
})
`;
}

function generateClassTests(info: ClassInfo): string {
  const { name, methods } = info;

  const tests = `import { describe, it, expect, beforeEach } from 'vitest'
import { ${name} } from './${name.toLowerCase()}' // Adjust import path

describe('${name}', () => {
  let instance: ${name}

  beforeEach(() => {
    instance = new ${name}()
  })

  it('creates an instance', () => {
    expect(instance).toBeInstanceOf(${name})
  })
`;

  for (const method of methods) {
    if (method === 'constructor') continue;
    tests += `
  it('${method} is callable', () => {
    expect(typeof instance.${method}).toBe('function')
  })
`;
  }

  tests += `})
`;
  return tests;
}

function generateMockValue(paramName: string): string {
  const name = paramName.toLowerCase();
  if (name.includes('count') || name.includes('num') || name.includes('size')) return '0';
  if (name.includes('str') || name.includes('name') || name.includes('label')) return '"test"';
  if (name.includes('bool') || name.includes('flag') || name.includes('enabled')) return 'true';
  if (name.includes('callback') || name.includes('handler') || name.includes('fn')) return 'vi.fn()';
  if (name.includes('items') || name.includes('list') || name.includes('array')) return '[]';
  if (name.includes('obj') || name.includes('config') || name.includes('options')) return '{}';
  return 'undefined';
}

// ============================================================================
// FILE SCANNING
// ============================================================================

function scanDirectory(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'build' || entry.name === 'dist' || entry.name === '.next') continue;
      files.push(...scanDirectory(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      // Skip test files, stories, and type files
      if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.') || entry.name.includes('.types.')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

function findExistingTestFile(sourceFile: string): string | null {
  const dir = path.dirname(sourceFile);
  const ext = path.extname(sourceFile);
  const baseName = path.basename(sourceFile, ext);
  const testExtensions = ['.test.tsx', '.test.ts', '.spec.tsx', '.spec.ts'] as const;
  for (const testExt of testExtensions) {
    const testPath = path.join(dir, `${baseName}${testExt}`);
    if (fs.existsSync(testPath)) return testPath;
  }
  return null;
}

// ============================================================================
// MAIN SERVER
// ============================================================================

class GenerateTestsServer extends McpServerBase {

  constructor() {
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  protected registerTools(): void {
    

    
  }

  private async handleGenerateUnitTests(args: unknown) {
    const { path: targetPath, outputPath, overwrite = false } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const analysis = analyzeSource(content, file);

        if (analysis.functions.length === 0 && analysis.classes.length === 0) continue;

        const existingTest = findExistingTestFile(file);
        if (existingTest && !overwrite) {
          results.push({ file, skipped: true, reason: 'Test file already exists' });
          continue;
        }

        let testContent = '';
        for (const fn of analysis.functions) {
          testContent += generateFunctionTests(fn) + '\n';
        }
        for (const cls of analysis.classes) {
          testContent += generateClassTests(cls) + '\n';
        }

        const testDir = outputPath || path.dirname(file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const testPath = path.join(testDir, `${baseName}.test.${ext === '.tsx' || ext === '.jsx' ? 'tsx' : 'ts'}`);

        fs.mkdirSync(path.dirname(testPath), { recursive: true });
        fs.writeFileSync(testPath, testContent);
        results.push({ file, testPath, functions: analysis.functions.length, classes: analysis.classes.length });
      }

      return this.success({results, totalFiles: results.length});
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleGenerateComponentTests(args: unknown) {
    const { path: targetPath, outputPath, overwrite = false } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const analysis = analyzeSource(content, file);

        if (analysis.components.length === 0) continue;

        const existingTest = findExistingTestFile(file);
        if (existingTest && !overwrite) {
          results.push({ file, skipped: true, reason: 'Test file already exists' });
          continue;
        }

        let testContent = '';
        for (const comp of analysis.components) {
          testContent += generateComponentTests(comp) + '\n';
        }

        const testDir = outputPath || path.dirname(file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const testPath = path.join(testDir, `${baseName}.test.${ext === '.tsx' || ext === '.jsx' ? 'tsx' : 'ts'}`);

        fs.mkdirSync(path.dirname(testPath), { recursive: true });
        fs.writeFileSync(testPath, testContent);
        results.push({ file, testPath, components: analysis.components.map(c => c.name) });
      }

      return this.success({results, totalFiles: results.length});
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
        isError: true,
      };
    }
  }

  private async handleGenerateHookTests(args: unknown) {
    const { path: targetPath, outputPath, overwrite = false } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const analysis = analyzeSource(content, file);

        if (analysis.hooks.length === 0) continue;

        const existingTest = findExistingTestFile(file);
        if (existingTest && !overwrite) {
          results.push({ file, skipped: true, reason: 'Test file already exists' });
          continue;
        }

        let testContent = '';
        for (const hook of analysis.hooks) {
          testContent += generateHookTests(hook) + '\n';
        }

        const testDir = outputPath || path.dirname(file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const testPath = path.join(testDir, `${baseName}.test.${ext === '.tsx' || ext === '.jsx' ? 'tsx' : 'ts'}`);

        fs.mkdirSync(path.dirname(testPath), { recursive: true });
        fs.writeFileSync(testPath, testContent);
        results.push({ file, testPath, hooks: analysis.hooks.map(h => h.name) });
      }

      return this.success({results, totalFiles: results.length});
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
        isError: true,
      };
    }
  }

  private async handleGenerateAllTests(args: unknown) {
    const { path: targetPath, outputPath, overwrite = false } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const analysis = analyzeSource(content, file);

        const hasContent = analysis.components.length > 0 || analysis.functions.length > 0 ||
          analysis.hooks.length > 0 || analysis.classes.length > 0;
        if (!hasContent) continue;

        const existingTest = findExistingTestFile(file);
        if (existingTest && !overwrite) {
          results.push({ file, skipped: true, reason: 'Test file already exists' });
          continue;
        }

        const testContent = '';
        for (const comp of analysis.components) {
          testContent += generateComponentTests(comp) + '\n';
        }
        for (const fn of analysis.functions) {
          testContent += generateFunctionTests(fn) + '\n';
        }
        for (const hook of analysis.hooks) {
          testContent += generateHookTests(hook) + '\n';
        }
        for (const cls of analysis.classes) {
          testContent += generateClassTests(cls) + '\n';
        }

        const testDir = outputPath || path.dirname(file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const testExt = (ext === '.tsx' || ext === '.jsx') ? 'tsx' : 'ts';
        const testPath = path.join(testDir, `${baseName}.test.${testExt}`);

        fs.mkdirSync(path.dirname(testPath), { recursive: true });
        fs.writeFileSync(testPath, testContent);
        results.push({
          file,
          testPath,
          components: analysis.components.map(c => c.name),
          functions: analysis.functions.map(f => f.name),
          hooks: analysis.hooks.map(h => h.name),
          classes: analysis.classes.map(c => c.name),
        });
      }

      return this.success({results,
          totalFiles: results.length,
          summary: {
            components: results.reduce((acc, r) => acc + (r.components?.length || 0), 0),
            functions: results.reduce((acc, r) => acc + (r.functions?.length || 0), 0),
            hooks: results.reduce((acc, r) => acc + (r.hooks?.length || 0), 0),
            classes: results.reduce((acc, r) => acc + (r.classes?.length || 0), 0),
            skipped: results.filter(r => r.skipped).length,
          },});
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

new GenerateTestsServer().run().catch(console.error);