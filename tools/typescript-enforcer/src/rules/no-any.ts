// ============================================================================
// RULE: no-any
// Detect all 'any' type usages and suggest proper types
// ============================================================================

import type { Violation, RuleCheckResult } from '../types.js';

export function checkNoAny(source: string, filePath: string): RuleCheckResult {
  const violations: Violation[] = [];
  const lines = source.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments and strings
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

    // Pattern 1: `: any` type annotation
    const anyTypeRegex = /:\s*any\b/g;
    let match;
    while ((match = anyTypeRegex.exec(line)) !== null) {
      const col = match.index;

      // Determine context for better suggestion
      const beforeColon = line.slice(0, col).trim();
      const suggestion = suggestTypeForAny(beforeColon, line, lines, i);
      const fix = generateFix(beforeColon, suggestion);

      violations.push({
        rule: 'no-any',
        severity: 'error',
        line: i + 1,
        column: col + 1,
        current: match[0].trim(),
        suggestion,
        fix,
        why: "Using 'any' disables TypeScript's type checking entirely. This defeats the purpose of TypeScript and allows bugs to pass silently.",
      });
    }

    // Pattern 2: `as any` type assertion
    const asAnyRegex = /\bas\s+any\b/g;
    while ((match = asAnyRegex.exec(line)) !== null) {
      violations.push({
        rule: 'no-any',
        severity: 'error',
        line: i + 1,
        column: match.index + 1,
        current: 'as any',
        suggestion: 'Use a proper type assertion or type guard instead',
        fix: '// Replace with proper type: as SpecificType, or use type guard',
        why: "'as any' is a type safety escape hatch that hides potential runtime errors.",
      });
    }

    // Pattern 3: `Array<any>` or `any[]`
    const anyArrayRegex = /(?:unknown[]|any\[\])/g;
    while ((match = anyArrayRegex.exec(line)) !== null) {
      violations.push({
        rule: 'no-any',
        severity: 'error',
        line: i + 1,
        column: match.index + 1,
        current: match[0],
        suggestion: 'Use Array<SpecificType> or SpecificType[]',
        fix: '// Replace with proper type: unknown[] for truly unknown, or SpecificType[]',
        why: "unknown[] allows any value in the array, losing all type safety for collection operations.",
      });
    }

    // Pattern 4: `Promise<any>`
    const promiseAnyRegex = /Promise<unknown>/g;
    while ((match = promiseAnyRegex.exec(line)) !== null) {
      violations.push({
        rule: 'no-any',
        severity: 'error',
        line: i + 1,
        column: match.index + 1,
        current: 'Promise<unknown>',
        suggestion: 'Use Promise<SpecificType> or Promise<unknown>',
        fix: '// Replace with Promise<unknown> if truly unknown, or specific type',
        why: "Promise<unknown> loses type information for async operations. Use Promise<unknown> as a safer alternative.",
      });
    }

    // Pattern 5: `Record<string, any>` - common but still bad
    const recordAnyRegex = /Record<string,\s*any>/g;
    while ((match = recordAnyRegex.exec(line)) !== null) {
      violations.push({
        rule: 'no-any',
        severity: 'warning',
        line: i + 1,
        column: match.index + 1,
        current: 'Record<string, unknown>',
        suggestion: 'Use Record<string, unknown> or define a specific interface',
        fix: '// Replace with Record<string, unknown> or a typed interface',
        why: "Record<string, unknown> allows any value type. Use unknown for safer type narrowing, or define specific types.",
      });
    }

    // Pattern 6: Generic any: `<any>` or `<any,`
    const genericAnyRegex = /<any[,\s>]/g;
    while ((match = genericAnyRegex.exec(line)) !== null) {
      violations.push({
        rule: 'no-any',
        severity: 'error',
        line: i + 1,
        column: match.index + 1,
        current: match[0].trim(),
        suggestion: 'Use unknown or a specific type parameter',
        fix: '// Replace <any> with <unknown> or a specific type',
        why: "Generic 'any' disables type checking for the generic parameter. Use unknown as a safer alternative.",
      });
    }
  }

  return { violations };
}

function suggestTypeForAny(beforeColon: string, fullLine: string, allLines: string[], lineIdx: number): string {
  const context = beforeColon.toLowerCase();

  // Function parameter patterns
  if (context.includes('args') || context.includes('params') || context.includes('options')) {
    return 'Define a specific interface for the parameters';
  }
  if (context.includes('error') || context.includes('err')) {
    return 'Error | unknown';
  }
  if (context.includes('event') || context.includes('e)')) {
    return 'Event | React.SyntheticEvent';
  }
  if (context.includes('callback') || context.includes('handler') || context.includes('fn')) {
    return '(...args: unknown[]) => unknown';
  }
  if (context.includes('result') || context.includes('response') || context.includes('data')) {
    return 'Define a specific type for the response';
  }
  if (context.includes('config') || context.includes('options')) {
    return 'Define a specific config interface';
  }
  if (context.includes('props')) {
    return 'Define a Props interface';
  }
  if (context.includes('ref')) {
    return 'React.RefObject<SpecificElement>';
  }
  if (context.includes('children')) {
    return 'React.ReactNode';
  }

  // Variable patterns
  if (context.includes('const ') || context.includes('let ')) {
    return 'Infer from assignment or define explicit type';
  }

  // Return type patterns
  if (fullLine.includes('): unknown') || fullLine.includes('):  any')) {
    return 'Define specific return type';
  }

  return 'unknown (safer than any, requires type narrowing)';
}

function generateFix(beforeColon: string, suggestion: string): string {
  if (suggestion.includes('Define') || suggestion.includes('Infer')) {
    return `// ${suggestion}`;
  }
  return `// Replace 'any' with '${suggestion}'`;
}