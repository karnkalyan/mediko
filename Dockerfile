FROM node:20-bookworm-slim

# Install system dependencies (OpenSSL required by Prisma engine)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY backend/package.json backend/package-lock.json ./backend/
COPY backend/prisma ./backend/prisma/

# Install root frontend dependencies and backend dependencies
RUN npm ci
RUN cd backend && npm ci

# Copy entire application source code
COPY . .

# Build Vite React frontend (generates /app/dist)
RUN npm run build

# Generate Prisma Client in backend
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"
RUN cd backend && npx prisma generate

# Copy entrypoint script and ensure executable permissions
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3081

ENV NODE_ENV=production
ENV PORT=3081
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "backend/src/server.js"]
