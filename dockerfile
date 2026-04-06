# Use the official Node.js 20 Alpine image as base
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Use npm install if package-lock.json doesn't exist, otherwise use npm ci
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js necesita NEXT_PUBLIC_* variables durante el build
# IMPORTANTE: Estas variables se incrustan en el código JavaScript durante el build
# Por lo tanto, deben pasarse como BUILD ARGUMENT en Easy Panel, no solo como variable de entorno
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Si no se proporciona el build arg, intentar usar variable de entorno como fallback
# (aunque esto normalmente no funcionará porque Next.js necesita la variable en build time)
RUN if [ -z "$NEXT_PUBLIC_API_URL" ]; then \
      echo "⚠️ WARNING: NEXT_PUBLIC_API_URL no está definida. Usando valor por defecto."; \
    else \
      echo "✅ Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"; \
    fi

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]