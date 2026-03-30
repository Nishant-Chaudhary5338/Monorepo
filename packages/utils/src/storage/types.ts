export interface StorageConfig<T> {
  key: string;
  storage?: 'local' | 'session';
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  defaultValue?: T;
}

export interface EncryptedStorageConfig {
  key: string;
  secret: string;
}

export interface TypedStorage<T> {
  get: () => T | undefined;
  set: (value: T) => void;
  remove: () => void;
  clear: () => void;
}

export interface AsyncTypedStorage<T> {
  get: () => Promise<T | undefined>;
  set: (value: T) => Promise<void>;
  remove: () => void;
  clear: () => void;
}
