# Mediko Bazaar — B2B Healthcare & Medical Equipment Marketplace

A modern full-stack medical equipment marketplace and procurement portal built with **React, Vite, Tailwind CSS, Node.js / Express, Prisma ORM and MySQL**.

## Features

- **Medical Marketplace & Catalog**: ICU ventilators, ultrasound systems, patient monitors, surgical tables, consumables and spare parts.
- **Biomedical Services & Equipment Rental**: Service requests, calibration logs, certified biomedical engineers, and rental equipment booking.
- **Landed Cost Estimator**: Automatic calculation of CIF, customs duty, VAT, freight, port handling, and landed unit cost.
- **Quotations & Invoicing**: Formal medical quotes, proforma invoices, order management, and multi-currency PDF export.
- **Role-based Authentication**: Super Admin, Certified Vendors, International Sellers, Biomedical Engineers, and Hospital Procurement buyers with HTTP-only JWT cookies.
- **Live Real-time Support Chat**: Built-in WebSocket customer support channel.

---

## Production Deployment with Docker Compose

This deployment connects directly to your existing host MySQL server running on the VPS:

```bash
# 1. Clone repository
git clone https://github.com/karnkalyan/mediko.git
cd mediko

# 2. Ensure MySQL has the 'medico' database created on the host
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Build and launch container
docker compose up -d --build
```

### What happens automatically:
1. Docker connects to your host MySQL at `host.docker.internal:3306/medico`.
2. Prisma pushes the schema (`prisma db push`).
3. Master seed script (`prisma/seed.js`) seeds all initial users, medical categories, products, quotations, rentals, and engineering bookings.
4. Express serves the backend REST APIs + WebSocket chat and the Vite React frontend on **port 3081** (`https://mediko.simulcast.com.np`).

### Default Seed Credentials
- **Super Admin**: `admin@medikobazaar.com` / `Mediko@2026`
- **Vendor Partner**: `meditech@nepalmed.com` / `Mediko@2026`
- **International Seller**: `sales@globalmindray.com` / `Mediko@2026`
- **Biomedical Engineer**: `er.suman@medikobazaar.com` / `Mediko@2026`
