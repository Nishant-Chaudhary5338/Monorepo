/**
 * Module-level auth store.
 *
 * React Router v7 loaders run outside of React's component tree, so they
 * cannot access the AuthContext. This store mirrors auth state so loaders
 * can access user info (e.g., for adding auth headers to fetch calls).
 *
 * Updated by AuthContext whenever auth state changes.
 */

interface AuthStoreState {
  isAuthenticated: boolean
  user: any
}

let _state: AuthStoreState = {
  isAuthenticated: false,
  user: null,
}

export const authStore = {
  get isAuthenticated() {
    return _state.isAuthenticated
  },
  get user() {
    return _state.user
  },
  set(next: AuthStoreState) {
    _state = next
  },
  getState(): AuthStoreState {
    return _state
  },
}
