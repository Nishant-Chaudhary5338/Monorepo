# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
# Production — 3d-portfolio  (package: three-d-portfolio-2025)
# Heavy deps: three.js, @react-three/fiber, gsap — expect larger dist/
# Build: docker build -f apps/web/3d-portfolio/Dockerfile .
# Final image: nginx:alpine + /dist  (~50–150 MB with 3D assets)
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm add -g turbo@2

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune three-d-portfolio-2025 --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=three-d-portfolio-2025

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/3d-portfolio/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml text/javascript image/svg+xml;

    # 3D assets (glTF, draco, HDR) — long cache, content-addressed
    location ~* \.(glb|gltf|bin|hdr|ktx2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(js|css|woff|woff2|ttf|eot|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(png|jpg|jpeg|gif|webp)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
