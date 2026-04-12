export type Locale = "hu" | "en";

const translations = {
  hu: {
    "app.title": "MámorMéter",
    "app.event": "Választás 2026",
    "app.subtitle": "Promille Tracker",

    "nav.dashboard": "Műszerfal",
    "nav.add": "Hozzáadás",
    "nav.leaderboard": "Ranglétra",
    "nav.support": "Támogatás",

    "onboarding.title": "Üdv a MámorMéterben!",
    "onboarding.eventTitle": "Választás 2026",
    "onboarding.subtitle": "Készítsd el a profilod és kezdj el mérni!",
    "onboarding.name": "Becenév",
    "onboarding.namePlaceholder": "Max 20 karakter",
    "onboarding.weight": "Testsúly (kg)",
    "onboarding.weightPlaceholder": "pl. 75",
    "onboarding.gender": "Nem",
    "onboarding.male": "Férfi",
    "onboarding.female": "Nő",
    "onboarding.party": "Párt",
    "onboarding.selectParty": "Válassz pártot",
    "onboarding.submit": "Indulhat!",
    "onboarding.loading": "Létrehozás...",

    "dashboard.currentPromille": "Becsült alkoholszint",
    "dashboard.quickAdd": "Gyors hozzáadás",
    "dashboard.todaysDrinks": "Mai italok",
    "dashboard.chart": "Alkoholszint görbe",
    "dashboard.chartEmpty": "Az első ital után megjelenik a grafikon",
    "dashboard.noDrinks": "Még nem ittál ma semmit 🍵",
    "dashboard.cooldown": "Várj még {seconds} mp-et",

    "status.sober": "Józan",
    "status.happy": "Jókedvű",
    "status.moderate": "Közepes",
    "status.drunk": "Részeg",
    "status.very-drunk": "Nagyon részeg",

    "sobering.sober": "Józan vagy!",
    "sobering.time": "Kb. {hours} óra {minutes} perc múlva leszel józan",
    "sobering.minutesOnly": "Kb. {minutes} perc múlva leszel józan",

    "add.title": "Ital hozzáadása",
    "add.customTitle": "Egyéni ital",
    "add.customName": "Ital neve",
    "add.customNamePlaceholder": "pl. Házi pálinka",
    "add.ml": "Mennyiség: {ml} ml",
    "add.alcohol": "Alkoholtartalom: {pct}%",
    "add.submit": "Hozzáadás",
    "add.submitting": "Hozzáadás...",
    "add.cooldownActive": "Várj még {seconds} mp-et!",
    "add.consumedAt": "Mikor fogyasztottad el?",
    "add.consumedAtHint": "Hagyd üresen ha most ittad",

    "leaderboard.title": "Ranglétra",
    "leaderboard.24h": "24 óra",
    "leaderboard.alltime": "Örökös",
    "leaderboard.allParties": "Mind",
    "leaderboard.empty": "Senki sem iszik még... 🍵",
    "leaderboard.emptyAlltime": "Még nincs adat 🍵",
    "leaderboard.you": "Te",
    "leaderboard.totalDrinks": "{count} standard ital",
    "leaderboard.soberIn": "{hours} ó {minutes} p múlva józan",

    "support.title": "Támogatás",
    "support.subtitle": "Az app üzemeltetése pénzbe kerül! 💸",
    "support.description": "A szerver és adatbázis fenntartása havi költséggel jár. Ha használod és tetszik az app, kérlek támogasd az üzemeltetést — már egy sör ára is sokat segít!",
    "support.button": "Támogatás Revoluttal",
    "support.thanks": "Köszönjük, hogy segítesz fenntartani az appot! 🙏",

    "toast.drinkAdded": "{name} hozzáadva!",
    "toast.drinkDeleted": "{name} törölve",
    "toast.error": "Hiba történt",
    "toast.networkError": "Hálózati hiba",
    "toast.profileCreated": "Profil létrehozva! 🎉",
    "toast.cooldown": "Várj még {seconds} másodpercet!",
    "toast.redirecting": "Visszatérés a műszerfalra...",

    "landing.what": "Mi ez?",
    "landing.intro": "A MámorMéter egy választási ivós app, amivel a 2026-os országgyűlési választások estéjén valós időben követheted az alkoholfogyasztásod, versenyezhetsz a barátaiddal és megnézheted melyik párt szurkolói bírják jobban.",
    "landing.howTitle": "Hogyan működik?",
    "landing.step1": "Készíts profilt — add meg a beceneved, testsúlyod és válaszd ki a pártod",
    "landing.step2": "Loggold az italaidat — egy kattintással a gyors gombokkal vagy válassz a 25+ preset közül",
    "landing.step3": "Kövesd az alkoholszinted — valós idejű grafikon mutatja a becsült véralkohol szinted",
    "landing.step4": "Nézd a ranglétrát — ki iszik a legtöbbet? Melyik párt vezet összesítésben?",
    "landing.step5": "Tudd meg mikor leszel józan — az app kiszámolja a várható kijózanodási időt",
    "landing.featTitle": "Funkciók",
    "landing.feat1": "🍺 25+ előre beállított magyar ital (sörök, pálinka, bor, koktélok)",
    "landing.feat2": "📊 Valós idejű alkoholszint görbe Widmark-képlet alapján",
    "landing.feat3": "🏆 Élő ranglétra — egyéni és pártok szerinti összesítéssel",
    "landing.feat4": "⏱️ Kijózanodási idő becslés",
    "landing.feat5": "🎨 Sötét/világos mód, magyar és angol nyelv",
    "landing.disclaimer": "⚠️ Az app szórakoztatási célú, ne használd orvosi döntésekhez! Igyál felelősségteljesen.",

    "validation.nameRequired": "Add meg a beceneved!",
    "validation.nameTooLong": "Becenév maximum 20 karakter!",
    "validation.weightInvalid": "Testsúly 30-250 kg között legyen!",
    "validation.partyRequired": "Válassz pártot!",
    "validation.drinkNameRequired": "Add meg az ital nevét!",
    "validation.nameProfanity": "Válassz egy szebb becenevet!",
  },
  en: {
    "app.title": "MámorMéter",
    "app.event": "Election 2026",
    "app.subtitle": "Alcohol Tracker",

    "nav.dashboard": "Dashboard",
    "nav.add": "Add Drink",
    "nav.leaderboard": "Leaderboard",
    "nav.support": "Support",

    "onboarding.title": "Welcome to MámorMéter!",
    "onboarding.eventTitle": "Election 2026",
    "onboarding.subtitle": "Create your profile and start tracking!",
    "onboarding.name": "Nickname",
    "onboarding.namePlaceholder": "Max 20 characters",
    "onboarding.weight": "Weight (kg)",
    "onboarding.weightPlaceholder": "e.g. 75",
    "onboarding.gender": "Gender",
    "onboarding.male": "Male",
    "onboarding.female": "Female",
    "onboarding.party": "Party",
    "onboarding.selectParty": "Select party",
    "onboarding.submit": "Let's go!",
    "onboarding.loading": "Creating...",

    "dashboard.currentPromille": "Estimated BAC",
    "dashboard.quickAdd": "Quick add",
    "dashboard.todaysDrinks": "Today's drinks",
    "dashboard.chart": "BAC curve",
    "dashboard.chartEmpty": "Chart appears after your first drink",
    "dashboard.noDrinks": "You haven't had anything yet today 🍵",
    "dashboard.cooldown": "Wait {seconds} sec",

    "status.sober": "Sober",
    "status.happy": "Cheerful",
    "status.moderate": "Moderate",
    "status.drunk": "Drunk",
    "status.very-drunk": "Very drunk",

    "sobering.sober": "You're sober!",
    "sobering.time": "About {hours}h {minutes}m until sober",
    "sobering.minutesOnly": "About {minutes}m until sober",

    "add.title": "Add Drink",
    "add.customTitle": "Custom drink",
    "add.customName": "Drink name",
    "add.customNamePlaceholder": "e.g. Homemade pálinka",
    "add.ml": "Amount: {ml} ml",
    "add.alcohol": "Alcohol content: {pct}%",
    "add.submit": "Add drink",
    "add.submitting": "Adding...",
    "add.cooldownActive": "Wait {seconds} sec!",
    "add.consumedAt": "When did you consume it?",
    "add.consumedAtHint": "Leave empty if just now",

    "leaderboard.title": "Leaderboard",
    "leaderboard.24h": "24 Hours",
    "leaderboard.alltime": "All Time",
    "leaderboard.allParties": "All",
    "leaderboard.empty": "Nobody's drinking yet... 🍵",
    "leaderboard.emptyAlltime": "No data yet 🍵",
    "leaderboard.you": "You",
    "leaderboard.totalDrinks": "{count} standard drinks",
    "leaderboard.soberIn": "{hours}h {minutes}m until sober",

    "support.title": "Support",
    "support.subtitle": "Running this app costs money! 💸",
    "support.description": "Server and database hosting has a monthly cost. If you use and enjoy the app, please support us — even the price of a beer helps a lot!",
    "support.button": "Support via Revolut",
    "support.thanks": "Thanks for helping keep the app running! 🙏",

    "toast.drinkAdded": "{name} added!",
    "toast.drinkDeleted": "{name} deleted",
    "toast.error": "An error occurred",
    "toast.networkError": "Network error",
    "toast.profileCreated": "Profile created! 🎉",
    "toast.cooldown": "Wait {seconds} seconds!",
    "toast.redirecting": "Redirecting to dashboard...",

    "landing.what": "What is this?",
    "landing.intro": "MámorMéter is an election drinking app for tracking your alcohol intake in real time during the 2026 Hungarian parliamentary elections. Compete with friends and see which party's supporters can handle the most.",
    "landing.howTitle": "How does it work?",
    "landing.step1": "Create a profile — enter your nickname, weight and choose your party",
    "landing.step2": "Log your drinks — one tap with quick buttons or pick from 25+ presets",
    "landing.step3": "Track your BAC — a real-time chart shows your estimated blood alcohol level",
    "landing.step4": "Check the leaderboard — who drinks the most? Which party leads overall?",
    "landing.step5": "Know when you'll be sober — the app estimates your sobering time",
    "landing.featTitle": "Features",
    "landing.feat1": "🍺 25+ preset Hungarian drinks (beers, pálinka, wine, cocktails)",
    "landing.feat2": "📊 Real-time BAC curve based on the Widmark formula",
    "landing.feat3": "🏆 Live leaderboard — individual and party rankings",
    "landing.feat4": "⏱️ Estimated time until sober",
    "landing.feat5": "🎨 Dark/light mode, Hungarian and English",
    "landing.disclaimer": "⚠️ This app is for entertainment only, not medical advice! Drink responsibly.",

    "validation.nameRequired": "Enter your nickname!",
    "validation.nameTooLong": "Nickname max 20 characters!",
    "validation.weightInvalid": "Weight must be between 30-250 kg!",
    "validation.partyRequired": "Select a party!",
    "validation.drinkNameRequired": "Enter the drink name!",
    "validation.nameProfanity": "Please choose a nicer nickname!",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["hu"];

export function getTranslation(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  let text: string = translations[locale][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function getStatusText(
  status: string,
  locale: Locale
): string {
  const key = `status.${status}` as TranslationKey;
  return getTranslation(locale, key);
}

export function getSoberingText(
  minutes: number,
  locale: Locale
): string {
  if (minutes <= 0) return getTranslation(locale, "sobering.sober");
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0)
    return getTranslation(locale, "sobering.minutesOnly", { minutes: mins });
  return getTranslation(locale, "sobering.time", {
    hours,
    minutes: mins,
  });
}
