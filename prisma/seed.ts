import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.drinkPreset.deleteMany();

  const presets = [
    // === Sörök (csapolt / üveges) ===
    { name: "Korsó sör (5dl)",       nameEn: "Pint of beer (500ml)",   ml: 500, alcoholPct: 4.6, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Pohár sör (3dl)",       nameEn: "Glass of beer (300ml)",  ml: 300, alcoholPct: 4.6, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Csapolt világos (4dl)", nameEn: "Draft lager (400ml)",    ml: 400, alcoholPct: 4.5, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Üveges sör (5dl)",      nameEn: "Bottled beer (500ml)",   ml: 500, alcoholPct: 5.0, category: "Sörök",   categoryEn: "Beers",   emoji: "🍻" },
    { name: "IPA (4dl)",             nameEn: "IPA (400ml)",            ml: 400, alcoholPct: 6.5, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Soproni 5dl",           nameEn: "Soproni 500ml",          ml: 500, alcoholPct: 4.5, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Borsodi 5dl",           nameEn: "Borsodi 500ml",          ml: 500, alcoholPct: 4.6, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Dreher 5dl",            nameEn: "Dreher 500ml",           ml: 500, alcoholPct: 5.2, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },
    { name: "Heineken 5dl",          nameEn: "Heineken 500ml",         ml: 500, alcoholPct: 5.0, category: "Sörök",   categoryEn: "Beers",   emoji: "🍺" },

    // === Fröccsök (a folyadék mennyiségéből az alkohol arányosan számolódik) ===
    // Egy átlagos magyar bor ~12% — a fröccsöt úgy modellezzük, hogy a teljes mennyiséget adjuk meg,
    // és a hígítást az alacsonyabb effektív alkoholtartalom adja.
    { name: "Kisfröccs (1dl bor + 1dl szóda)",   nameEn: "Kisfröccs (small spritzer)",     ml: 200, alcoholPct: 6.0,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },
    { name: "Nagyfröccs (2dl bor + 1dl szóda)",  nameEn: "Nagyfröccs (large spritzer)",    ml: 300, alcoholPct: 8.0,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },
    { name: "Hosszúlépés (1dl bor + 2dl szóda)", nameEn: "Hosszúlépés (long step)",        ml: 300, alcoholPct: 4.0,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },
    { name: "Házmester (3dl bor + 2dl szóda)",   nameEn: "Házmester (caretaker)",          ml: 500, alcoholPct: 7.2,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },
    { name: "Viceházmester (2dl bor + 3dl szóda)", nameEn: "Viceházmester",                ml: 500, alcoholPct: 4.8,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },
    { name: "Sportfröccs (1dl bor + 4dl szóda)", nameEn: "Sportfröccs",                    ml: 500, alcoholPct: 2.4,  category: "Fröccsök", categoryEn: "Spritzers", emoji: "🥂" },

    // === Tömény ===
    { name: "Pálinka kupica (4cl)",    nameEn: "Pálinka shot (40ml)",   ml: 40, alcoholPct: 50, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Házipálinka (4cl)",       nameEn: "Homemade Pálinka 40ml", ml: 40, alcoholPct: 52, category: "Tömény", categoryEn: "Spirits", emoji: "🔥" },
    { name: "Pálinka feles (2cl)",     nameEn: "Small pálinka (20ml)",  ml: 20, alcoholPct: 50, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Unicum (4cl)",            nameEn: "Unicum (40ml)",         ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Unicum Szilva (4cl)",     nameEn: "Unicum Plum (40ml)",    ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Vodka (4cl)",             nameEn: "Vodka (40ml)",          ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Tequila (4cl)",           nameEn: "Tequila (40ml)",        ml: 40, alcoholPct: 38, category: "Tömény", categoryEn: "Spirits", emoji: "🌵" },
    { name: "Whiskey (4cl)",           nameEn: "Whiskey (40ml)",        ml: 40, alcoholPct: 40, category: "Tömény", categoryEn: "Spirits", emoji: "🥃" },
    { name: "Jägermeister (4cl)",      nameEn: "Jägermeister (40ml)",   ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🦌" },
    { name: "Bumbu Rum (4cl)",         nameEn: "Bumbu Rum (40ml)",      ml: 40, alcoholPct: 35, category: "Tömény", categoryEn: "Spirits", emoji: "🏝️" },

    // === Bor / Pezsgő ===
    { name: "Pohár bor (1.5dl)",       nameEn: "Glass of wine (150ml)", ml: 150, alcoholPct: 12,  category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Bikavér (1.5dl)",         nameEn: "Bull's Blood (150ml)",  ml: 150, alcoholPct: 13,  category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Tokaji Aszú (1dl)",       nameEn: "Tokaji Aszú (100ml)",   ml: 100, alcoholPct: 11,  category: "Bor", categoryEn: "Wine", emoji: "🍷" },
    { name: "Pezsgő (1dl)",            nameEn: "Sparkling wine (100ml)",ml: 100, alcoholPct: 12,  category: "Bor", categoryEn: "Wine", emoji: "🥂" },

    // === Koktél / Long drink (fesztiválos) ===
    { name: "Aperol Spritz",           nameEn: "Aperol Spritz",         ml: 200, alcoholPct: 11, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
    { name: "Hugo",                    nameEn: "Hugo",                  ml: 200, alcoholPct: 8,  category: "Koktél", categoryEn: "Cocktails", emoji: "🍸" },
    { name: "Gin Tonic",               nameEn: "Gin Tonic",             ml: 300, alcoholPct: 8,  category: "Koktél", categoryEn: "Cocktails", emoji: "🍸" },
    { name: "Cuba Libre",              nameEn: "Cuba Libre",            ml: 300, alcoholPct: 10, category: "Koktél", categoryEn: "Cocktails", emoji: "🍹" },
    { name: "Vodka-Red Bull",          nameEn: "Vodka Red Bull",        ml: 330, alcoholPct: 8,  category: "Koktél", categoryEn: "Cocktails", emoji: "⚡" },
    { name: "Jäger-Bomba",             nameEn: "Jäger Bomb",            ml: 330, alcoholPct: 8,  category: "Koktél", categoryEn: "Cocktails", emoji: "💣" },

    // === Fesztivál különlegességek ===
    { name: "Sátor-pálinka (4cl házi)", nameEn: "Tent pálinka (40ml)",  ml: 40,  alcoholPct: 52, category: "Fesztivál", categoryEn: "Festival", emoji: "⛺" },
    { name: "Színpad-előtti sör (5dl)", nameEn: "Stage-front beer",     ml: 500, alcoholPct: 5,  category: "Fesztivál", categoryEn: "Festival", emoji: "🎤" },

    // === Alkoholmentes (prevenciós tippek támogatása) ===
    { name: "Víz (5dl)",               nameEn: "Water (500ml)",         ml: 500, alcoholPct: 0, category: "Alkoholmentes", categoryEn: "Non-alcoholic", emoji: "💧" },
    { name: "Kóla (3dl)",              nameEn: "Cola (300ml)",          ml: 300, alcoholPct: 0, category: "Alkoholmentes", categoryEn: "Non-alcoholic", emoji: "🥤" },
    { name: "Energiaital (2.5dl)",     nameEn: "Energy drink (250ml)",  ml: 250, alcoholPct: 0, category: "Alkoholmentes", categoryEn: "Non-alcoholic", emoji: "⚡" },
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
