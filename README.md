# Inventory POS

Local full-stack inventory + POS for a small food business.

## Stack

- Next.js (App Router)
- shadcn/ui
- Prisma 7 + MySQL
- Auth.js (credentials)

## Quick start

```bash
# 1. Start MySQL
docker compose up -d

# 2. Install deps
npm install

# 3. Copy env (already present as .env for local)
cp .env.example .env

# 4. Migrate + seed
npx prisma migrate dev
npx prisma db seed

# 5. Run app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seeded logins

| Email | Password | Role |
| --- | --- | --- |
| owner@local.dev | password123 | OWNER |
| cashier@local.dev | password123 | CASHIER |

## Features in this MVP

- Product catalog (SKU-only, optional product images)
- Shop branding (title, logo, colors) via Owner Settings
- Inventory adjustments with reasons
- Tablet-friendly POS checkout with manual payment methods: Cash, QRPh, GCash, Maya, Card, Other
- Sales history + dashboard snapshot
- Role-aware navigation (cashier focuses on POS/sales)
- Optional HTTP Basic Auth gate for protecting a LAN/server install

## HTTP Basic Auth (shop server)

Set both variables in `.env` on the machine that hosts the app:

```bash
BASIC_AUTH_USER="shop"
BASIC_AUTH_PASSWORD="choose-a-strong-password"
```

Browsers will prompt once, then staff still sign in with Owner/Cashier accounts. Leave both empty for local development without the prompt. Prefer Tailscale/VPN or TLS termination (nginx/Caddy) for anything beyond a trusted LAN.

## Notes

- Money is stored as integer centavos
- Stock changes happen inside Prisma transactions with sales
- Uploaded logos/images live under `public/uploads/` (gitignored)
- Online payment gateways are intentionally out of scope for now
