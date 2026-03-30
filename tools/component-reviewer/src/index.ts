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

// ============================================================================
// TYPES
// ============================================================================

interface ReviewIssue {
  id: string;
  category: IssueCategory;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  code?: string;
  message: string;
  suggestion: string;
  fixable: boolean;
  fixType?: 'replace' | 'add' | 'remove' | 'refactor';
  fix?: Record<string, unknown>;
  docs?: string;
  wcag?: string;
}

type IssueCategory =
  | 'type-safety'
  | 'react-patterns'
  | 'accessibility'
  | 'performance'
  | 'code-quality'
  | 'security'
  | 'styling'
  | 'testing';

interface ReviewMetrics {
  linesOfCode: number;
  complexity: number;
  maintainability: number;
  dependencies: {
    internal: number;
    external: number;
    unused: string[];
  };
}

interface ReviewPatterns {
  detected: string[];
  suggested: string[];
}

interface ReviewSummary {
  component: string;
  file: string;
  linesOfCode: number;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  estimatedFixTime: string;
  categories: Record<IssueCategory, number>;
}

interface ReviewResult {
  success: boolean;
  summary: ReviewSummary;
  issues: ReviewIssue[];
  metrics: ReviewMetrics;
  patterns: ReviewPatterns;
  quickFixes: Array<{
    id: string;
    description: string;
    issueIds: string[];
    automated: boolean;
  }>;
  typescriptErrors: string[];
  testResults: {
    passed: number;
    failed: number;
    errors: string[];
  };
}

// ============================================================================
// FILE ANALYSIS HELPERS
// ============================================================================

function readFileContent(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function getLines(content: string): string[] {
  return content.split('\n');
}

function findComponentFile(componentDir: string, componentName: string): string | null {
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  for (const ext of extensions) {
    const filePath = path.join(componentDir, `${componentName}${ext}`);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function findTestFile(componentDir: string, componentName: string): string | null {
  const patterns = [
    `${componentName}.test.tsx`,
    `${componentName}.test.ts`,
    `${componentName}.test.js`,
    `${componentName}.spec.tsx`,
    `${componentName}.spec.ts`,
    `${componentName}.spec.js`,
    `${componentName}.stories.tsx`,
  ];
  for (const pattern of patterns) {
    const filePath = path.join(componentDir, pattern);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function countLines(content: string): number {
  return content.split('\n').length;
}

// ============================================================================
// TYPESCRIPT ANALYSIS
// ============================================================================

function analyzeTypeScript(content: string, lines: string[]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for 'any' type usage
    const anyMatches = line.match(/:\s*any\b|<any>|\bas\s+any\b/g);
    if (anyMatches) {
      issues.push({
        id: `TS-${String(++issueCounter).padStart(3, '0')}`,
        category: 'type-safety',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: "Avoid using 'any' type - it bypasses TypeScript's type checking",
        suggestion: 'Use specific types, unknown, or create a proper interface',
        fixable: true,
        fixType: 'replace',
        docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
      });
    }

    // Check for type assertions
    if (line.match(/\bas\s+[A-Z]/g) && !line.includes('as const')) {
      issues.push({
        id: `TS-${String(++issueCounter).padStart(3, '0')}`,
        category: 'type-safety',
        severity: 'info',
        line: lineNum,
        code: line.trim(),
        message: 'Type assertion detected - prefer type guards or proper typing',
        suggestion: 'Use type guards (typeof, instanceof) or proper type definitions',
        fixable: false,
      });
    }

    // Check for missing return types on functions
    if (line.match(/(?:const|let|function)\s+\w+\s*=?\s*(?:\([^)]*\)|\([^)]*\)\s*=>)/)) {
      const hasReturnType = line.match(/\)\s*:\s*\w+/);
      const isExported = content.includes(`export`);
      const isComponent = line.match(/[A-Z]\w*\s*=/);
      
      if (!hasReturnType && (isExported || isComponent)) {
        issues.push({
          id: `TS-${String(++issueCounter).padStart(3, '0')}`,
          category: 'type-safety',
          severity: 'info',
          line: lineNum,
          code: line.trim(),
          message: 'Consider adding explicit return type for better documentation',
          suggestion: 'Add return type annotation after function parameters',
          fixable: false,
        });
      }
    }

    // Check for non-null assertions
    if (line.includes('!.')) {
      issues.push({
        id: `TS-${String(++issueCounter).padStart(3, '0')}`,
        category: 'type-safety',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Non-null assertion operator (!) can hide runtime errors',
        suggestion: 'Use optional chaining (?.) with nullish coalescing (??) instead',
        fixable: true,
        fixType: 'replace',
      });
    }
  });

  return issues;
}

