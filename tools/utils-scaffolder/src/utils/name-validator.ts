export interface ValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateModuleName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Module name cannot be empty' };
  }

  if (name.includes('-')) {
    const suggestion = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return {
      valid: false,
      suggestion,
      error: `Module name "${name}" contains hyphens. Use "${suggestion}" instead.`,
    };
  }

  if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
    return {
      valid: false,
      error: `Module name "${name}" must start with lowercase letter and contain only alphanumeric characters`,
    };
  }

  return { valid: true };
}

export function validateFunctionName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Function name cannot be empty' };
  }

  if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
    return {
      valid: false,
      error: `Function name "${name}" must be camelCase (start with lowercase letter, alphanumeric only)`,
    };
  }

  return { valid: true };
}

export function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const ALL_MODULES = [
  'api', 'validation', 'search', 'pagination', 'auth', 'hooks',
  'performance', 'media', 'string', 'array', 'object', 'date',
  'number', 'storage', 'url', 'clipboard', 'logger', 'error',
  'cache', 'types', 'constants',
] as const;

export type ModuleName = typeof ALL_MODULES[number];