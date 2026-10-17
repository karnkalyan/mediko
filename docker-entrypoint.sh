#!/bin/sh
set -e

echo "=========================================================="
echo "  Mediko Bazaar Enterprise Healthcare Platform Starting   "
echo "=========================================================="

cd /app/backend

# Retry loop to wait for host MySQL to become available and push schema
echo "==> [Prisma] Connecting to MySQL and pushing schema..."
MAX_RETRIES=25
COUNT=0
PUSH_SUCCESS=false

while [ "$COUNT" -lt "$MAX_RETRIES" ]; do
  # Attempt schema push with accept-data-loss
  OUTPUT=$(npx prisma db push --skip-generate --accept-data-loss 2>&1)
  STATUS=$?

  if [ $STATUS -eq 0 ]; then
    echo "$OUTPUT"
    PUSH_SUCCESS=true
    break
  fi

  # Check if failure is due to unexecutable migration changes on existing tables
  if echo "$OUTPUT" | grep -q -- "--force-reset"; then
    echo "$OUTPUT"
    if [ "${PRISMA_FORCE_RESET:-true}" = "true" ]; then
      echo "==> [Prisma] Incompatible table schema detected. Applying prisma db push --force-reset..."
      npx prisma db push --skip-generate --force-reset
      PUSH_SUCCESS=true
      break
    else
      echo "==> [Error] Prisma push requires --force-reset, but PRISMA_FORCE_RESET is set to false."
      exit 1
    fi
  fi

  COUNT=$((COUNT + 1))
  echo "$OUTPUT"
  echo "==> MySQL not ready yet. Retrying in 3 seconds... ($COUNT/$MAX_RETRIES)"
  sleep 3
done

if [ "$PUSH_SUCCESS" != "true" ]; then
  echo "==> [Error] Failed to connect or push schema to MySQL after $MAX_RETRIES attempts."
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