// ============================================================================
// REACT PATTERNS ANALYSIS
// ============================================================================

function analyzeReactPatterns(content: string, lines: string[], componentName: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  // Check for missing displayName
  if (!content.includes('displayName') && !content.includes('forwardRef')) {
    issues.push({
      id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
      category: 'react-patterns',
      severity: 'info',
      message: 'Missing displayName for better React DevTools debugging',
      suggestion: `Add: ${componentName}.displayName = '${componentName}';`,
      fixable: true,
      fixType: 'add',
    });
  }

  // Check for inline functions in JSX (performance)
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Inline arrow functions in event handlers
    if (line.match(/(?:onClick|onChange|onSubmit|onFocus|onBlur)=\{.*=>/)) {
      issues.push({
        id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
        category: 'performance',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Inline arrow function creates new reference on each render',
        suggestion: 'Extract to useCallback or define outside JSX',
        fixable: true,
        fixType: 'refactor',
      });
    }

    // Object literals in JSX
    if (line.match(/(?:style|className)=\{\{[^}]+\}\}/)) {
      issues.push({
        id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
        category: 'performance',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Inline object literal creates new reference on each render',
        suggestion: 'Extract to a constant outside the component or useMemo',
        fixable: true,
        fixType: 'refactor',
      });
    }
  });

  // Check for useState with complex initial state that could use lazy initialization
  const useStateComplexPattern = /useState\((?:\{[^}]+\}|\[[^\]]+\]|JSON\.|localStorage)/g;
  const complexStateMatches = content.match(useStateComplexPattern);
  if (complexStateMatches) {
    issues.push({
      id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
      category: 'performance',
      severity: 'info',
      message: 'Complex initial state should use lazy initialization',
      suggestion: 'Use useState(() => expensiveComputation()) for expensive initial values',
      fixable: true,
      fixType: 'refactor',
    });
  }

  // Check for useEffect without cleanup
  const useEffectCount = (content.match(/useEffect\(/g) || []).length;
  const cleanupCount = (content.match(/return\s+\(\)\s*=>|return\s+function/g) || []).length;
  if (useEffectCount > cleanupCount && content.includes('addEventListener')) {
    issues.push({
      id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
      category: 'react-patterns',
      severity: 'warning',
      message: 'useEffect with subscriptions/event listeners should have cleanup',
      suggestion: 'Return a cleanup function from useEffect to prevent memory leaks',
      fixable: true,
      fixType: 'add',
    });
  }

  // Check for missing key props in map
  const mapWithoutKeyPattern = /\.map\([^)]*\)\s*=>\s*(?!.*key=)/g;
  lines.forEach((line, index) => {
    if (line.includes('.map(') && !content.substring(content.indexOf('.map(')).includes('key=')) {
      issues.push({
        id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
        category: 'react-patterns',
        severity: 'error',
        line: index + 1,
        code: line.trim(),
        message: 'Missing key prop in list rendering',
        suggestion: 'Add unique key prop to each element in the map callback',
        fixable: true,
        fixType: 'add',
      });
    }
  });

  // Check for prop drilling (more than 2 levels)
  const propDrillingPattern = /(\w+):\s*(\w+Props)/g;
  let propDrillCount = 0;
  let match;
  while ((match = propDrillingPattern.exec(content)) !== null) {
    propDrillCount++;
  }
  if (propDrillCount > 2) {
    issues.push({
      id: `REACT-${String(++issueCounter).padStart(3, '0')}`,
      category: 'react-patterns',
      severity: 'info',
      message: 'Possible prop drilling detected - consider using Context or composition',
      suggestion: 'Use React.createContext or component composition to reduce prop drilling',
      fixable: false,
    });
  }

  return issues;
}

// ============================================================================
// ACCESSIBILITY ANALYSIS
// ============================================================================

