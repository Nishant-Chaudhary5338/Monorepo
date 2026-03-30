import { REGEX_PATTERNS } from '../constants/common';

// ============================================
// Trimmers & Sanitizers
// ============================================

export function trimWhitespace(str: string): string {
  return str.trim().replace(REGEX_PATTERNS.WHITESPACE, ' ');
}

export function stripHtml(str: string): string {
  return str.replace(REGEX_PATTERNS.HTML_TAGS, '').replace(/&nbsp;/g, ' ').trim();
}

export function stripMarkdown(str: string): string {
  return str
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s/gm, '')
    .replace(/^>\s/gm, '')
    .trim();
}

export function normalizeWhitespace(str: string): string {
  return str.replace(REGEX_PATTERNS.WHITESPACE, ' ').trim();
}

export function removeNonAlphanumeric(str: string): string {
  return str.replace(REGEX_PATTERNS.SPECIAL_CHARS, '');
}

export function removeEmojis(str: string): string {
  return str.replace(/\p{Extended_Pictographic}/gu, '').replace(/\uFE0F/g, '');
}

export function removeDuplicates(str: string): string {
  return [...new Set(str)].join('');
}

export function reverseString(str: string): string {
  return [...str].reverse().join('');
}
