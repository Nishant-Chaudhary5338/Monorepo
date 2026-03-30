// ============================================
// Number Helpers
// ============================================

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return NaN;
  }
  return Math.min(Math.max(value, min), max);
}

export function random(min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return NaN;
  if (min > max) [min, max] = [max, min];
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return NaN;
  if (min > max) [min, max] = [max, min];
  return Math.floor(random(min, max + 1));
}

export function range(start: number, end: number, step = 1): number[] {
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step) || step === 0) {
    return [];
  }
  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i);
  } else if (step < 0) {
    for (let i = start; i > end; i += step) result.push(i);
  }
  return result;
}

export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(decimals)) return NaN;
  const factor = Math.pow(10, Math.max(0, decimals));
  return Math.round(value * factor) / factor;
}

export function average(values: number[]): number {
  if (!values?.length) return 0;
  const validValues = values.filter(Number.isFinite);
  if (validValues.length === 0) return 0;
  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
}

export function sum(values: number[]): number {
  if (!values?.length) return 0;
  return values.filter(Number.isFinite).reduce((s, v) => s + v, 0);
}

export function median(values: number[]): number {
  if (!values?.length) return 0;
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function percentile(values: number[], p: number): number {
  if (!values?.length || !Number.isFinite(p)) return 0;
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const clampedP = clamp(p, 0, 100);
  const index = (clampedP / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}