function analyzeAccessibility(content: string, lines: string[], componentName: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for images without alt
    if (line.match(/<img\s/) && !line.includes('alt=')) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: 'Image missing alt attribute',
        suggestion: 'Add alt attribute describing the image or alt="" for decorative images',
        fixable: true,
        fixType: 'add',
        wcag: '1.1.1',
      });
    }

    // Check for form inputs without labels
    if (line.match(/<input\s/) && !line.includes('aria-label') && !line.includes('aria-labelledby')) {
      const hasId = line.match(/id=["'](\w+)["']/);
      if (hasId) {
        const labelPattern = new RegExp(`htmlFor=["']${hasId[1]}["']|for=["']${hasId[1]}["']`);
        if (!content.match(labelPattern)) {
          issues.push({
            id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
            category: 'accessibility',
            severity: 'error',
            line: lineNum,
            code: line.trim(),
            message: 'Form input missing associated label',
            suggestion: 'Add <label htmlFor="..."> or aria-label attribute',
            fixable: true,
            fixType: 'add',
            wcag: '1.3.1',
          });
        }
      } else {
        issues.push({
          id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
          category: 'accessibility',
          severity: 'warning',
          line: lineNum,
          code: line.trim(),
          message: 'Form input should have id with associated label or aria-label',
          suggestion: 'Add id attribute and matching <label htmlFor>, or use aria-label',
          fixable: true,
          fixType: 'add',
          wcag: '1.3.1',
        });
      }
    }

    // Check for clickable divs without role
    if (line.match(/<div[^>]*onClick/)) {
      if (!line.includes('role=') && !line.includes('tabIndex')) {
        issues.push({
          id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
          category: 'accessibility',
          severity: 'error',
          line: lineNum,
          code: line.trim(),
          message: 'Clickable div missing role and keyboard accessibility',
          suggestion: 'Add role="button" tabIndex={0} and onKeyDown handler, or use <button>',
          fixable: true,
          fixType: 'add',
          wcag: '4.1.2',
        });
      }
    }

    // Check for missing aria-label on icon buttons
    if (line.match(/<(?:button|a)[^>]*>.*<(?:svg|Icon|icon).*<\/(?:button|a)>/s) && 
        !line.includes('aria-label')) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: 'Icon button missing accessible label',
        suggestion: 'Add aria-label describing the button action',
        fixable: true,
        fixType: 'add',
        wcag: '4.1.2',
      });
    }

    // Check for positive tabIndex
    if (line.match(/tabIndex=["'][1-9]/)) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Avoid positive tabIndex values - they disrupt natural tab order',
        suggestion: 'Use tabIndex={0} for focusable elements or tabIndex={-1} for programmatic focus',
        fixable: true,
        fixType: 'replace',
        wcag: '2.4.3',
      });
    }

    // Check for missing heading hierarchy
    const headingMatch = line.match(/<h([1-6])/);
    if (headingMatch) {
      const currentLevel = parseInt(headingMatch[1]);
      const prevHeadingMatch = content.substring(0, content.indexOf(line)).match(/<h([1-6])/g);
      if (prevHeadingMatch) {
        const lastHeading = prevHeadingMatch[prevHeadingMatch.length - 1];
        const lastLevel = parseInt(lastHeading.match(/h([1-6])/)?.[1] || '1');
        if (currentLevel > lastLevel + 1) {
          issues.push({
            id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
            category: 'accessibility',
            severity: 'warning',
            line: lineNum,
            code: line.trim(),
            message: `Heading level skipped from h${lastLevel} to h${currentLevel}`,
            suggestion: `Use sequential heading levels (h${lastLevel + 1}) for proper document structure`,
            fixable: true,
            fixType: 'replace',
            wcag: '1.3.1',
          });
        }
      }
    }

    // Check for links without href
    if (line.match(/<a\s[^>]*(?!href)/) || line.match(/<a\s>/)) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: 'Link element missing href attribute',
        suggestion: 'Add href attribute or use <button> for actions',
        fixable: true,
        fixType: 'add',
        wcag: '2.1.1',
      });
    }

    // Check for autoplay media
    if (line.match(/<(?:video|audio)[^>]*autoPlay/)) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Autoplay media can be disruptive to users',
        suggestion: 'Remove autoplay or add controls and muted attribute',
        fixable: true,
        fixType: 'replace',
        wcag: '1.4.2',
      });
    }
  });

  // Check for missing focus styles
  if (content.includes('onClick') || content.includes('onKeyDown')) {
    if (!content.includes('focus') && !content.includes('focus-visible') && !content.includes('outline')) {
      issues.push({
        id: `A11Y-${String(++issueCounter).padStart(3, '0')}`,
        category: 'accessibility',
        severity: 'warning',
        message: 'Interactive elements should have visible focus styles',
        suggestion: 'Add :focus or :focus-visible styles for keyboard navigation',
        fixable: true,
        fixType: 'add',
        wcag: '2.4.7',
      });
    }
  }

  return issues;
}

