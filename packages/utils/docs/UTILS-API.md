# @repo/utils - Comprehensive API Documentation

> Enterprise-grade utility library for data-heavy, secure CRUD applications.
> Designed for seamless integration with RTK Query, React Hook Form, and modern React patterns.

---

## Table of Contents

1. [API Module](#1-api-module)
2. [Validation Module](#2-validation-module)
3. [Search Module](#3-search-module)
4. [Pagination Module](#4-pagination-module)
5. [Auth Module](#5-auth-module)
6. [Hooks Module](#6-hooks-module)
7. [Performance Module](#7-performance-module)
8. [Media Module](#8-media-module)
9. [String Module](#9-string-module)
10. [Array Module](#10-array-module)
11. [Object Module](#11-object-module)
12. [Date Module](#12-date-module)
13. [Number Module](#13-number-module)
14. [Storage Module](#14-storage-module)
15. [URL Module](#15-url-module)
16. [Clipboard Module](#16-clipboard-module)
17. [Logger Module](#17-logger-module)
18. [Error Module](#18-error-module)
19. [Cache Module](#19-cache-module)
20. [Types Module](#20-types-module)
21. [Constants Module](#21-constants-module)

---

## 1. API Module

RTK Query helpers and base API configuration.

### `createBaseApi(config)`

Creates a base RTK Query API with built-in error handling, auth token injection, and cache management.

```typescript
import { createBaseApi } from '@repo/utils/api';

const api = createBaseApi({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  reducerPath: 'api',
  tagTypes: ['User', 'Post', 'Comment'],
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});
```

**Type:**
```typescript
interface BaseApiConfig {
  baseUrl: string;
  reducerPath?: string;
  tagTypes?: string[];
  prepareHeaders?: (headers: Headers, api: { getState: () => unknown }) => Headers;
  fetchFn?: typeof fetch;
}
```

### `createPaginatedEndpoint(api, config)`

Creates a paginated query endpoint with automatic cache management.

```typescript
const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: createPaginatedEndpoint(builder, {
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
  }),
});
```

### `createCrudEndpoints(api, config)`

Generates full CRUD endpoints (getList, getById, create, update, delete) from a config.

```typescript
const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ...createCrudEndpoints(builder, {
      entity: 'User',
      baseUrl: '/users',
      tagTypes: ['User'],
    }),
  }),
});
```

### `handleApiError(error)`

Centralized API error handler that normalizes different error formats.

```typescript
import { handleApiError } from '@repo/utils/api';

try {
  await apiCall();
} catch (error) {
  const normalized = handleApiError(error);
  // { message: string, status: number, code: string, details?: unknown }
}
```

### `createRetryConfig(options)`

Creates retry configuration for failed requests with exponential backoff.

```typescript
const retryConfig = createRetryConfig({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryCondition: (error) => error.status === 429 || error.status >= 500,
});
```

### `createOptimisticUpdate(config)`

Creates optimistic update handlers for RTK Query mutations.

### `createInfiniteQuery(builder, config)`

Creates an infinite scrolling query endpoint.

### `createWebSocketEndpoint(config)`

Creates a WebSocket-based real-time endpoint for RTK Query.

---

## 2. Validation Module

Zod schema builders and form validation utilities.

### Schema Builders

```typescript
import {
  zodEmail,
  zodPassword,
  zodPhone,
  zodUrl,
  zodUuid,
  zodDateString,
  zodIpAddress,
  zodCreditCard,
  zodSlug,
  zodUsername,
} from '@repo/utils/validation';

// Pre-configured schemas
const emailSchema = zodEmail(); // Email validation with custom error
const passwordSchema = zodPassword({ minLength: 8, requireUppercase: true, requireNumber: true });
const phoneSchema = zodPhone({ country: 'US' });
```

### `createFormSchema(fields)`

Creates a complete form schema from field definitions.

```typescript
import { createFormSchema } from '@repo/utils/validation';

const userSchema = createFormSchema({
  email: { type: 'email', required: true },
  password: { type: 'password', minLength: 8 },
  name: { type: 'string', minLength: 2, maxLength: 50 },
  age: { type: 'number', min: 18, max: 120 },
  role: { type: 'enum', values: ['admin', 'user', 'guest'] },
});
```

### `validateField(value, rules)`

Validates a single field against rules.

### `createFormValidator(schema)`

Creates a form validator compatible with react-hook-form.

```typescript
import { createFormValidator } from '@repo/utils/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(createFormSchema(fields)),
});
```

### `sanitizeInput(value, options)`

Sanitizes user input to prevent XSS and injection attacks.

### `validateFileUpload(file, rules)`

Validates file uploads (size, type, dimensions for images).

### Common Validators

- `isValidEmail(value)` - Email validation
- `isValidUrl(value)` - URL validation
- `isValidPhone(value, country?)` - Phone validation
- `isValidPassword(value, rules?)` - Password strength validation
- `isValidCreditCard(value)` - Credit card validation (Luhn algorithm)
- `isValidIpAddress(value, version?)` - IPv4/IPv6 validation
- `isValidJson(value)` - JSON string validation
- `isValidHexColor(value)` - Hex color validation
- `isValidDateString(value, format?)` - Date string validation

---

## 3. Search Module

Fuzzy search, full-text search, and filter builders.

### `fuzzySearch(items, query, options)`

Performs fuzzy search on an array of items.

```typescript
import { fuzzySearch } from '@repo/utils/search';

const results = fuzzySearch(users, 'john', {
  keys: ['name', 'email'],
  threshold: 0.3,
  limit: 10,
});
```

### `createSearchIndex(items, fields)`

Creates a searchable index for fast lookups.

### `createRtkSearchFilter(searchParams)`

Creates RTK Query-compatible search/filter parameters.

```typescript
import { createRtkSearchFilter } from '@repo/utils/search';

const params = createRtkSearchFilter({
  search: 'john',
  filters: { status: 'active', role: 'admin' },
  sort: { field: 'createdAt', order: 'desc' },
});
// { search: 'john', status: 'active', role: 'admin', sortBy: 'createdAt', sortOrder: 'desc' }
```

### `createFilterPredicate(filters)`

Creates a predicate function for client-side filtering.

### `highlightMatches(text, query)`

Highlights matching text in search results.

### `createAutocompleteConfig(options)`

Creates configuration for autocomplete/search-as-you-type.

### `debouncedSearch(searchFn, delay)`

Creates a debounced search function.

---

## 4. Pagination Module

RTK Query pagination, cursor-based pagination, and infinite scroll.

### `createPaginationState(config)`

Creates pagination state management.

```typescript
import { createPaginationState } from '@repo/utils/pagination';

const pagination = createPaginationState({
  initialPage: 1,
  pageSize: 20,
  totalCount: 0,
});
```

### `createRtkPaginationArg(config)`

Creates RTK Query pagination arguments.

```typescript
import { createRtkPaginationArg } from '@repo/utils/pagination';

const arg = createRtkPaginationArg({ page: 1, pageSize: 20 });
// { offset: 0, limit: 20 }
```

### `createCursorPagination(config)`

Creates cursor-based pagination state and helpers.

### `createInfiniteScrollConfig(options)`

Creates configuration for infinite scroll with RTK Query.

### `calculatePageRange(currentPage, totalPages, siblings)`

Calculates visible page numbers for pagination UI.

```typescript
import { calculatePageRange } from '@repo/utils/pagination';

calculatePageRange(5, 20, 2);
// [1, '...', 3, 4, 5, 6, 7, '...', 20]
```

### `parsePaginationParams(searchParams)`

Parses pagination parameters from URL search params.

### `createPaginationMeta(page, pageSize, total)`

Creates pagination metadata for API responses.

---

## 5. Auth Module

Authentication helpers, guards, SSO, and RBAC.

### Token Management

```typescript
import { createTokenManager } from '@repo/utils/auth';

const tokenManager = createTokenManager({
  storageKey: 'auth_tokens',
  refreshEndpoint: '/api/auth/refresh',
  onTokenExpired: () => redirectToLogin(),
});

// Usage
await tokenManager.setTokens({ accessToken, refreshToken });
const token = await tokenManager.getAccessToken();
await tokenManager.refreshTokens();
tokenManager.clearTokens();
```

### `createAuthGuard(config)`

Creates route/component authentication guards.

```typescript
import { createAuthGuard } from '@repo/utils/auth';

const withAuth = createAuthGuard({
  redirectTo: '/login',
  roles: ['admin', 'user'],
  permissions: ['read:users'],
});
```

### `createRBAC(config)`

Creates role-based access control utilities.

```typescript
import { createRBAC } from '@repo/utils/auth';

const rbac = createRBAC({
  roles: {
    admin: ['read:all', 'write:all', 'delete:all'],
    user: ['read:own', 'write:own'],
    guest: ['read:public'],
  },
});

rbac.hasPermission('admin', 'delete:all'); // true
rbac.hasRole(user, ['admin', 'user']); // boolean
```

### `createSSOProvider(config)`

Creates SSO integration helpers (OAuth2, SAML).

### `createSessionManager(config)`

Creates session management with timeout and activity tracking.

### `createPasswordPolicy(rules)`

Creates password policy validation.

### `createMFAHelpers(config)`

Creates multi-factor authentication helpers.

---

## 6. Hooks Module

Common React hooks for enterprise applications.

### `useDebounce(value, delay)`

Debounces a value.

```typescript
import { useDebounce } from '@repo/utils/hooks';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
```

### `useThrottle(value, delay)`

Throttles a value.

### `useLocalStorage(key, initialValue)`

Typed localStorage hook with SSR safety.

```typescript
import { useLocalStorage } from '@repo/utils/hooks';

const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

### `useSessionStorage(key, initialValue)`

Typed sessionStorage hook.

### `useMediaQuery(query)`

CSS media query hook.

```typescript
import { useMediaQuery } from '@repo/utils/hooks';

const isMobile = useMediaQuery('(max-width: 768px)');
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

### `useIntersectionObserver(options)`

Intersection Observer hook for lazy loading.

### `useClickOutside(ref, handler)`

Detects clicks outside an element.

### `useKeyPress(targetKey)`

Detects keyboard key presses.

### `useWindowSize()`

Returns window dimensions with resize listener.

### `usePrevious(value)`

Returns the previous value.

### `useCopyToClipboard()`

Clipboard copy hook with success state.

### `useOnlineStatus()`

Returns online/offline status.

### `useVisibilityChange()`

Detects page visibility changes.

### `useEventListener(eventName, handler, element?)`

Generic event listener hook.

### `useInfiniteScroll(options)`

Infinite scroll hook integrated with RTK Query.

```typescript
import { useInfiniteScroll } from '@repo/utils/hooks';

const { data, isLoading, loadMoreRef, hasMore } = useInfiniteScroll({
  query: useGetUsersInfiniteQuery,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

### `useVirtualList(options)`

Virtual list hook wrapping react-window.

```typescript
import { useVirtualList } from '@repo/utils/hooks';

const { VirtualList, scrollToProps } = useVirtualList({
  items: largeDataset,
  itemHeight: 50,
  overscan: 5,
});
```

### `useSearchWithRtk(options)`

Integrated search hook with RTK Query.

```typescript
import { useSearchWithRtk } from '@repo/utils/hooks';

const { query, setQuery, results, isSearching } = useSearchWithRtk({
  searchEndpoint: api.useSearchUsersQuery,
  debounceMs: 300,
  minChars: 2,
});
```

### `useFilterWithRtk(options)`

Integrated filter hook with RTK Query.

### `useSortWithRtk(options)`

Integrated sort hook with RTK Query.

### `usePaginationWithRtk(options)`

Integrated pagination hook with RTK Query.

```typescript
import { usePaginationWithRtk } from '@repo/utils/hooks';

const { page, pageSize, setPage, setPageSize, meta } = usePaginationWithRtk({
  query: useGetUsersQuery,
  initialPageSize: 20,
});
```

### `useFormWithValidation(options)`

Enhanced form hook with built-in validation.

### `useConfirm(options)`

Confirmation dialog hook.

### `usePermission(permission)`

Permission checking hook (works with RBAC).

### `useAuth()`

Authentication state hook.

### `usePrefetch(endpoint)`

RTK Query prefetching hook.

---

## 7. Performance Module

Lazy loading, virtualization, code splitting, and optimization.

### `createLazyComponent(importFn, options?)`

Creates a lazy-loaded component with loading fallback.

```typescript
import { createLazyComponent } from '@repo/utils/performance';

const HeavyComponent = createLazyComponent(
  () => import('./HeavyComponent'),
  { fallback: <Skeleton /> }
);
```

### `createVirtualListConfig(options)`

Creates react-window configuration.

### `createVirtualizedTableConfig(options)`

Creates react-virtualized table configuration.

### `memoize(fn, options?)`

Advanced memoization with cache size limit.

### `createDebouncedMemo(computeFn, delay)`

Creates a debounced memoized value.

### `optimizeImage(url, options)`

Optimizes image URLs with size/format parameters.

### `createIntersectionLoader(options)`

Creates intersection-based lazy loader.

### `measurePerformance(label)`

Performance measurement utility.

### `createBundleAnalyzer()`

Bundle size analysis helpers.

---

## 8. Media Module

HLS and video player utilities.

### `createHLSPlayer(config)`

Creates an HLS.js player instance.

```typescript
import { createHLSPlayer } from '@repo/utils/media';

const player = createHLSPlayer({
  videoElement: videoRef.current,
  src: 'https://stream.example.com/playlist.m3u8',
  autoplay: false,
  onError: (error) => console.error('HLS Error:', error),
  onQualityChange: (level) => console.log('Quality:', level),
});

player.play();
player.pause();
player.seek(30);
player.setQuality(2);
player.destroy();
```

### `createVideoPlayer(config)`

Creates a generic video player with unified API.

```typescript
import { createVideoPlayer } from '@repo/utils/media';

const player = createVideoPlayer({
  element: videoRef.current,
  sources: [
    { src: '/video.mp4', type: 'video/mp4' },
    { src: '/stream.m3u8', type: 'application/x-mpegURL' },
  ],
  controls: true,
});

// Unified controls
player.play();
player.pause();
player.setVolume(0.5);
player.setPlaybackRate(1.5);
player.enterFullscreen();
```

### `createAudioPlayer(config)`

Creates an audio player utility.

### `createMediaSession(metadata)`

Creates Media Session API integration for browser media controls.

### `getMediaCapabilities(config)`

Detects browser media capabilities (codec support, etc.).

---

## 9. String Module

String manipulation, formatting, and conversion.

### Formatters

```typescript
import {
  capitalize,
  capitalizeWords,
  titleCase,
  truncate,
  truncateMiddle,
  wrapText,
  formatInitials,
  maskString,
} from '@repo/utils/string';

capitalize('hello');           // 'Hello'
capitalizeWords('hello world'); // 'Hello World'
titleCase('hello-world');      // 'Hello World'
truncate('Long text...', 10);  // 'Long te...'
maskString('1234567890', { showLast: 4 }); // '******7890'
formatInitials('John Doe');    // 'JD'
```

### Converters

```typescript
import {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  toDotCase,
  toConstantCase,
  toSentenceCase,
} from '@repo/utils/string';

toCamelCase('hello-world');    // 'helloWorld'
toSnakeCase('helloWorld');     // 'hello_world'
toKebabCase('helloWorld');     // 'hello-world'
toPascalCase('hello-world');   // 'HelloWorld'
toConstantCase('hello-world'); // 'HELLO_WORLD'
```

### Trimmers

```typescript
import {
  trimWhitespace,
  stripHtml,
  stripMarkdown,
  normalizeWhitespace,
  removeNonAlphanumeric,
  removeEmojis,
} from '@repo/utils/string';

stripHtml('<p>Hello <b>World</b></p>');  // 'Hello World'
normalizeWhitespace('  hello   world  '); // 'hello world'
removeEmojis('Hello 👋 World 🌍');       // 'Hello  World'
```

### Template

```typescript
import { interpolate } from '@repo/utils/string';

interpolate('Hello {{name}}, you are {{age}} years old', { name: 'John', age: 30 });
// 'Hello John, you are 30 years old'
```

### Validators

- `isValidEmail(value)` - Email validation
- `isValidUrl(value)` - URL validation
- `isValidSlug(value)` - URL slug validation
- `containsProfanity(value)` - Profanity filter
- `isPalindrome(value)` - Palindrome check

### Generators

- `generateSlug(text)` - Generate URL slug
- `generateRandomString(length, options?)` - Random string
- `generateId(prefix?)` - Generate unique ID
- `generateUUID()` - Generate UUID v4

---

## 10. Array Module

Array utilities for data manipulation.

### Helpers

```typescript
import {
  chunk,
  unique,
  uniqueBy,
  flatten,
  flattenDeep,
  compact,
  intersection,
  difference,
  union,
  groupBy,
  sortBy,
  shuffle,
  sample,
  sampleSize,
  zip,
  unzip,
  partition,
  take,
  drop,
  takeRight,
  dropRight,
  last,
  nth,
} from '@repo/utils/array';

chunk([1, 2, 3, 4, 5], 2);           // [[1, 2], [3, 4], [5]]
unique([1, 1, 2, 3, 3]);              // [1, 2, 3]
uniqueBy(users, 'id');                // Unique by property
groupBy(users, 'role');               // { admin: [...], user: [...] }
intersection([1, 2], [2, 3]);         // [2]
difference([1, 2, 3], [2, 3, 4]);    // [1]
partition([1, 2, 3, 4], n => n % 2); // [[1, 3], [2, 4]]
shuffle([1, 2, 3, 4, 5]);            // Shuffled array
sample([1, 2, 3, 4, 5]);             // Random element
sampleSize([1, 2, 3, 4, 5], 3);      // 3 random elements
```

### Sorting

```typescript
import { multiSort, naturalSort, caseInsensitiveSort } from '@repo/utils/array';

multiSort(users, [
  { field: 'role', order: 'asc' },
  { field: 'name', order: 'desc' },
]);

naturalSort(['item1', 'item10', 'item2']); // ['item1', 'item2', 'item10']
```

### Search

```typescript
import { binarySearch, findIndex } from '@repo/utils/array';

binarySearch(sortedArray, target); // O(log n) search
```

---

## 11. Object Module

Object manipulation and deep operations.

### Helpers

```typescript
import {
  pick,
  omit,
  merge,
  deepMerge,
  deepClone,
  deepFreeze,
  flattenObject,
  unflattenObject,
  mapValues,
  mapKeys,
  invert,
  isEmpty,
  isEqual,
} from '@repo/utils/object';

pick(user, ['name', 'email']);               // { name, email }
omit(user, ['password', 'token']);           // Without password/token
deepMerge(defaults, overrides);              // Deep merge
flattenObject({ a: { b: { c: 1 } } });      // { 'a.b.c': 1 }
unflattenObject({ 'a.b.c': 1 });            // { a: { b: { c: 1 } } }
mapValues(users, (u) => u.name);             // Map values
mapKeys(obj, (key) => key.toUpperCase());    // Map keys
```

### Dot Notation

```typescript
import { get, set, has, unset } from '@repo/utils/object';

get(user, 'address.city');           // Deep get
set(user, 'address.city', 'NYC');    // Deep set
has(user, 'address.city');           // Deep has
unset(user, 'address.city');         // Deep delete
```

### Comparison

```typescript
import { deepEqual, shallowEqual, diff } from '@repo/utils/object';

deepEqual(obj1, obj2);        // Deep equality check
diff(obj1, obj2);             // Returns differences
```

---

## 12. Date Module

Date formatting and manipulation (wrapping date-fns).

### Formatters

```typescript
import {
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatToISO,
  formatToLocalString,
} from '@repo/utils/date';

formatDate(new Date(), 'yyyy-MM-dd');        // '2024-01-15'
formatRelativeTime(new Date('2024-01-01'));  // '2 weeks ago'
formatDuration(3661000);                      // '1h 1m 1s'
```

### Helpers

```typescript
import {
  isBusinessDay,
  addBusinessDays,
  getBusinessDaysBetween,
  isDateInRange,
  getDateRange,
  startOfToday,
  endOfToday,
  isToday,
  isPast,
  isFuture,
  daysBetween,
  weeksBetween,
  monthsBetween,
} from '@repo/utils/date';

addBusinessDays(new Date(), 5);          // Add 5 business days
getBusinessDaysBetween(start, end);      // Count business days
isDateInRange(date, start, end);         // Range check
getDateRange('last30days');              // Pre-defined ranges
```

### Validators

- `isValidDate(value)` - Valid date check
- `isDateInRange(date, min, max)` - Range validation
- `isAgeValid(birthDate, minAge)` - Age validation

---

## 13. Number Module

Number formatting and utilities.

### Formatters

```typescript
import {
  formatCurrency,
  formatPercentage,
  formatCompact,
  formatFileSize,
  formatPhoneNumber,
  formatCreditCard,
} from '@repo/utils/number';

formatCurrency(1234.56, 'USD');          // '$1,234.56'
formatPercentage(0.1234);                // '12.34%'
formatCompact(1234567);                  // '1.2M'
formatFileSize(1048576);                 // '1 MB'
formatPhoneNumber('1234567890');         // '(123) 456-7890'
formatCreditCard('4111111111111111');    // '4111 1111 1111 1111'
```

### Helpers

```typescript
import {
  clamp,
  random,
  randomInt,
  range,
  roundTo,
  average,
  sum,
  median,
  percentile,
} from '@repo/utils/number';

clamp(value, min, max);       // Clamp value to range
random(1, 100);               // Random float in range
randomInt(1, 100);            // Random integer in range
range(1, 10, 2);              // [1, 3, 5, 7, 9]
roundTo(3.14159, 2);          // 3.14
average([1, 2, 3, 4, 5]);    // 3
median([1, 2, 3, 4, 5]);     // 3
```

### Converters

- `toRoman(num)` - Number to Roman numeral
- `fromRoman(str)` - Roman numeral to number
- `toHex(num)` - Number to hex
- `fromHex(str)` - Hex to number
- `toBinary(num)` - Number to binary
- `bytesToSize(bytes)` - Bytes to human-readable

---

## 14. Storage Module

Typed storage utilities with encryption support.

### `createStorage(config)`

Creates a typed storage wrapper.

```typescript
import { createStorage } from '@repo/utils/storage';

const storage = createStorage<UserPreferences>({
  key: 'user_preferences',
  storage: 'local', // 'local' | 'session'
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  defaultValue: { theme: 'light', language: 'en' },
});

storage.get();          // Get value
storage.set(newValue);  // Set value
storage.remove();       // Remove value
storage.clear();        // Clear all
```

### `createEncryptedStorage(config)`

Creates encrypted storage for sensitive data.

```typescript
import { createEncryptedStorage } from '@repo/utils/storage';

const secureStorage = createEncryptedStorage({
  key: 'auth_tokens',
  secret: process.env.STORAGE_SECRET,
});
```

### `createIndexedDBStorage(config)`

Creates IndexedDB-based storage for large datasets.

### `createStorageWithExpiry(config)`

Creates storage with TTL (time-to-live).

---

## 15. URL Module

URL manipulation and query parameter utilities.

### Query Parameters

```typescript
import {
  parseQueryParams,
  stringifyQueryParams,
  addQueryParams,
  removeQueryParams,
  getQueryParam,
  setQueryParam,
} from '@repo/utils/url';

parseQueryParams('?foo=bar&baz=qux');    // { foo: 'bar', baz: 'qux' }
stringifyQueryParams({ foo: 'bar' });     // 'foo=bar'
addQueryParams('/api', { page: 1 });      // '/api?page=1'
removeQueryParams('/api?page=1', ['page']); // '/api'
```

### Builders

```typescript
import { buildUrl, joinPaths } from '@repo/utils/url';

buildUrl('https://api.example.com', '/users', { page: 1, limit: 20 });
// 'https://api.example.com/users?page=1&limit=20'

joinPaths('/api', '/v1', '/users');  // '/api/v1/users'
```

### Validators

- `isValidUrl(value)` - URL validation
- `isAbsoluteUrl(value)` - Absolute URL check
- `isSecureUrl(value)` - HTTPS check

---

## 16. Clipboard Module

Clipboard utilities.

```typescript
import { copyToClipboard, readFromClipboard } from '@repo/utils/clipboard';

await copyToClipboard('Hello World');  // Copy text
const text = await readFromClipboard(); // Read text
```

---

## 17. Logger Module

Structured logging utility.

```typescript
import { createLogger } from '@repo/utils/logger';

const logger = createLogger({
  level: 'info',
  prefix: '[MyApp]',
  transports: ['console', 'file'],
  format: 'json',
});

logger.info('User logged in', { userId: 123 });
logger.error('API failed', { status: 500, endpoint: '/users' });
logger.warn('Deprecated API called');
logger.debug('State changed', { newState });
```

### Log Levels

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages
- `trace` - Trace messages

---

## 18. Error Module

Error handling and boundary utilities.

### Custom Error Classes

```typescript
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  NetworkError,
  TimeoutError,
} from '@repo/utils/error';

throw new ValidationError('Invalid email', { field: 'email' });
throw new NotFoundError('User not found', { userId: 123 });
throw new AuthenticationError('Token expired');
```

### `createErrorBoundary(config)`

Creates React error boundary utilities.

### `withErrorHandling(fn, options)`

Wraps async functions with error handling.

```typescript
import { withErrorHandling } from '@repo/utils/error';

const safeApiCall = withErrorHandling(fetchUsers, {
  onError: (error) => showToast(error.message),
  retry: 3,
  retryDelay: 1000,
});
```

### `createRetryPolicy(options)`

Creates retry policy with exponential backoff.

```typescript
import { createRetryPolicy } from '@repo/utils/error';

const retry = createRetryPolicy({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryCondition: (error) => error.status >= 500,
});
```

---

## 19. Cache Module

In-memory caching utilities.

### `createMemoryCache(options)`

Creates an LRU memory cache.

```typescript
import { createMemoryCache } from '@repo/utils/cache';

const cache = createMemoryCache({
  maxSize: 100,
  ttl: 60000, // 1 minute
});

cache.set('key', value);
cache.get('key');       // value | undefined
cache.has('key');       // boolean
cache.delete('key');    // boolean
cache.clear();          // void
```

### `createCacheAside(config)`

Creates cache-aside pattern implementation.

### `createWriteThrough(config)`

Creates write-through cache implementation.

### `memoizeWithCache(fn, options)`

Memoizes function results with cache.

---

## 20. Types Module

Shared TypeScript types and utility types.

### Common Types

```typescript
import type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  PaginationParams,
  SortParams,
  FilterParams,
  SearchParams,
  BaseEntity,
  User,
  AuthTokens,
  Permission,
  Role,
} from '@repo/utils/types';
```

### Utility Types

```typescript
import type {
  DeepPartial,
  DeepRequired,
  DeepReadonly,
  NonNullableFields,
  PartialBy,
  RequiredBy,
  OmitStrict,
  PickStrict,
  ValueOf,
  KeysOfType,
  AsyncReturnType,
  Promisify,
  Unpromisify,
} from '@repo/utils/types';
```

---

## 21. Constants Module

Common constants.

```typescript
import {
  HTTP_STATUS,
  HTTP_METHODS,
  SORT_ORDER,
  DATE_FORMATS,
  FILE_SIZE_UNITS,
  REGEX_PATTERNS,
  STORAGE_KEYS,
  EVENT_NAMES,
  ERROR_CODES,
} from '@repo/utils/constants';

HTTP_STATUS.OK;                    // 200
HTTP_STATUS.NOT_FOUND;             // 404
HTTP_STATUS.UNAUTHORIZED;          // 401
SORT_ORDER.ASC;                    // 'asc'
DATE_FORMATS.ISO;                  // 'yyyy-MM-dd'
REGEX_PATTERNS.EMAIL;              // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

---

## Import Patterns

### Full Import (Tree-shakeable)
```typescript
import { debounce, useDebounce, formatCurrency } from '@repo/utils';
```

### Module Import (Recommended for clarity)
```typescript
import { debounce, useDebounce } from '@repo/utils/hooks';
import { formatCurrency } from '@repo/utils/number';
import { createPaginatedEndpoint } from '@repo/utils/api';
import { zodEmail, createFormSchema } from '@repo/utils/validation';
```

### Type-only Imports
```typescript
import type { PaginatedResponse, BaseEntity } from '@repo/utils/types';
```

---

## RTK Query Integration Examples

### Complete CRUD with Search, Filter, Sort, Pagination

```typescript
import { createBaseApi, createCrudEndpoints, createPaginatedEndpoint } from '@repo/utils/api';
import { useSearchWithRtk, useFilterWithRtk, usePaginationWithRtk } from '@repo/utils/hooks';

// API Definition
const usersApi = createBaseApi({
  baseUrl: '/api',
  tagTypes: ['User'],
});

const userEndpoints = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    ...createCrudEndpoints(builder, {
      entity: 'User',
      baseUrl: '/users',
      tagTypes: ['User'],
    }),
    searchUsers: createPaginatedEndpoint(builder, {
      query: (params) => ({ url: '/users/search', params }),
      providesTags: ['User'],
    }),
  }),
});

// Component Usage
function UsersPage() {
  const { query, setQuery, results } = useSearchWithRtk({
    searchEndpoint: userEndpoints.useSearchUsersQuery,
    debounceMs: 300,
  });

  const { filters, setFilter } = useFilterWithRtk({
    filterConfig: {
      status: { type: 'select', options: ['active', 'inactive'] },
      role: { type: 'select', options: ['admin', 'user'] },
    },
  });

  const { page, pageSize, setPage, meta } = usePaginationWithRtk({
    query: userEndpoints.useSearchUsersQuery,
    initialPageSize: 20,
  });

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <Filters filters={filters} onChange={setFilter} />
      <UserTable data={results} />
      <Pagination page={page} meta={meta} onChange={setPage} />
    </div>
  );
}
```

---

## Version

0.0.0