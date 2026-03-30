// ============================================
// Template Interpolation
// ============================================

export function interpolate(
  template: string,
  data: Record<string, string | number | boolean>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in data ? String(data[key]) : match;
  });
}

export function createTemplate(template: string) {
  return (data: Record<string, string | number | boolean>) => interpolate(template, data);
}