// ============================================================================
// CODE QUALITY ANALYSIS
// ============================================================================

function analyzeCodeQuality(content: string, lines: string[], componentName: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  // Check for invalid component naming (hyphens in identifiers)
  if (componentName.includes('-')) {
    issues.push({
      id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
      category: 'code-quality',
      severity: 'error',
      message: `Component name "${componentName}" contains hyphens which are invalid JavaScript identifiers`,
      suggestion: `Rename to "${componentName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}" (PascalCase without hyphens)`,
      fixable: false,
    });
  }

  // Check for hyphens in exported identifiers
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const exportMatch = line.match(/export\s+(?:interface|type|const|function|class)\s+([\w-]+)/);
    if (exportMatch && exportMatch[1].includes('-')) {
      issues.push({
        id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
        category: 'code-quality',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: `Exported identifier "${exportMatch[1]}" contains hyphens which are invalid in JavaScript/TypeScript`,
        suggestion: `Rename to PascalCase: "${exportMatch[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase())}"`,
        fixable: false,
      });
    }
  });

  // Check for long functions (more than 50 lines)
  let functionStart = -1;
  let braceCount = 0;
  lines.forEach((line, index) => {
    if (line.match(/(?:function|const\s+\w+\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z]+)\s*=>)/)) {
      functionStart = index;
      braceCount = 0;
    }
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
    
    if (functionStart !== -1 && braceCount === 0 && line.includes('}')) {
      const functionLength = index - functionStart;
      if (functionLength > 50) {
        issues.push({
          id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
          category: 'code-quality',
          severity: 'warning',
          line: functionStart + 1,
          endLine: index + 1,
          message: `Function is ${functionLength} lines long (max recommended: 50)`,
          suggestion: 'Break into smaller functions with single responsibility',
          fixable: false,
        });
      }
      functionStart = -1;
    }
  });

  // Check for TODO/FIXME/HACK comments
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const todoMatch = line.match(/\/\/\s*(TODO|FIXME|HACK|XXX):\s*(.+)/i);
    if (todoMatch) {
      issues.push({
        id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
        category: 'code-quality',
        severity: 'info',
        line: lineNum,
        code: line.trim(),
        message: `${todoMatch[1].toUpperCase()} comment found: ${todoMatch[2].trim()}`,
        suggestion: 'Address this item before production release',
        fixable: false,
      });
    }
  });

  // Check for console.log statements
  lines.forEach((line, index) => {
    if (line.match(/console\.(log|debug|info)\(/)) {
      issues.push({
        id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
        category: 'code-quality',
        severity: 'warning',
        line: index + 1,
        code: line.trim(),
        message: 'Console statement found - should be removed in production',
        suggestion: 'Remove console statement or use a proper logging library',
        fixable: true,
        fixType: 'remove',
      });
    }
  });

  // Check for unused imports (basic check)
  const importStatements = content.match(/import\s+{([^}]+)}\s+from/g);
  if (importStatements) {
    importStatements.forEach((importStmt) => {
      const imports = importStmt.match(/{([^}]+)}/)?.[1].split(',').map(s => s.trim()) || [];
      imports.forEach((imp) => {
        const cleanImport = imp.split(' as ')[0].trim();
        if (cleanImport && !content.includes(cleanImport.slice(0, -1)) && cleanImport !== 'React') {
          // Simple check - might have false positives
        }
      });
    });
  }

  // Check for component file size
  if (lines.length > 300) {
    issues.push({
      id: `QUAL-${String(++issueCounter).padStart(3, '0')}`,
      category: 'code-quality',
      severity: 'warning',
      message: `Component file is ${lines.length} lines (max recommended: 300)`,
      suggestion: 'Consider splitting into smaller components or extracting custom hooks',
      fixable: false,
    });
  }

  return issues;
}

