export interface FuzzySearchOptions<T> {
  keys: (keyof T)[];
  threshold?: number;
  limit?: number;
}

export function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: FuzzySearchOptions<T>
): T[] {
  const { keys, threshold = 0.3, limit = 50 } = options;
  if (!items?.length || !query?.trim() || !keys?.length) return items?.slice(0, limit) ?? [];

  const lowerQuery = query.toLowerCase();

  function score(item: T): number {
    if (!item) return 0;
    let bestScore = 0;
    for (const key of keys) {
      const value = String(item[key] ?? '').toLowerCase();
      if (!value) continue;
      if (value === lowerQuery) return 1;
      if (value.startsWith(lowerQuery)) {
        bestScore = Math.max(bestScore, 0.9);
        continue;
      }
      if (value.includes(lowerQuery)) {
        bestScore = Math.max(bestScore, 0.7);
        continue;
      }
      // Simple fuzzy: check if all chars appear in order
      let qi = 0;
      let consecutive = 0;
      let maxConsecutive = 0;
      for (let i = 0; i < value.length && qi < lowerQuery.length; i++) {
        if (value[i] === lowerQuery[qi]) {
          qi++;
          consecutive++;
          maxConsecutive = Math.max(maxConsecutive, consecutive);
        } else {
          consecutive = 0;
        }
      }
      if (qi === lowerQuery.length) {
        const fuzzyScore = 0.3 + (maxConsecutive / lowerQuery.length) * 0.4;
        bestScore = Math.max(bestScore, fuzzyScore);
      }
    }
    return bestScore;
  }

  return items
    .map((item) => ({ item, score: score(item) }))
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}

export function createSearchIndex<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[]
): Map<string, T[]> {
  const index = new Map<string, T[]>();
  if (!items?.length || !fields?.length) return index;
  for (const item of items) {
    if (!item) continue;
    for (const field of fields) {
      const value = String(item[field] ?? '').toLowerCase();
      const words = value.split(/\s+/);
      for (const word of words) {
        if (!word) continue;
        const existing = index.get(word) ?? [];
        existing.push(item);
        index.set(word, existing);
      }
    }
  }
  return index;
}

export function highlightMatches(text: string, query: string, highlightTag = 'mark'): string {
  if (!text || !query?.trim()) return text ?? '';
  // Sanitize highlightTag to prevent XSS - only allow alphanumeric tags
  const safeTag = /^[a-z][a-z0-9]*$/i.test(highlightTag) ? highlightTag : 'mark';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, `<${safeTag}>$1</${safeTag}>`);
}
