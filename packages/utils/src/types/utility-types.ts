// ============================================
// Utility Types
// ============================================

/** Make all properties in T deeply optional */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/** Make all properties in T deeply required */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

/** Make all properties in T deeply readonly */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

/** Make specified properties non-nullable */
export type NonNullableFields<T, K extends keyof T> = T & {
  [P in K]: NonNullable<T[P]>;
};

/** Make specified properties optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specified properties required */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Strict omit (compile error if key doesn't exist) */
export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Strict pick (compile error if key doesn't exist) */
export type PickStrict<T, K extends keyof T> = Pick<T, K>;

/** Get all value types of an object */
export type ValueOf<T> = T[keyof T];

/** Get keys of T where value extends U */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/** Extract return type of an async function */
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : T extends (...args: any) => infer R
    ? R
    : never;

/** Wrap return type in Promise */
export type Promisify<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : never;

/** Unwrap Promise type */
export type Unpromisify<T> = T extends Promise<infer R> ? R : T;

/** Make type nullable */
export type Nullable<T> = T | null;

/** Make type optional */
export type Optional<T> = T | undefined;

/** Make type maybe (nullable or optional) */
export type Maybe<T> = T | null | undefined;

/** Extract array element type */
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/** Make specific keys mutable */
export type MutableKeys<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P];
};

/** Strict extract that only allows literal union members */
export type StrictExtract<T, U extends T> = U;

/** Record with string keys and typed values */
export type StringRecord<T = unknown> = Record<string, T>;

/** Prettify - forces IDE to expand type for readability */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
