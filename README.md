# MámorMéter 🗳️🍻

Valós idejű promille tracker a **2026-os országgyűlési választásra** (Április 12.).

> **Éles app:** [mamormeter.vercel.app](https://mamormeter.vercel.app)

## Funkciók

- **Widmark-formula** promille számítás — nemre és testsúlyra kalibrált
- **Gyors hozzáadás** — 13 preset ital (Sör, Heineken, Jäger, stb.)
- **Valós idejű promille görbe** — Recharts grafikon
- **Ranglétra** — 24 órás + örökös, párt szűrővel (FIDESZ / TISZA / Mi Hazánk / DK / MKKP)
- **Regisztráció nélküli ranglétra** — vendégek is megtekinthetik
- **Sötét mód** — persistent toggle minden oldalon
- **Magyar / Angol** nyelvváltás
- **Profanity filter** — csúnya nevek szűrése (HU + EN)
- **1 perces cooldown** anti-spam védelem
- **OG kép + favicon** — link preview és böngésző ikon
- **Támogatás oldal** — Revolut link

## Tech Stack

| Réteg               | Technológia                          |
| ------------------- | ------------------------------------ |
| **Framework**       | Next.js 14 (App Router, TypeScript)  |
| **UI**              | Tailwind CSS + shadcn/ui             |
| **Grafikonok**      | Recharts                             |
| **State**           | Zustand (persist middleware)         |
| **Adatbázis**       | PostgreSQL (Neon.tech, serverless)   |
| **ORM**             | Prisma 5                             |
| **Hosting**         | Vercel                               |
| **Dinamikus képek** | next/og ImageResponse (Edge Runtime) |

## Projekt struktúra

```
app/
├── page.tsx              # Landing oldal
├── onboarding/           # Profil létrehozás
├── dashboard/            # Fő műszerfal + promille görbe
├── add/                  # Ital hozzáadás (presetek + egyedi)
├── leaderboard/          # Ranglétra (24h / örökös)
├── support/              # Támogatás (Revolut)
├── api/
│   ├── users/            # POST create, GET [id] + promille
│   ├── drinks/           # POST add, DELETE [id]
│   ├── presets/          # GET 13 ital preset
│   └── leaderboard/      # GET ranglétra (szűrők)
├── icon.tsx              # Dinamikus PNG favicon (32×32)
├── apple-icon.tsx        # Apple Touch Icon (180×180)
└── opengraph-image.tsx   # OG kép (1200×630)

lib/
├── widmark.ts            # Promille számítás (Widmark-formula)
├── profanity.ts          # Csúnya szó szűrő
├── i18n.ts               # Magyar / Angol fordítások
├── constants.ts          # Pártok, kategóriák
└── prisma.ts             # Prisma client singleton

store/
├── useUserStore.ts       # User ID (localStorage)
├── useLanguageStore.ts   # Nyelv (persist)
└── useThemeStore.ts      # Sötét mód (persist)

prisma/
├── schema.prisma         # User, Drink, DrinkPreset modellek
└── seed.ts               # 13 preset ital
```

## Deploy

### Environment Variables

| Variable       | Leírás                                   |
| -------------- | ---------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (Neon.tech) |
| `DIRECT_URL`   | Direct PostgreSQL URL (Neon.tech)        |

### Setup

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### Production deploy

```bash
npx vercel --prod
```
