import { describe, it, expect } from 'vitest';
import { isBusinessDay, addBusinessDays, getBusinessDaysBetween, isDateInRange, getDateRange, startOfToday, endOfToday, isToday, isPast, isFuture, daysBetween, weeksBetween, monthsBetween } from './helpers';

describe('isBusinessDay', () => {
  it('returns true for weekdays', () => {
    const monday = new Date(2024, 0, 15);
    expect(isBusinessDay(monday)).toBe(true);
  });
  it('returns false for weekends', () => {
    const saturday = new Date(2024, 0, 13);
    expect(isBusinessDay(saturday)).toBe(false);
  });
});

describe('addBusinessDays', () => {
  it('adds business days', () => {
    const friday = new Date(2024, 0, 12);
    const result = addBusinessDays(friday, 1);
    const monday = new Date(2024, 0, 15);
    expect(result.getDay()).toBe(monday.getDay());
  });
});

describe('getBusinessDaysBetween', () => {
  it('counts business days', () => {
    const monday = new Date(2024, 0, 15);
    const friday = new Date(2024, 0, 19);
    expect(getBusinessDaysBetween(monday, friday)).toBe(4);
  });
});

describe('isDateInRange', () => {
  it('returns true when in range', () => {
    const date = new Date(2024, 5, 15);
    expect(isDateInRange(date, new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(true);
  });
  it('returns false when out of range', () => {
    const date = new Date(2025, 0, 1);
    expect(isDateInRange(date, new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(false);
  });
});

describe('getDateRange', () => {
  it('returns today range', () => {
    const range = getDateRange('today');
    expect(range.start).toBeInstanceOf(Date);
    expect(range.end).toBeInstanceOf(Date);
  });
  it('returns last7days range', () => {
    const range = getDateRange('last7days');
    const diffDays = Math.round((range.end.getTime() - range.start.getTime()) / 86400000);
    expect(diffDays).toBe(6);
  });
});

describe('startOfToday / endOfToday', () => {
  it('returns start of today', () => {
    const start = startOfToday();
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });
  it('returns end of today', () => {
    const end = endOfToday();
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });
  it('returns false for other days', () => {
    const past = new Date(2020, 0, 1);
    expect(isToday(past)).toBe(false);
  });
});

describe('isPast', () => {
  it('returns true for past dates', () => {
    expect(isPast(new Date(2020, 0, 1))).toBe(true);
  });
  it('returns false for future dates', () => {
    expect(isPast(new Date(2099, 0, 1))).toBe(false);
  });
});

describe('isFuture', () => {
  it('returns true for future dates', () => {
    expect(isFuture(new Date(2099, 0, 1))).toBe(true);
  });
  it('returns false for past dates', () => {
    expect(isFuture(new Date(2020, 0, 1))).toBe(false);
  });
});

describe('daysBetween', () => {
  it('calculates days between dates', () => {
    expect(daysBetween('2024-01-01', '2024-01-10')).toBe(9);
  });
});

describe('weeksBetween', () => {
  it('calculates weeks between dates', () => {
    expect(weeksBetween('2024-01-01', '2024-01-15')).toBe(2);
  });
});

describe('monthsBetween', () => {
  it('calculates months between dates', () => {
    expect(monthsBetween('2024-01-01', '2024-03-01')).toBe(2);
  });
});