// ============================================================================
// SECURITY ANALYSIS
// ============================================================================

function analyzeSecurity(content: string, lines: string[]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for dangerouslySetInnerHTML
    if (line.includes('dangerouslySetInnerHTML')) {
      issues.push({
        id: `SEC-${String(++issueCounter).padStart(3, '0')}`,
        category: 'security',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: 'dangerouslySetInnerHTML can introduce XSS vulnerabilities',
        suggestion: 'Sanitize HTML content or use a safe rendering method',
        fixable: false,
        docs: 'https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml',
      });
    }

    // Check for eval usage
    if (line.includes('eval(') || line.includes('new Function(')) {
      issues.push({
        id: `SEC-${String(++issueCounter).padStart(3, '0')}`,
        category: 'security',
        severity: 'error',
        line: lineNum,
        code: line.trim(),
        message: 'eval() or new Function() usage is a security risk',
        suggestion: 'Avoid dynamic code execution - use safe alternatives',
        fixable: false,
      });
    }

    // Check for innerHTML
    if (line.includes('.innerHTML')) {
      issues.push({
        id: `SEC-${String(++issueCounter).padStart(3, '0')}`,
        category: 'security',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: 'Direct innerHTML manipulation can lead to XSS',
        suggestion: 'Use React\'s declarative rendering instead',
        fixable: true,
        fixType: 'refactor',
      });
    }

    // Check for hardcoded secrets patterns
    if (line.match(/(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']+["']/i)) {
      issues.push({
        id: `SEC-${String(++issueCounter).padStart(3, '0')}`,
        category: 'security',
        severity: 'error',
        line: lineNum,
        code: line.replace(/["'][^"']+["']/, '"***"'),
        message: 'Possible hardcoded secret detected',
        suggestion: 'Use environment variables for sensitive values',
        fixable: true,
        fixType: 'refactor',
      });
    }
  });

  return issues;
}

// ============================================================================
// STYLING ANALYSIS
// ============================================================================

function analyzeStyling(content: string, lines: string[]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for hardcoded colors
    const colorPattern = /(?:background|color|border|bg)[^=]*=["'](?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)/g;
    if (line.match(colorPattern)) {
      issues.push({
        id: `STYLE-${String(++issueCounter).padStart(3, '0')}`,
        category: 'styling',
        severity: 'info',
        line: lineNum,
        code: line.trim(),
        message: 'Hardcoded color value detected',
        suggestion: 'Use design tokens or Tailwind color classes for consistency',
        fixable: true,
        fixType: 'replace',
      });
    }

    // Check for inline styles
    if (line.match(/style=\{\{[^}]+\}\}/)) {
      issues.push({
        id: `STYLE-${String(++issueCounter).padStart(3, '0')}`,
        category: 'styling',
        severity: 'info',
        line: lineNum,
        code: line.trim(),
        message: 'Inline style detected',
        suggestion: 'Consider using Tailwind classes or CSS modules for better maintainability',
        fixable: false,
      });
    }

    // Check for !important in CSS
    if (line.includes('!important')) {
      issues.push({
        id: `STYLE-${String(++issueCounter).padStart(3, '0')}`,
        category: 'styling',
        severity: 'warning',
        line: lineNum,
        code: line.trim(),
        message: '!important usage indicates specificity issues',
        suggestion: 'Restructure CSS to avoid !important by using proper specificity',
        fixable: true,
        fixType: 'refactor',
      });
    }
  });

  return issues;
}

// ============================================================================
// TESTING ANALYSIS
// ============================================================================

