# Build Stage
FROM node:23-slim AS builder

WORKDIR /app

# Only copy package.json first to take advantage of Docker cache
COPY package.json package-lock.json* ./

RUN npm install

# Now copy the rest
COPY . .

RUN npm run build

# Production Stage
FROM node:23-slim AS runner

WORKDIR /app

ENV NEXT_PUBLIC_SERVER_URL="http://localhost:8080"

# Only copy what's necessary
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next .next
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["npm", "start"]
