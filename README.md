# Inventory POS

Multi-tenant inventory + POS for food businesses. Each shop gets its own organization, staff roles, recipes, and kitchen flow.

## Stack

- Next.js (App Router)
- Supabase (Auth, Postgres, Storage, RLS)
- shadcn/ui + Tailwind CSS
- pnpm

## Quick start

```bash
# 1. Install deps
pnpm install

# 2. Configure env
cp .env.example .env
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
# Optionally set DATABASE_URL (and SUPABASE_SERVICE_ROLE_KEY for admin scripts)

# 3. Apply SQL migrations (needs DATABASE_URL)
pnpm db:migrate

# 4. Run the app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### First login

There is no fixed seed user. Register a new account, create an organization on onboarding, then invite staff from **Team** (Owner).

| Role | Typical access |
| --- | --- |
| OWNER | Catalog, inventory, recipes, settings, team, POS |
| CASHIER | POS, sales |
| COOK | Kitchen board |

## Features

- Multi-tenant orgs with RLS isolation
- Product catalog (SKU, images, categories) with recipe / food-cost BOM
- Ingredients, sub-recipes, and opening-stock guidance from makeable portions
- Inventory adjustments with movement history
- Tablet-friendly POS (Cash, QRPh, GCash, Maya, Card, Other)
- Checkout deducts finished-goods stock and recipe ingredients
- Kitchen tickets for cook-facing prep
- Sales history + dashboard snapshot
- Shop branding (title, logo, colors, currency)
- Optional platform-admin support console

## Quality checks

```bash
pnpm typecheck
pnpm test
pnpm quality   # typecheck + fallow + test
```

## Notes

- Money is stored as integer centavos (₱)
- Uploaded logos/product images go to the Supabase `uploads` storage bucket
- Online payment gateways are intentionally out of scope for now
- See `.env.example` for all supported environment variables
