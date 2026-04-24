# Base stage with common setup
FROM node:24.15.0-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Set working directory
WORKDIR /app

# Dependencies stage
FROM base AS dependencies

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install all dependencies and generate Prisma client
RUN pnpm install --frozen-lockfile && \
    pnpm exec prisma generate

# Build stage
FROM base AS builder

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Build TypeScript
RUN pnpm build

# Production stage
FROM base AS production

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy generated Prisma client from dependencies stage
COPY --from=dependencies /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist/

# Change ownership to node user and cleanup in single layer
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
