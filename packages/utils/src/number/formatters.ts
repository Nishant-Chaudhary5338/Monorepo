// ============================================
// Number Formatters
// ============================================

export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes)) return '0 B';
  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);
  if (absBytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.min(Math.floor(Math.log(absBytes) / Math.log(k)), units.length - 1);
  const prefix = isNegative ? '-' : '';
  return `${prefix}${parseFloat((absBytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

export function formatPhoneNumber(phone: string, country = 'US'): string {
  if (!phone?.trim()) return '';
  const digits = phone.replace(/\D/g, '');
  if (country === 'US' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatCreditCard(cardNumber: string): string {
  if (!cardNumber?.trim()) return '';
  const digits = cardNumber.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatNumber(
  value: number,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', options).format(value);
}
