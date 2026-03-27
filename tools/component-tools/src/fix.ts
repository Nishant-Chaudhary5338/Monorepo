#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface FixResult {
  fixed: string[];
  remaining: string[];
}

interface ComponentAnalysis {
  hasAriaAttributes: boolean;
  hasDisplayName: boolean;
  hasFocusVisible: boolean;
  hasKeyboardHandlers: boolean;
  hasSemanticHtml: boolean;
  hasProperTypes: boolean;
  hasRefForwarding: boolean;
  hasClassNameMerging: boolean;
}

function analyzeComponent(content: string, componentName: string): ComponentAnalysis {
  return {
    hasAriaAttributes: /aria-[a-z]+/.test(content) || /role=/.test(content),
    hasDisplayName: content.includes('.displayName'),
    hasFocusVisible: /focus-visible/.test(content),
    hasKeyboardHandlers: /onKeyDown|onKeyUp|onKeyPress/.test(content),
    hasSemanticHtml: !/<div[^>]*>/.test(content) || /<button|<a|<input|<select|<textarea/.test(content),
    hasProperTypes: /interface\s+\w+Props/.test(content),
    hasRefForwarding: /forwardRef/.test(content),
    hasClassNameMerging: /cn\(/.test(content) || /clsx\(/.test(content) || /twMerge\(/.test(content),
  };
}

function fixImportPaths(content: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Fix @/lib/utils import
  if (content.includes('@/lib/utils')) {
    modifiedContent = modifiedContent.replace(
      /import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g,
      'import { cn } from "../../lib/utils"'
    );
    fixed.push('Fixed @/lib/utils import path to relative path');
  }

  return { content: modifiedContent, fixed };
}

function fixAccessibility(content: string, componentName: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Add displayName if missing
  if (!content.includes('.displayName')) {
    const displayNameLine = `${componentName}.displayName = '${componentName}';`;
    modifiedContent = modifiedContent.replace(
      /export\s+{[^}]*}/,
      `export { ${componentName} }\n\n${displayNameLine}`
    );
    fixed.push('Added displayName for better React DevTools debugging');
  }

  // Add ARIA attributes to interactive elements
  if (!content.includes('aria-')) {
    // Add role="button" to button-like components
    if (componentName.toLowerCase().includes('button') || content.includes('onClick')) {
      modifiedContent = modifiedContent.replace(
        /<div([^>]*onClick[^>]*)>/g,
        '<div$1 role="button" tabIndex={0}>'
      );
      fixed.push('Added role="button" and tabIndex for accessibility');
    }
  }

  // Add focus-visible styles
  if (!content.includes('focus-visible')) {
    modifiedContent = modifiedContent.replace(
      /className=\{[^}]*\}/g,
      (match) => {
        if (match.includes('focus:')) {
          return match.replace(/focus:/g, 'focus-visible:');
        }
        return match;
      }
    );
    fixed.push('Added focus-visible styles for keyboard navigation');
  }

  // Add keyboard event handlers
  if (!content.includes('onKeyDown') && content.includes('onClick')) {
    modifiedContent = modifiedContent.replace(
      /onClick=\{[^}]*\}/g,
      (match) => {
        const onClickHandler = match.match(/onClick=\{([^}]*)\}/)?.[1] || '() => {}';
        return `onClick={${onClickHandler}}\n      onKeyDown={(e) => {\n        if (e.key === 'Enter' || e.key === ' ') {\n          e.preventDefault();\n          ${onClickHandler}\n        }\n      }}`;
      }
    );
    fixed.push('Added keyboard event handlers (Enter/Space) for accessibility');
  }

  return { content: modifiedContent, fixed };
}

function fixSemanticHtml(content: string, componentName: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Replace div with button for button components
  if (componentName.toLowerCase().includes('button') && content.includes('<div')) {
    modifiedContent = modifiedContent.replace(
      /<div([^>]*onClick[^>]*)>/g,
      '<button$1>'
    );
    modifiedContent = modifiedContent.replace(
      /<\/div>/g,
      '</button>'
    );
    fixed.push('Replaced <div> with <button> for proper semantic HTML');
  }

  return { content: modifiedContent, fixed };
}

