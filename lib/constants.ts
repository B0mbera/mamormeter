export type Party = "FIDESZ" | "TISZA" | "MIHAZANK" | "DK" | "MKKP";

export const PARTIES: {
  id: Party;
  name: string;
  nameEn: string;
  color: string;
  emoji: string;
}[] = [
  {
    id: "FIDESZ",
    name: "FIDESZ-KDNP",
    nameEn: "FIDESZ-KDNP",
    color: "#f97316",
    emoji: "🟠",
  },
  {
    id: "TISZA",
    name: "TISZA",
    nameEn: "TISZA",
    color: "#0ea5e9",
    emoji: "🔵",
  },
  {
    id: "MIHAZANK",
    name: "Mi Hazánk",
    nameEn: "Mi Hazánk",
    color: "#16a34a",
    emoji: "🟢",
  },
  {
    id: "DK",
    name: "DK",
    nameEn: "DK",
    color: "#1d4ed8",
    emoji: "🔷",
  },
  {
    id: "MKKP",
    name: "MKKP",
    nameEn: "MKKP",
    color: "#eab308",
    emoji: "🎪",
  },
];

export const COOLDOWN_SECONDS = 5;
export const MAX_ML_PER_DRINK = 1000;
export const MIN_ML_PER_DRINK = 10;
export const MAX_ALCOHOL_PCT = 96;
export const MAX_MULTIPLIER = 3;
export const MAX_BAC_PROMILLE = 6.0; // Hard cap — above this is clinically lethal

export function getParty(id: string | null | undefined) {
  return PARTIES.find((p) => p.id === id) || null;
}
