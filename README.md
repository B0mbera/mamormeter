# MámorMéter 🍻

Valós idejű alkoholfogyasztás követő — Real-time alcohol consumption tracker.

## Funkciók / Features

- **Widmark-formula** alapú promille számítás / BAC calculation
- **Gyors hozzáadás** egy kattintással / Quick-add drinks
- **Valós idejű grafikon** / Real-time promille chart
- **Ranglétra** - 24 órás + örökös / Leaderboard - 24h + All-time
- **Medikus Kupa mód** - DOTE, POTE, SOTE, SZOTE választás / University selection
- **Magyar / Angol** nyelvváltás / HU/EN language toggle
- **1 perces cooldown** anti-abuse védelem / 60-sec cooldown
- **Támogatás oldal** Revoluttal / Support page with Revolut

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **Recharts**
- **Zustand** (state management)
- **Prisma** + PostgreSQL (Neon.tech ajánlott)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOURUSERNAME/mamor-meter)

### Environment Variables

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string (Neon.tech) |
| `DIRECT_URL`          | Direct PostgreSQL URL (Neon.tech)        |
| `NEXT_PUBLIC_EDITION` | `base` vagy `medikus`                    |

### Setup

```bash
# Install
npm install

# Setup DB
npx prisma generate
npx prisma db push
npx prisma db seed

# Dev
npm run dev
```

### Editions

- **base**: Standard MámorMéter
- **medikus**: 53. Medikus Kupa themed (Pécs 2026, university selection)

Set `NEXT_PUBLIC_EDITION=medikus` for the Medikus Kupa version.
