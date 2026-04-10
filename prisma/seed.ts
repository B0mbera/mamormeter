import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.drinkPreset.deleteMany();

  const presets = [
    // === Sörök (Pécsi sörök, 2dl és 4dl) ===
    { name: "Pécsi Világos 2dl", nameEn: "Pécsi Lager 2dl", ml: 200, alcoholPct: 4.6, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Pécsi Világos 4dl", nameEn: "Pécsi Lager 4dl", ml: 400, alcoholPct: 4.6, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Pécsi Prémium 2dl", nameEn: "Pécsi Premium 2dl", ml: 200, alcoholPct: 5.0, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Pécsi Prémium 4dl", nameEn: "Pécsi Premium 4dl", ml: 400, alcoholPct: 5.0, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Szalonka 2dl", nameEn: "Szalonka 2dl", ml: 200, alcoholPct: 5.2, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Szalonka 4dl", nameEn: "Szalonka 4dl", ml: 400, alcoholPct: 5.2, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },

    // === Tömény (Medikus Kupa klasszikusok) ===
    { name: "Jägermeister", nameEn: "Jägermeister", ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🦌" },
    { name: "Bumbu Rum", nameEn: "Bumbu Rum", ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🏝️" },
    { name: "Vodka", nameEn: "Vodka", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Tequila", nameEn: "Tequila", ml: 40, alcoholPct: 38, category: "Tömény", categoryEn: "Spirits", emoji: "🌵" },
    { name: "Pálinka", nameEn: "Pálinka", ml: 40, alcoholPct: 48, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Unicum", nameEn: "Unicum", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },

    // === Bor ===
    { name: "Fröccs", nameEn: "Wine Spritzer", ml: 200, alcoholPct: 6, category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Bor", nameEn: "Wine", ml: 150, alcoholPct: 13, category: "Bor", categoryEn: "Wine", emoji: "🍷" },

    // === Koktél / Long drink ===
    { name: "Vodka-Red Bull", nameEn: "Vodka Red Bull", ml: 330, alcoholPct: 8, category: "Koktél", categoryEn: "Cocktails", emoji: "⚡" },
    { name: "Jäger-Bomba", nameEn: "Jäger Bomb", ml: 330, alcoholPct: 8, category: "Koktél", categoryEn: "Cocktails", emoji: "💣" },
  ];

  for (const preset of presets) {
    await prisma.drinkPreset.create({ data: preset });
  }

  console.log(`Seeded ${presets.length} drink presets`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
