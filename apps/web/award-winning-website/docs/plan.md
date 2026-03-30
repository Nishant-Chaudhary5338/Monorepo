# Award Winning Website — Modernization Plan

## Overview
Modernize the `award-winning-website` app from a copy-paste JavaScript tutorial project to a production-quality TypeScript app integrated with Turborepo.

## Current State
- **Language:** JavaScript (`.jsx` files), no TypeScript
- **React:** 18.3.1
- **Vite:** 5.4.10
- **Tailwind:** 3.4.14
- **Package Manager:** package-lock.json (not pnpm)
- **Dependencies:** `react-use` for single hook, `gsap`, `@gsap/react`
- **Issues:** No types, no lazy loading, hardcoded values, copy-paste patterns

## Phase 1: TypeScript Migration
- [ ] Rename all `.jsx` files to `.tsx`
- [ ] Create `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- [ ] Create `vite-env.d.ts`
- [ ] Create `src/types/index.ts` with component prop interfaces
- [ ] Update `package.json` — add TypeScript deps, update build script
- [ ] Rename `vite.config.js` to `vite.config.ts`
- [ ] Add type annotations to all components

## Phase 2: Package Upgrades & Turbo Config
- [ ] Upgrade React to 19, Vite to 6, Tailwind to 4
- [ ] Remove `package-lock.json`, switch to pnpm
- [ ] Update package name to `award-winning-website`
- [ ] Add `@types/node` for Vite config typing
- [ ] Update `eslint.config.js` to `.mjs` pattern

## Phase 3: Performance Improvements
- [ ] Lazy load videos — only load first hero video, others on interaction
- [ ] Add `loading="lazy"` and `decoding="async"` to images
- [ ] Use `React.lazy` for below-fold sections
- [ ] Remove `react-use` — create custom `useWindowScroll` hook
- [ ] Add `<link rel="preload">` for critical fonts/videos in `index.html`

## Phase 4: Code Quality
- [ ] Extract hardcoded values into `src/constants/` directory
- [ ] Replace `dangerouslySetInnerHTML` in `AnimatedTitle` with safe markup
- [ ] Create `src/hooks/` directory with reusable hooks
- [ ] Add proper error handling

## Files to Create/Modify
| File | Action |
|------|--------|
| `docs/plan.md` | Create |
| `tsconfig.json` | Create |
| `tsconfig.app.json` | Create |
| `tsconfig.node.json` | Create |
| `src/vite-env.d.ts` | Create |
| `src/types/index.ts` | Create |
| `src/constants/videoPaths.ts` | Create |
| `src/constants/navItems.ts` | Create |
| `src/hooks/useWindowScroll.ts` | Create |
| `package.json` | Update |
| `vite.config.js` → `vite.config.ts` | Rename + Update |
| `eslint.config.js` → `eslint.config.mjs` | Rename |
| `index.html` | Update (preload tags) |
| `src/main.jsx` → `src/main.tsx` | Rename + Update |
| `src/App.jsx` → `src/App.tsx` | Rename + Update |
| All 9 components `.jsx` → `.tsx` | Rename + Update |
| `package-lock.json` | Delete |

## Verification
- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` succeeds with TypeScript compilation
- [ ] `pnpm lint` passes