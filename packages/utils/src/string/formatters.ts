import { REGEX_PATTERNS } from '../constants/common';

// ============================================
// Formatters
// ============================================

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function titleCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

export function truncateMiddle(str: string, maxLength: number, separator = '...'): string {
  if (!str || str.length <= maxLength) return str;
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return str.slice(0, frontChars) + separator + str.slice(-backChars);
}

export function wrapText(str: string, maxWidth: number): string[] {
  const words = str.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine && (currentLine + ' ' + word).length > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function formatInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('')
    .slice(0, 2);
}

export function maskString(
  str: string,
  options: { showFirst?: number; showLast?: number; maskChar?: string } = {}
): string {
  const { showFirst = 0, showLast = 4, maskChar = '*' } = options;
  if (str.length <= showFirst + showLast) return str;
  const masked = maskChar.repeat(str.length - showFirst - showLast);
  return str.slice(0, showFirst) + masked + str.slice(-showLast);
}
