// ============================================================================
// SEARCH MODULE GENERATOR
// ============================================================================

export function generateSearchModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// SEARCH MODULE - Fuzzy search, highlighting, and indexing
// ============================================================================

/**
 * Calculates Levenshtein distance between two strings
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Calculates fuzzy match score between query and target
 * @param query - Search query
 * @param target - Target string to match
 * @returns Score from 0 (no match) to 1 (exact match)
 */
export function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t === q) return 1;
  if (t.startsWith(q)) return 0.9;
  if (t.includes(q)) return 0.7;

  let score = 0;
  let qi = 0;
  let consecutiveBonus = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1 + consecutiveBonus * 0.5;
      consecutiveBonus++;
      qi++;
    } else {
      consecutiveBonus = 0;
    }
  }

  return qi === q.length ? Math.min(score / q.length / 2, 0.99) : 0;
}

/**
 * Performs fuzzy search on an array of items
 * @param query - Search query
 * @param items - Items to search
 * @param options - Search options
 * @returns Sorted results with scores
 */
export function fuzzySearch<T>(
  query: string,
  items: T[],
  options: {
    keys?: (keyof T)[];
    getKey?: (item: T) => string;
    threshold?: number;
    limit?: number;
  } = {}
): { item: T; score: number }[] {
  const { keys, getKey, threshold = 0.3, limit } = options;

  const getStr = getKey
    ? getKey
    : keys
      ? (item: T) => keys.map((k) => String(item[k] ?? '')).join(' ')
      : (item: T) => String(item);

  const results = items
    .map((item) => {
      const target = getStr(item);
      return { item, score: fuzzyScore(query, target) };
    })
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score);

  return limit ? results.slice(0, limit) : results;
}

/**
 * Highlights matching text in a string
 * @param text - Original text
 * @param query - Search query to highlight
 * @param highlightTag - HTML tag for highlighting (default: 'mark')
 * @returns Text with highlighted matches
 * @example highlightMatches('Hello World', 'world') // 'Hello <mark>World</mark>'
 */
export function highlightMatches(text: string, query: string, highlightTag = 'mark'): string {
  if (!text || !query) return text;
  const specialChars = /[.*+?^$()|[\]\\]/g;
  const escaped = query.replace(specialChars, '\\$&');
  const regex = new RegExp('(' + escaped + ')', 'gi');
  return text.replace(regex, '<' + highlightTag + '>$1</' + highlightTag + '>');
}

/**
 * Creates a simple search index for fast lookups
 * @param items - Items to index
 * @param getKey - Function to extract searchable text from item
 * @returns Search index object
 */
export function createSearchIndex<T>(
  items: T[],
  getKey: (item: T) => string
): {
  search: (query: string, limit?: number) => T[];
  add: (item: T) => void;
  remove: (item: T) => void;
} {
  const index = new Map<string, Set<T>>();

  function tokenize(text: string): string[] {
    return text.toLowerCase().split(/\\s+/).filter(Boolean);
  }

  function addToIndex(item: T): void {
    const tokens = tokenize(getKey(item));
    for (const token of tokens) {
      if (!index.has(token)) index.set(token, new Set());
      index.get(token)!.add(item);
    }
  }

  for (const item of items) {
    addToIndex(item);
  }

  return {
    search: (query: string, limit?: number): T[] => {
      const tokens = tokenize(query);
      const scores = new Map<T, number>();

      for (const token of tokens) {
        for (const [key, items] of index) {
          if (key.includes(token)) {
            for (const item of items) {
              scores.set(item, (scores.get(item) || 0) + 1);
            }
          }
        }
      }

      const sorted = [...scores.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([item]) => item);

      return limit ? sorted.slice(0, limit) : sorted;
    },
    add: addToIndex,
    remove: (item: T): void => {
      const tokens = tokenize(getKey(item));
      for (const token of tokens) {
        index.get(token)?.delete(item);
      }
    },
  };
}

/**
 * Creates a debounced search function
 * @param searchFn - Search function to debounce
 * @param delay - Debounce delay in ms
 * @returns Debounced search function
 */
export function createDebouncedSearch<T>(
  searchFn: (query: string) => T[],
  delay = 300
): (query: string, callback: (results: T[]) => void) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (query: string, callback: (results: T[]) => void): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const results = searchFn(query);
      callback(results);
    }, delay);
  };
}
`,
    'search.test.ts': `import { describe, it, expect } from 'vitest'
import { levenshteinDistance, fuzzyScore, fuzzySearch, highlightMatches, createSearchIndex } from './index'

describe('Search Module', () => {
  describe('levenshteinDistance', () => {
    it('calculates edit distance', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
      expect(levenshteinDistance('', 'abc')).toBe(3)
      expect(levenshteinDistance('abc', 'abc')).toBe(0)
    })
  })

  describe('fuzzyScore', () => {
    it('gives exact match score of 1', () => {
      expect(fuzzyScore('hello', 'hello')).toBe(1)
    })
    it('gives high score for prefix match', () => {
      expect(fuzzyScore('hel', 'hello')).toBeGreaterThan(0.5)
    })
    it('returns 0 for no match', () => {
      expect(fuzzyScore('xyz', 'hello')).toBe(0)
    })
  })

  describe('fuzzySearch', () => {
    const items = ['apple', 'banana', 'apricot', 'cherry']

    it('finds matching items', () => {
      const results = fuzzySearch('app', items)
      expect(results[0].item).toBe('apple')
    })

    it('respects threshold', () => {
      const results = fuzzySearch('xyz', items, { threshold: 0.5 })
      expect(results).toHaveLength(0)
    })

    it('respects limit', () => {
      const results = fuzzySearch('a', items, { limit: 2 })
      expect(results).toHaveLength(2)
    })
  })

  describe('highlightMatches', () => {
    it('highlights matching text', () => {
      expect(highlightMatches('Hello World', 'world')).toBe('Hello <mark>World</mark>')
    })

    it('uses custom tag', () => {
      expect(highlightMatches('Hello World', 'Hello', 'strong')).toBe('<strong>Hello</strong> World')
    })
  })

  describe('createSearchIndex', () => {
    it('searches indexed items', () => {
      const index = createSearchIndex(
        [{ name: 'Apple' }, { name: 'Banana' }],
        (item) => item.name
      )
      const results = index.search('app')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Apple')
    })

    it('adds new items to index', () => {
      const index = createSearchIndex<string>([], (s) => s)
      index.add('hello')
      expect(index.search('hel')).toHaveLength(1)
    })
  })
})
`,
  };
}