export type University = "DOTE" | "POTE" | "SOTE" | "SZOTE";

export const UNIVERSITIES: {
  id: University;
  name: string;
  nameEn: string;
  color: string;
  logo: string;
}[] = [
  {
    id: "DOTE",
    name: "Debreceni Egyetem",
    nameEn: "University of Debrecen",
    color: "#16a34a",
    logo: "https://i.imgur.com/flnMJOm.png",
  },
  {
    id: "POTE",
    name: "Pécsi Tudományegyetem",
    nameEn: "University of Pécs",
    color: "#dc2626",
    logo: "https://i.imgur.com/OC7Jnl9.png",
  },
  {
    id: "SOTE",
    name: "Semmelweis Egyetem",
    nameEn: "Semmelweis University",
    color: "#2563eb",
    logo: "https://i.imgur.com/BzvZPtt.png",
  },
  {
    id: "SZOTE",
    name: "Szegedi Tudományegyetem",
    nameEn: "University of Szeged",
    color: "#7c3aed",
    logo: "https://i.imgur.com/tFwORdD.png",
  },
];

export const COOLDOWN_SECONDS = 60;
export const MAX_ML_PER_DRINK = 2000;
export const MIN_ML_PER_DRINK = 10;
export const MAX_ALCOHOL_PCT = 96;
export const MAX_MULTIPLIER = 3;

export const EDITION = "medikus" as const;

export function isMedikus(): boolean {
  return true;
}

export function getUniversity(id: string | null | undefined) {
  return UNIVERSITIES.find((u) => u.id === id) || null;
}
