// ============================================
// Number Formatters
// ============================================

export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

export function formatPhoneNumber(phone: string, country = 'US'): string {
  const digits = phone.replace(/\D/g, '');
  if (country === 'US' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatCreditCard(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatNumber(
  value: number,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}
