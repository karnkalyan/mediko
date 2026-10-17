#!/bin/sh
set -e

echo "=========================================================="
echo "  Mediko Bazaar Enterprise Healthcare Platform Starting   "
echo "=========================================================="

cd /app/backend

# Retry loop to wait for host MySQL to become available
echo "==> [Prisma] Connecting to MySQL and pushing schema..."
MAX_RETRIES=25
COUNT=0
until npx prisma db push --skip-generate --accept-data-loss; do
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
    echo "==> [Error] Failed to connect to MySQL after $MAX_RETRIES attempts. Check DATABASE_URL and host network."
    exit 1
  fi
  echo "==> MySQL not ready yet. Retrying in 3 seconds... ($COUNT/$MAX_RETRIES)"
  sleep 3
done
echo "==> [Prisma] Database schema is up to date!"

# Run master seed if enabled
if [ "${SEED_ON_STARTUP:-true}" = "true" ]; then
  echo "==> [Seed] Executing Mediko master seed script (prisma/seed.js)..."
  node prisma/seed.js || echo "==> [Notice] Seed completed with warnings or was already initialized."
else
  echo "==> [Seed] SEED_ON_STARTUP is false. Skipping seed data."
fi

cd /app
echo "==> Starting Mediko Bazaar server on port ${PORT:-3081}..."
exec "$@"
