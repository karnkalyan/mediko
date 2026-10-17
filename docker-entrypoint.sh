#!/bin/sh
set -e

echo "=========================================================="
echo "  Mediko Bazaar Enterprise Healthcare Platform Starting   "
echo "=========================================================="

cd /app/backend

# Retry loop to wait for host MySQL to become available and push schema
echo "==> [Prisma] Connecting to MySQL and synchronizing schema..."
MAX_RETRIES=20
COUNT=0
SYNCED=false

# Temporarily disable set -e so failures during connection retry or schema reset don't kill the container
set +e

while [ "$COUNT" -lt "$MAX_RETRIES" ]; do
  # 1. Attempt standard schema push with accept-data-loss
  if npx prisma db push --skip-generate --accept-data-loss; then
    SYNCED=true
    break
  fi

  # 2. If standard push failed, check if --force-reset resolves incompatible legacy schema
  echo "==> [Prisma] Standard push encountered schema conflicts. Attempting --force-reset..."
  if npx prisma db push --skip-generate --force-reset; then
    SYNCED=true
    break
  fi

  COUNT=$((COUNT + 1))
  echo "==> MySQL not ready yet. Retrying in 3 seconds... ($COUNT/$MAX_RETRIES)"
  sleep 3
done

# Re-enable set -e
set -e

if [ "$SYNCED" != "true" ]; then
  echo "==> [Error] Failed to connect or synchronize with MySQL after $MAX_RETRIES attempts."
  exit 1
fi
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
