import {
  format,
  formatDistanceToNow,
  formatISO,
  formatDuration as fnsFormatDuration,
  parseISO,
  isValid,
} from 'date-fns';

export function formatDate(date: Date | string, formatStr: string): string {
  if (!date || !formatStr) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, formatStr);
}

export function formatRelativeTime(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0s';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.join(' ') || '0s';
}

export function formatToISO(date: Date): string {
  return formatISO(date);
}

export function formatToLocalString(date: Date | string, locale = 'en-US'): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return d.toLocaleDateString(locale);
}

export function formatTimestamp(timestamp: number, formatStr = 'MMM d, yyyy h:mm a'): string {
  if (!Number.isFinite(timestamp)) return '';
  const d = new Date(timestamp);
  if (!isValid(d)) return '';
  return format(d, formatStr);
}
