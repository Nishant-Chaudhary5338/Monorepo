# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Production — web-app-1
# Build: docker build -f apps/web/web-app-1/Dockerfile .
# Final image: nginx:alpine + /dist  (~20–40 MB)
# ─────────────────────────────────────────────────────────────────────────────

# ── BASE ─────────────────────────────────────────────────────────────────────
# node:20-alpine (~59 MB) vs node:20-slim (~213 MB) — saves ~150 MB per layer
FROM node:20-alpine AS base
# libc6-compat: required on Alpine for Node.js native bindings
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Pin turbo to the same major version as root package.json (^2.8.20)
RUN pnpm add -g turbo@2

# ── PRUNER ───────────────────────────────────────────────────────────────────
# turbo prune extracts ONLY the packages web-app-1 depends on.
#   out/json/ → package.json files + lockfile  (dep-install cache layer)
#   out/full/ → full pruned source             (build layer)
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune web-app-1 --docker

# ── INSTALLER ────────────────────────────────────────────────────────────────
# Copy manifests first — this layer only rebuilds when deps change, not source.
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
# BuildKit cache mount: pnpm store persists across builds → faster CI
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── BUILDER ──────────────────────────────────────────────────────────────────
# turbo respects "dependsOn: [^build]" — @repo/ui and other workspace
# packages are built automatically before web-app-1's vite build runs.
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=web-app-1

# ── RUNNER ───────────────────────────────────────────────────────────────────
# nginx:alpine ≈ 11 MB. Only dist/ lands here — no Node.js, no source.
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/web-app-1/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Brotli/gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml text/javascript image/svg+xml;

    # Vite fingerprints all static assets — cache them for 1 year
    location ~* \.(js|css|woff|woff2|ttf|eot|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Images: shorter cache (may be updated without hash change)
    location ~* \.(png|jpg|jpeg|gif|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # SPA routing — all paths fall back to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
