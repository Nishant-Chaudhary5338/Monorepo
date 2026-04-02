import { createRouter } from '@repo/router'

export const router = createRouter({

  auth: {
    // Pretend a token in localStorage = logged in
    check: () => Boolean(localStorage.getItem('token')),
    user:  () => JSON.parse(localStorage.getItem('user') ?? 'null'),
    redirectTo: '/',  // unauthenticated users trying /dashboard → go here
  },

  fallback: {
    loading:  <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>,
    notFound: <div className="flex h-screen items-center justify-center text-4xl font-bold">404 — Not Found</div>,
  },

  routes: [
    // Public
    { path: '/',       component: () => import('./pages/Home') },
    { path: '/about',  component: () => import('./pages/About') },

    // Protected — try visiting /dashboard while logged out
    { path: '/dashboard', type: 'protected', component: () => import('./pages/Dashboard') },
  ],

})
