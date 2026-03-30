import { parseISO, isValid, isBefore, isAfter } from 'date-fns';

export function isValidDate(value: unknown): boolean {
  if (value instanceof Date) return isValid(value);
  if (typeof value === 'string') return isValid(parseISO(value));
  if (typeof value === 'number') return isValid(new Date(value));
  return false;
}

export function isDateRangeValid(date: Date, min?: Date, max?: Date): boolean {
  if (min && isBefore(date, min)) return false;
  if (max && isAfter(date, max)) return false;
  return true;
}

export function isAgeValid(birthDate: Date | string, minAge: number): boolean {
  const d = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(d)) return false;
  const today = new Date();
  const age = today.getFullYear() - d.getFullYear();
  const monthDiff = today.getMonth() - d.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
    return age - 1 >= minAge;
  }
  return age >= minAge;
}
