# @repo/router — Usage Examples

## Minimal Setup

```tsx
// src/routes.config.tsx
import { createRouter } from '@repo/router'

export const router = createRouter({
  routes: [
    { path: '/', component: () => import('./pages/Home') },
    { path: '/about', component: () => import('./pages/About') },
  ],
})

// src/App.tsx
import { RouterProvider } from '@repo/router'
import { router } from './routes.config'

export default function App() {
  return <RouterProvider router={router} />
}
```

---

## Full Production Example

```tsx
// src/routes.config.tsx
import { createRouter, analyticsPlugin } from '@repo/router'
import { DashboardLayout } from './layouts/DashboardLayout'
import GlobalLoader from './components/GlobalLoader'
import GlobalError from './components/GlobalError'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

export const router = createRouter({

  auth: {
    check: () => Boolean(localStorage.getItem('token')),
    user: () => JSON.parse(localStorage.getItem('user') ?? 'null'),
    redirectTo: '/login',
    unauthorizedRedirect: '/403',
  },

  fallback: {
    loading:      <GlobalLoader />,
    error:        <GlobalError />,
    notFound:     <NotFound />,
    unauthorized: <Unauthorized />,
    empty:        <div>No results found.</div>,
  },

  hooks: {
    afterEach: (to) => {
      document.title = to.meta?.title ? `${to.meta.title} | MyApp` : 'MyApp'
    },
    onError: (error, route) => {
      console.error(`Route error on ${route.path}:`, error)
    },
  },

  plugins: [
    analyticsPlugin({ track: (route) => analytics.page(route.path) }),
  ],

  routes: [
    // Public
    { path: '/', component: () => import('./pages/Landing'), meta: { title: 'Home' } },

    // Guest-only (logged in users get bounced to /dashboard)
    { path: '/login',    component: () => import('./pages/Login'),    type: 'guest', redirectIfAuth: '/dashboard' },
    { path: '/register', component: () => import('./pages/Register'), type: 'guest', redirectIfAuth: '/dashboard' },

    // Protected with layout
    {
      path: '/dashboard',
      type: 'protected',
      layout: DashboardLayout,
      meta: { title: 'Dashboard' },
      children: [
        {
          index: true,
          component: () => import('./pages/Dashboard/Home'),
          loader: { url: '/api/dashboard/summary' },
        },
        {
          path: 'users',
          component: () => import('./pages/Dashboard/Users'),
          roles: ['admin', 'manager'],
          loader: {
            url: '/api/users',
            polling: 30_000,
          },
          emptyWhen: (data) => data.length === 0,
          empty: <div>No users found.</div>,
        },
        {
          path: 'users/:id',
          component: () => import('./pages/Dashboard/UserDetail'),
          loader: {
            fn: ({ params }) => fetch(`/api/users/${params.id}`).then(r => r.json()),
          },
          guard: async ({ params, user }) => {
            if (user.id !== params.id && !user.roles?.includes('admin')) {
              return '/403'
            }
          },
        },
        {
          path: 'settings',
          component: () => import('./pages/Dashboard/Settings'),
          permissions: ['settings.read'],
          meta: { title: 'Settings' },
        },
      ],
    },

    // Role-based different views
    {
      path: '/home',
      type: 'protected',
      roleViews: {
        admin:   () => import('./pages/Home/AdminHome'),
        manager: () => import('./pages/Home/ManagerHome'),
        user:    () => import('./pages/Home/UserHome'),
      },
      fallbackView: () => import('./pages/Home/DefaultHome'),
    },

    // Admin section
    {
      path: '/admin',
      type: 'protected',
      roles: ['admin'],
      component: () => import('./pages/Admin'),
      unauthorized: <div>Admins only.</div>,
    },

    // Redirects
    { path: '/old-path', redirect: '/new-path' },

    // Utility
    { path: '/403', component: () => import('./pages/Forbidden') },
    { path: '/maintenance', component: () => import('./pages/Maintenance') },
  ],
})
```

---

## Using Hooks

```tsx
import { useRouter, useAuth, useRouteData, useBreadcrumbs } from '@repo/router'

function DashboardPage() {
  const { navigate, params, pathname } = useRouter()
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth()
  const { data, isLoading, error, refetch } = useRouteData<DashboardData>()
  const breadcrumbs = useBreadcrumbs()

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {/* Breadcrumbs */}
      <nav>
        {breadcrumbs.map(bc => (
          <span key={bc.path} className={bc.isActive ? 'font-bold' : ''}>
            {bc.label}
          </span>
        ))}
      </nav>

      {/* Role-gated UI */}
      {hasRole('admin') && <AdminPanel />}
      {hasPermission('billing.write') && <BillingButton />}

      {/* Loader data */}
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <button onClick={() => navigate('/settings')}>Settings</button>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

---

## Inline Guard Component

```tsx
import { Guard } from '@repo/router'

function Sidebar() {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>

      <Guard roles={['admin', 'manager']}>
        <Link to="/users">Users</Link>
      </Guard>

      <Guard permissions={['billing.read']}>
        <Link to="/billing">Billing</Link>
      </Guard>

      <Guard authenticated fallback={<Link to="/login">Login</Link>}>
        <UserMenu />
      </Guard>
    </nav>
  )
}
```

---

## Enhanced Link

```tsx
import { Link } from '@repo/router'

// Active styling
<Link to="/dashboard" activeClass="text-blue-600 font-semibold">
  Dashboard
</Link>

// Prefetch on hover (triggers lazy component load)
<Link to="/heavy-page" prefetch="hover">
  Heavy Page
</Link>

// Prefetch immediately on render
<Link to="/next-step" prefetch="render">
  Continue
</Link>
```

---

## Layouts with Outlet

```tsx
// layouts/DashboardLayout.tsx
import { Outlet } from '@repo/router'

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />  {/* children render here */}
      </main>
    </div>
  )
}
```

---

## Custom Plugin

```tsx
import type { RouterPlugin } from '@repo/router'

const maintenanceModePlugin = (active: boolean): RouterPlugin => ({
  name: 'maintenance-mode',
  onMount() {
    if (active) console.warn('App is in maintenance mode')
  },
  onRouteChange(to) {
    if (active && to.path !== '/maintenance') {
      window.location.href = '/maintenance'
    }
  },
})

const router = createRouter({
  plugins: [maintenanceModePlugin(featureFlags.maintenance)],
  routes: [...],
})
```

---

## Adding to an App

```json
// apps/web/web-app-1/package.json
{
  "dependencies": {
    "@repo/router": "workspace:*",
    "react-router": "^7.0.0"
  }
}
```

```bash
pnpm install
```
