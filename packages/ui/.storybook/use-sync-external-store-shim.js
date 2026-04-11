// React 19 ships useSyncExternalStore natively.
// This ESM re-export replaces the CJS shim that Vite can't serve as ESM.
export { useSyncExternalStore } from 'react';
