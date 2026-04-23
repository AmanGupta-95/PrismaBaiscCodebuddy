# Base stage with common setup
FROM node:24.15.0-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Set working directory
WORKDIR /app

# Build stage
FROM base AS builder

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm exec prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN pnpm build

# Production stage
FROM base AS production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client from builder
COPY --from=builder /app/generated ./generated

# Copy prisma schema (needed at runtime for some Prisma features)
COPY prisma ./prisma

# Change ownership to node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]
