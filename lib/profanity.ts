// Hungarian + common English profanity filter
// Normalized (lowercase, no accents) patterns to catch variations
const BANNED_WORDS = [
  "geci",
  "fasz",
  "fasz",
  "kurva",
  "pina",
  "picsa",
  "picsa",
  "szar",
  "bazmeg",
  "bazd",
  "baszd",
  "basz",
  "kibasz",
  "megbasz",
  "leszop",
  "szop",
  "faszfej",
  "gecis",
  "kurv",
  "anyad",
  "anyadat",
  "faszt",
  "buzi",
  "kocsog",
  "ribanc",
  "kurafi",
  "seggfej",
  "segg",
  "fuck",
  "shit",
  "dick",
  "cock",
  "pussy",
  "asshole",
  "bitch",
  "whore",
  "cunt",
  "nigger",
  "nigga",
  "faggot",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, ""); // remove non-alphanumeric
}

export function containsProfanity(name: string): boolean {
  const normalized = normalize(name);
  return BANNED_WORDS.some((word) => normalized.includes(word));
}
