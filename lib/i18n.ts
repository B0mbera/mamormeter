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

    "dashboard.currentPromille": "Aktuális promille",
    "dashboard.quickAdd": "Gyors hozzáadás",
    "dashboard.todaysDrinks": "Mai italok",
    "dashboard.chart": "Promille görbe",
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
    "landing.step1": "Készíts profilt (becenév, testsúly, párt)",
    "landing.step2": "Loggold az italaidat egy kattintással",
    "landing.step3": "Kövesd a promille szinted valós időben",
    "landing.step4": "Nézd a ranglétrán ki iszik a legtöbbet",
    "landing.disclaimer": "⚠️ Az app szórakoztatási célú, ne használd orvosi döntésekhez!",

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
    "app.subtitle": "Promille Tracker",

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

    "dashboard.currentPromille": "Current promille",
    "dashboard.quickAdd": "Quick add",
    "dashboard.todaysDrinks": "Today's drinks",
    "dashboard.chart": "Promille curve",
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
    "landing.step1": "Create a profile (nickname, weight, party)",
    "landing.step2": "Log your drinks with one tap",
    "landing.step3": "Track your BAC level in real time",
    "landing.step4": "Check the leaderboard to see who drinks the most",
    "landing.disclaimer": "⚠️ This app is for entertainment only, not medical advice!",

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
