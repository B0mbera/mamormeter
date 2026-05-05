# EFOTT Ivásszámláló 🎪🍻

Valós idejű promille tracker az **EFOTT fesztiválra** — versenyezz az egyetemed színeiben!

## Funkciók

- **Widmark-formula** promille számítás — nemre és testsúlyra kalibrált
- **Reálisabb magyar italok** — kisfröccs, nagyfröccs, hosszúlépés, korsó, 4cl pálinka, koktélok
- **Valós idejű promille görbe** — Recharts grafikon
- **Top 4 egyetem ranglétra** — 24 órás + örökös, top 10 magyar egyetem között
- **Prevenciós tippek minden szinten** — víz, étel, taxi, segítséghívás
- **„Egyéb" egyetem** szabad szöveggel + „Nem egyetemista" opció
- **Regisztráció nélküli ranglétra** — vendégek is megtekinthetik
- **Sötét mód** — persistent toggle minden oldalon
- **Magyar / Angol** nyelvváltás
- **Profanity filter** — csúnya nevek/egyetemnevek szűrése (HU + EN)
- **6‰ biztonsági cap** — klinikai határ feletti BAC nem rögzíthető

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

## Projekt struktúra

```
app/
├── page.tsx              # Landing oldal
├── onboarding/           # Profil + egyetem választás
├── dashboard/            # Fő műszerfal + promille görbe + prevenciós tipp
├── add/                  # Ital hozzáadás (presetek + egyedi)
├── leaderboard/          # Ranglétra (24h / örökös, top 4 egyetem)
├── support/              # Támogatás (Revolut)
└── api/                  # users, drinks, presets, leaderboard

lib/
├── widmark.ts            # Promille számítás + prevenciós severity
├── profanity.ts          # Csúnya szó szűrő
├── i18n.ts               # Magyar / Angol fordítások + prevenciós üzenetek
├── universities.ts       # Top 10 magyar egyetem + helperek
└── constants.ts          # Limitek, cooldown

prisma/
├── schema.prisma         # User, Drink, DrinkPreset modellek
├── seed.ts               # ~40 magyaros ital preset
└── reset-users.ts        # User+Drink reset (presetek érintetlenek)
```

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Adatbázis reset (csak User+Drink, presetek megmaradnak)

```bash
npm run db:reset-users
```

### Production deploy

```bash
npx vercel --prod
```