function analyzeTesting(testContent: string | null, componentName: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let issueCounter = 0;

  if (!testContent) {
    issues.push({
      id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
      category: 'testing',
      severity: 'warning',
      message: 'No test file found for this component',
      suggestion: `Create ${componentName}.test.tsx with unit tests`,
      fixable: false,
    });
    return issues;
  }

  // Check for accessibility tests
  if (!testContent.includes('aria') && !testContent.includes('role') && !testContent.includes('accessible')) {
    issues.push({
      id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
      category: 'testing',
      severity: 'info',
      message: 'No accessibility tests found',
      suggestion: 'Add tests for ARIA attributes and screen reader compatibility',
      fixable: false,
    });
  }

  // Check for error state tests
  if (!testContent.includes('error') && !testContent.includes('Error')) {
    issues.push({
      id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
      category: 'testing',
      severity: 'info',
      message: 'No error state tests found',
      suggestion: 'Add tests for error handling and edge cases',
      fixable: false,
    });
  }

  // Check for loading state tests
  if (testContent.includes('loading') || testContent.includes('isLoading')) {
    if (!testContent.includes('loading') && !testContent.includes('spinner')) {
      issues.push({
        id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
        category: 'testing',
        severity: 'info',
        message: 'Component has loading state but no loading tests',
        suggestion: 'Add tests for loading indicators and states',
        fixable: false,
      });
    }
  }

  // Check for interaction tests
  if (!testContent.includes('fireEvent') && !testContent.includes('userEvent')) {
    issues.push({
      id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
      category: 'testing',
      severity: 'info',
      message: 'No user interaction tests found',
      suggestion: 'Add tests for click, input, and keyboard interactions',
      fixable: false,
    });
  }

  // Check for snapshot tests (discouraged for dynamic components)
  if (testContent.includes('toMatchSnapshot')) {
    issues.push({
      id: `TEST-${String(++issueCounter).padStart(3, '0')}`,
      category: 'testing',
      severity: 'info',
      message: 'Snapshot test detected - consider behavioral tests instead',
      suggestion: 'Prefer testing behavior and user interactions over snapshots',
      fixable: false,
    });
  }

  return issues;
}

// ============================================================================
// METRICS CALCULATION
// ============================================================================

