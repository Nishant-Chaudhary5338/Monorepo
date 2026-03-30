// ============================================================================
// CLIPBOARD MODULE GENERATOR
// ============================================================================

export function generateClipboardModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// CLIPBOARD MODULE - Clipboard read/write utilities
// ============================================================================

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise resolving to true if successful
 * @example await copyToClipboard('Hello World')
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return fallbackCopy(text);
  } catch {
    return false;
  }
}

/**
 * Fallback copy method for older browsers
 * @param text - Text to copy
 * @returns True if successful
 */
function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Reads text from clipboard
 * @returns Promise resolving to clipboard text or null
 * @example const text = await readClipboard()
 */
export async function readClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Copies an object as JSON to clipboard
 * @param data - Data to copy
 * @param pretty - Pretty print JSON (default: true)
 * @returns Promise resolving to true if successful
 * @example await copyAsJSON({ name: 'John' })
 */
export async function copyAsJSON(data: unknown, pretty = true): Promise<boolean> {
  const json = JSON.stringify(data, null, pretty ? 2 : undefined);
  return copyToClipboard(json);
}

/**
 * Copies text as markdown to clipboard
 * @param markdown - Markdown text
 * @returns Promise resolving to true if successful
 */
export async function copyAsMarkdown(markdown: string): Promise<boolean> {
  return copyToClipboard(markdown);
}

/**
 * Copies an HTML table to clipboard
 * @param headers - Table headers
 * @param rows - Table rows
 * @returns Promise resolving to true if successful
 * @example await copyAsTable(['Name', 'Age'], [['John', '30']])
 */
export async function copyAsTable(headers: string[], rows: string[][]): Promise<boolean> {
  const html = buildHTMLTable(headers, rows);
  try {
    const blob = new Blob([html], { type: 'text/html' });
    const text = headers.join('\\t') + '\\n' + rows.map((r) => r.join('\\t')).join('\\n');
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([text], { type: 'text/plain' }),
      }),
    ]);
    return true;
  } catch {
    return copyToClipboard(text);
  }
}

function buildHTMLTable(headers: string[], rows: string[][]): string {
  const thead = headers.map((h) => \`<th>\${escapeHtml(h)}</th>\`).join('');
  const tbody = rows.map((row) => \`<tr>\${row.map((cell) => \`<td>\${escapeHtml(cell)}</td>\`).join('')}</tr>\`).join('');
  return \`<table><thead><tr>\${thead}</tr></thead><tbody>\${tbody}</tbody></table>\`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

/**
 * Checks if clipboard API is available
 * @returns True if clipboard API is available
 * @example isClipboardAvailable() // true
 */
export function isClipboardAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}
`,
    'clipboard.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { isClipboardAvailable } from './index'

describe('Clipboard Module', () => {
  describe('isClipboardAvailable', () => {
    it('returns boolean', () => {
      expect(typeof isClipboardAvailable()).toBe('boolean')
    })
  })
})
`,
  };
}