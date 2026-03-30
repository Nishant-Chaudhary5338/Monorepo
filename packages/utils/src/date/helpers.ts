import {
  addDays,
  isWeekend,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  startOfDay,
  endOfDay,
  isToday as fnsIsToday,
  isPast as fnsIsPast,
  isFuture as fnsIsFuture,
  subDays,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
  isValid,
} from 'date-fns';

export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date);
}

export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let added = 0;
  const direction = days > 0 ? 1 : -1;
  const absDays = Math.abs(days);

  while (added < absDays) {
    result = addDays(result, direction);
    if (isBusinessDay(result)) added++;
  }
  return result;
}

export function getBusinessDaysBetween(start: Date, end: Date): number {
  let count = 0;
  const direction = start < end ? 1 : -1;
  let current = new Date(start);
  const target = end;

  while (
    (direction === 1 && current < target) ||
    (direction === -1 && current > target)
  ) {
    current = addDays(current, direction);
    if (isBusinessDay(current)) count++;
  }
  return count;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function getDateRange(
  range: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisWeek'
): { start: Date; end: Date } {
  const now = new Date();
  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday':
      return { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
    case 'last7days':
      return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) };
    case 'last30days':
      return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) };
    case 'last90days':
      return { start: startOfDay(subDays(now, 89)), end: endOfDay(now) };
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'lastMonth':
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case 'thisWeek':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
}

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function endOfToday(): Date {
  return endOfDay(new Date());
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && fnsIsToday(d);
}

export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && fnsIsPast(d);
}

export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) && fnsIsFuture(d);
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(e, s);
}

export function weeksBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInWeeks(e, s);
}

export function monthsBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInMonths(e, s);
}