function calculateMetrics(content: string, issues: ReviewIssue[]): ReviewMetrics {
  const lines = content.split('\n');
  
  // Simple cyclomatic complexity (count decision points)
  const decisionPatterns = [
    /\bif\s*\(/g,
    /\belse\s+if\b/g,
    /\bfor\s*\(/g,
    /\bwhile\s*\(/g,
    /\b\?\s*[^:]+\s*:/g, // ternary
    /\b&&\b/g,
    /\b\|\|\b/g,
    /\?.*\./g, // optional chaining
  ];
  
  let complexity = 1;
  decisionPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) complexity += matches.length;
  });

  // Calculate maintainability index (simplified)
  const maintainability = Math.max(0, Math.min(100, 
    100 - (complexity * 2) - (issues.length * 3) - (lines.length > 200 ? 10 : 0)
  ));

  // Count imports
  const internalImports = (content.match(/from\s+['"]\.\//g) || []).length;
  const externalImports = (content.match(/from\s+['"][^./]/g) || []).length;

  return {
    linesOfCode: lines.filter(l => l.trim().length > 0).length,
    complexity,
    maintainability,
    dependencies: {
      internal: internalImports,
      external: externalImports,
      unused: [], // Would need more sophisticated analysis
    },
  };
}

// ============================================================================
// PATTERN DETECTION
// ============================================================================

function detectPatterns(content: string): ReviewPatterns {
  const detected: string[] = [];
  const suggested: string[] = [];

  // Detect patterns
  if (content.includes('useState')) detected.push('state-management');
  if (content.includes('useEffect')) detected.push('side-effects');
  if (content.includes('useContext')) detected.push('context-consumer');
  if (content.includes('createContext')) detected.push('context-provider');
  if (content.includes('forwardRef')) detected.push('ref-forwarding');
  if (content.includes('useMemo')) detected.push('memoization');
  if (content.includes('useCallback')) detected.push('callback-memoization');
  if (content.includes('React.memo')) detected.push('component-memoization');
  if (content.includes('children')) detected.push('composition');
  if (content.match(/render\w*=\{/)) detected.push('render-prop');
  if (content.includes('useReducer')) detected.push('reducer-pattern');

  // Suggest patterns
  if (content.includes('useState') && content.includes('useEffect') && !content.includes('useReducer')) {
    suggested.push('custom-hook');
  }
  if (content.includes('props.') && (content.match(/props\.\w+/g)?.length ?? 0) > 5) {
    suggested.push('destructuring');
  }
  if (detected.includes('state-management') && !detected.includes('context-consumer')) {
    suggested.push('context');
  }

  return { detected, suggested };
}

// ============================================================================
// GRADE CALCULATION
// ============================================================================

function calculateGrade(score: number): ReviewSummary['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function calculateEstimatedFixTime(issues: ReviewIssue[]): string {
  let minutes = 0;
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'error': minutes += 5; break;
      case 'warning': minutes += 3; break;
      case 'info': minutes += 1; break;
    }
  });
  if (minutes < 60) return `${minutes}min`;
  return `${Math.round(minutes / 60)}h`;
}

// ============================================================================
// TYPESCRIPT & TEST EXECUTION
// ============================================================================

function runTypeScriptCheck(componentDir: string): { errors: string[]; passed: boolean } {
  try {
    const tsconfigPath = findTsconfig(componentDir);
    if (!tsconfigPath) {
      return { errors: ['No tsconfig.json found'], passed: true }; // Don't fail if no tsconfig
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
    return { errors: errors.slice(0, 10), passed: false }; // Limit to 10 errors
  }
}

function runTests(componentDir: string, componentName: string): { passed: number; failed: number; errors: string[] } {
  const testFile = findTestFile(componentDir, componentName);
  if (!testFile) {
    return { passed: 0, failed: 0, errors: ['No test file found'] };
  }

  try {
    const output = execSync(`npx vitest run ${testFile} --reporter=json 2>&1`, {
      cwd: path.join(componentDir, '..', '..'),
      stdio: 'pipe',
      timeout: 60000,
    }).toString();

    try {
      const result = JSON.parse(output);
      const testResult = result.testResults?.[0];
      return {
        passed: testResult?.numPassedTests || result.numPassedTests || 0,
        failed: testResult?.numFailedTests || result.numFailedTests || 0,
        errors: testResult?.message ? [testResult.message] : [],
      };
    } catch {
      if (output.includes('Tests') && output.includes('passed')) {
        return { passed: 1, failed: 0, errors: [] };
      }
      return { passed: 0, failed: 0, errors: ['Failed to parse test output'] };
    }
  } catch (error: unknown) {
    const err = error as { stdout?: { toString(): string }; stderr?: { toString(): string }; message: string };
    const output = err.stdout?.toString() || err.stderr?.toString() || err.message;
    if (output.includes('FAIL') || output.includes('failed')) {
      return { passed: 0, failed: 1, errors: [output.substring(0, 500)] };
    }
    return { passed: 0, failed: 0, errors: [output.substring(0, 500)] };
  }
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
// QUICK FIXES GENERATION
// ============================================================================

function generateQuickFixes(issues: ReviewIssue[]): Array<{
  id: string;
  description: string;
  issueIds: string[];
  automated: boolean;
}> {
  const quickFixes: Array<{
    id: string;
    description: string;
    issueIds: string[];
    automated: boolean;
  }> = [];

  // Group fixable issues by fix type
  const fixableIssues = issues.filter(i => i.fixable);
  
  const typeIssues = fixableIssues.filter(i => i.category === 'type-safety');
  if (typeIssues.length > 0) {
    quickFixes.push({
      id: 'fix-types',
      description: `Fix ${typeIssues.length} type safety issues`,
      issueIds: typeIssues.map(i => i.id),
      automated: true,
    });
  }

  const a11yIssues = fixableIssues.filter(i => i.category === 'accessibility');
  if (a11yIssues.length > 0) {
    quickFixes.push({
      id: 'fix-a11y',
      description: `Fix ${a11yIssues.length} accessibility issues`,
      issueIds: a11yIssues.map(i => i.id),
      automated: true,
    });
  }

  const perfIssues = fixableIssues.filter(i => i.category === 'performance');
  if (perfIssues.length > 0) {
    quickFixes.push({
      id: 'fix-perf',
      description: `Fix ${perfIssues.length} performance issues`,
      issueIds: perfIssues.map(i => i.id),
      automated: false,
    });
  }

  return quickFixes;
}

// ============================================================================
// MAIN SERVER CLASS
// ============================================================================

class ComponentReviewerServer extends McpServerBase {
  constructor() {
    super({ name: 'component-reviewer', version: '3.0.0' });
  }

  protected registerTools(): void {
    this.addTool(
      'review',
      'Comprehensive React component review - analyzes TypeScript, React patterns, accessibility, performance, security, code quality, and testing',
      {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the component file or directory to review',
          },
        },
        required: ['path'],
      },
      this.handleReview.bind(this)
    );
  }

  private async handleReview(args: unknown): Promise<ToolResult> {
    const { path: componentPath } = args as { path: string };
    
    try {
      const resolvedPath = path.resolve(componentPath);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Component path does not exist: ${componentPath}`);
      }

      // Handle both file paths and directory paths
      let componentDir: string;
      let componentName: string;
      
      const stat = fs.statSync(resolvedPath);
      if (stat.isFile()) {
        componentDir = path.dirname(resolvedPath);
        componentName = path.basename(resolvedPath, path.extname(resolvedPath));
      } else {
        componentDir = resolvedPath;
        componentName = path.basename(resolvedPath);
      }

      // Find component file
      const componentFile = findComponentFile(componentDir, componentName);
      if (!componentFile) {
        throw new Error(`Component file not found for: ${componentName}`);
      }

      // Read file content
      const content = readFileContent(componentFile);
      if (!content) {
        throw new Error(`Could not read component file: ${componentFile}`);
      }

      const lines = getLines(content);

      // Read test file if exists
      const testFile = findTestFile(componentDir, componentName);
      const testContent = testFile ? readFileContent(testFile) : null;

      // Run all analyses
      const typeScriptIssues = analyzeTypeScript(content, lines);
      const reactIssues = analyzeReactPatterns(content, lines, componentName);
      const accessibilityIssues = analyzeAccessibility(content, lines, componentName);
      const codeQualityIssues = analyzeCodeQuality(content, lines, componentName);
      const securityIssues = analyzeSecurity(content, lines);
      const stylingIssues = analyzeStyling(content, lines);
      const testingIssues = analyzeTesting(testContent, componentName);

      // Combine all issues
      const allIssues = [
        ...typeScriptIssues,
        ...reactIssues,
        ...accessibilityIssues,
        ...codeQualityIssues,
        ...securityIssues,
        ...stylingIssues,
        ...testingIssues,
      ];

      // Run TypeScript compiler check
      const tsResult = runTypeScriptCheck(componentDir);

      // Run tests
      const testResults = runTests(componentDir, componentName);

      // Calculate metrics
      const metrics = calculateMetrics(content, allIssues);

      // Detect patterns
      const patterns = detectPatterns(content);

      // Generate quick fixes
      const quickFixes = generateQuickFixes(allIssues);

      // Count issues by severity
      const criticalIssues = allIssues.filter(i => i.severity === 'error').length;
      const warningIssues = allIssues.filter(i => i.severity === 'warning').length;
      const infoIssues = allIssues.filter(i => i.severity === 'info').length;

      // Count issues by category
      const categories: Record<IssueCategory, number> = {
        'type-safety': 0,
        'react-patterns': 0,
        'accessibility': 0,
        'performance': 0,
        'code-quality': 0,
        'security': 0,
        'styling': 0,
        'testing': 0,
      };
      allIssues.forEach(issue => {
        categories[issue.category]++;
      });

      // Calculate overall score
      let score = 100;
      score -= criticalIssues * 10;
      score -= warningIssues * 5;
      score -= infoIssues * 1;
      score -= tsResult.passed ? 0 : 20;
      score -= testResults.failed * 10;
      score = Math.max(0, Math.min(100, score));

      // Build summary
      const summary: ReviewSummary = {
        component: componentName,
        file: path.relative(process.cwd(), componentFile),
        linesOfCode: metrics.linesOfCode,
        overallScore: score,
        grade: calculateGrade(score),
        totalIssues: allIssues.length,
        criticalIssues,
        warningIssues,
        infoIssues,
        estimatedFixTime: calculateEstimatedFixTime(allIssues),
        categories,
      };

      const result: ReviewResult = {
        success: true,
        summary,
        issues: allIssues,
        metrics,
        patterns,
        quickFixes,
        typescriptErrors: tsResult.errors,
        testResults,
      };

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: {
              code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
              message: error instanceof Error ? error.message : String(error),
              suggestion: 'Check input parameters and ensure the component path is valid.',
              timestamp: new Date().toISOString(),
            },
          }, null, 2),
        }],
        isError: true,
      };
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new ComponentReviewerServer().run().catch(console.error);