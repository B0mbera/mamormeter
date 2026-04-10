import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.drinkPreset.deleteMany();

  const presets = [
    { name: "Dobozos sör", nameEn: "Canned beer", ml: 500, alcoholPct: 5.0, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Prémium sör", nameEn: "Premium beer", ml: 500, alcoholPct: 5.2, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Craft IPA", nameEn: "Craft IPA", ml: 330, alcoholPct: 6.5, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Guinness", nameEn: "Guinness", ml: 440, alcoholPct: 4.2, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Kapucinus", nameEn: "Kapucinus", ml: 500, alcoholPct: 5.4, category: "Sörök", categoryEn: "Beers", emoji: "🍺" },
    { name: "Jägermeister", nameEn: "Jägermeister", ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Bumbu Rum", nameEn: "Bumbu Rum", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Jack Daniel's", nameEn: "Jack Daniel's", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Jameson", nameEn: "Jameson", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Vodka", nameEn: "Vodka", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Tequila", nameEn: "Tequila", ml: 40, alcoholPct: 38, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Gin", nameEn: "Gin", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Pálinka", nameEn: "Pálinka", ml: 50, alcoholPct: 52, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Absinth", nameEn: "Absinthe", ml: 30, alcoholPct: 70, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Unicum", nameEn: "Unicum", ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Vörösbor", nameEn: "Red wine", ml: 150, alcoholPct: 13, category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Pezsgő", nameEn: "Champagne", ml: 120, alcoholPct: 11, category: "Bor", categoryEn: "Wine", emoji: "🥂" },
    { name: "Fehérbor", nameEn: "White wine", ml: 150, alcoholPct: 12, category: "Bor", categoryEn: "Wine", emoji: "🍾" },
    { name: "Fröccs", nameEn: "Wine spritzer", ml: 200, alcoholPct: 6, category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Mojito", nameEn: "Mojito", ml: 250, alcoholPct: 8, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
    { name: "Long Island", nameEn: "Long Island", ml: 300, alcoholPct: 22, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
    { name: "Gin Tonic", nameEn: "Gin & Tonic", ml: 250, alcoholPct: 10, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
    { name: "Vodka-Red Bull", nameEn: "Vodka Red Bull", ml: 330, alcoholPct: 8, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
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
