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
  if (!query.trim()) return items.slice(0, limit);

  const lowerQuery = query.toLowerCase();

  function score(item: T): number {
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
  for (const item of items) {
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
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, `<${highlightTag}>$1</${highlightTag}>`);
}