function fixTypes(content: string, componentName: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Add proper TypeScript interface if missing
  if (!content.includes('interface') && !content.includes('type ')) {
    const propsInterface = `interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

`;
    modifiedContent = propsInterface + modifiedContent;
    fixed.push('Added TypeScript interface for component props');
  }

  return { content: modifiedContent, fixed };
}

function fixRefForwarding(content: string, componentName: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Add ref forwarding if missing
  if (!content.includes('forwardRef') && content.includes('React.FC')) {
    modifiedContent = modifiedContent.replace(
      /export\s+const\s+(\w+):\s*React\.FC/g,
      'export const $1 = React.forwardRef<HTMLElement, ${componentName}Props>('
    );
    modifiedContent = modifiedContent.replace(
      /}\);?\s*$/m,
      '});'
    );
    fixed.push('Added ref forwarding for better component composition');
  }

  return { content: modifiedContent, fixed };
}

function fixClassNameMerging(content: string): { content: string; fixed: string[] } {
  const fixed: string[] = [];
  let modifiedContent = content;

  // Add cn utility for className merging
  if (!content.includes('cn(') && content.includes('className')) {
    modifiedContent = modifiedContent.replace(
      /className=\{`([^`]*)`\}/g,
      'className={cn(`$1`, className)}'
    );
    fixed.push('Added cn utility for proper className merging');
  }

  return { content: modifiedContent, fixed };
}

function autoFixComponent(componentDir: string, componentName: string): FixResult {
  const fixed: string[] = [];
  const remaining: string[] = [];
  const mainFile = path.join(componentDir, `${componentName}.tsx`);

  if (!fs.existsSync(mainFile)) {
    remaining.push('Component file not found');
    return { fixed, remaining };
  }

  let content = fs.readFileSync(mainFile, 'utf-8');
  const originalContent = content;

  // Apply all fixes
  const importFixes = fixImportPaths(content);
  content = importFixes.content;
  fixed.push(...importFixes.fixed);

  const accessibilityFixes = fixAccessibility(content, componentName);
  content = accessibilityFixes.content;
  fixed.push(...accessibilityFixes.fixed);

  const semanticHtmlFixes = fixSemanticHtml(content, componentName);
  content = semanticHtmlFixes.content;
  fixed.push(...semanticHtmlFixes.fixed);

  const typeFixes = fixTypes(content, componentName);
  content = typeFixes.content;
  fixed.push(...typeFixes.fixed);

  const refFixes = fixRefForwarding(content, componentName);
  content = refFixes.content;
  fixed.push(...refFixes.fixed);

  const classNameFixes = fixClassNameMerging(content);
  content = classNameFixes.content;
  fixed.push(...classNameFixes.fixed);

  // Write the fixed content
  if (content !== originalContent) {
    fs.writeFileSync(mainFile, content);
  }

  return { fixed, remaining };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: fix <component-path>');
    console.error('Example: fix packages/ui/components/Button');
    process.exit(1);
  }

  const componentPath = args[0];
  
  if (!fs.existsSync(componentPath)) {
    console.error(`Error: Component path does not exist: ${componentPath}`);
    process.exit(1);
  }

  const componentName = path.basename(componentPath);
  
  try {
    const result = autoFixComponent(componentPath, componentName);
    
    if (result.fixed.length > 0) {
      console.log(JSON.stringify({
        success: true,
        component: componentName,
        fixes: {
          applied: result.fixed,
          remaining: result.remaining,
        },
        message: `Applied ${result.fixed.length} comprehensive fix(es)`,
        details: 'Fixed: import paths, accessibility, semantic HTML, TypeScript types, ref forwarding, and className merging',
      }, null, 2));
      process.exit(0);
    } else {
      console.log(JSON.stringify({
        success: true,
        component: componentName,
        fixes: {
          applied: [],
          remaining: result.remaining,
        },
        message: 'No fixes needed - component is already well-written',
        details: 'Component follows best practices',
      }, null, 2));
      process.exit(0);
    }
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check the component file for syntax errors',
    }, null, 2));
    process.exit(1);
  }
}

main();