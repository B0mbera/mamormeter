import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.drinkPreset.deleteMany();

  const presets = [
    // === Sörök (5dl) ===
    { name: "Világos sör 5dl", nameEn: "Lager 5dl", ml: 500, alcoholPct: 4.6, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Prémium sör 5dl", nameEn: "Premium Lager 5dl", ml: 500, alcoholPct: 5.0, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Heineken 5dl", nameEn: "Heineken 5dl", ml: 500, alcoholPct: 5.0, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },

    // === Tömény ===
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

    // === Egyéb ===
    { name: "Terea", nameEn: "Terea", ml: 0, alcoholPct: 0, category: "Egyéb", categoryEn: "Other", emoji: "🚬" },
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
