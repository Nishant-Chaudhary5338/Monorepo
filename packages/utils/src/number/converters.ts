// ============================================
// Number Converters
// ============================================

export function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return '';
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  let remaining = num;
  for (let i = 0; i < values.length; i++) {
    while (remaining >= values[i]) {
      result += symbols[i];
      remaining -= values[i];
    }
  }
  return result;
}

export function fromRoman(roman: string): number {
  const map: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
  };
  let result = 0;
  const str = roman.toUpperCase();
  for (let i = 0; i < str.length; i++) {
    const curr = map[str[i]] ?? 0;
    const next = map[str[i + 1]] ?? 0;
    result += curr < next ? -curr : curr;
  }
  return result;
}

export function toHex(num: number): string {
  return num.toString(16);
}

export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

export function toBinary(num: number): string {
  return num.toString(2);
}

export function fromBinary(bin: string): number {
  return parseInt(bin, 2);
}

export function bytesToSize(bytes: number): string {
  return formatFileSize(bytes);
}

// internal helper
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
