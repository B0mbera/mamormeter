export interface UniversityInfo {
  id: string;
  shortName: string;
  name: string;
  nameEn: string;
  color: string;
  emoji: string;
}

export const TOP_UNIVERSITIES: UniversityInfo[] = [
  { id: "ELTE", shortName: "ELTE",        name: "Eötvös Loránd Tudományegyetem",            nameEn: "Eötvös Loránd University",                color: "#0a4d8c", emoji: "🦅" },
  { id: "BME",  shortName: "BME",         name: "Budapesti Műszaki és Gazdaságtudományi Egyetem", nameEn: "Budapest University of Technology",  color: "#003366", emoji: "⚙️" },
  { id: "SZTE", shortName: "SZTE",        name: "Szegedi Tudományegyetem",                  nameEn: "University of Szeged",                    color: "#8b1538", emoji: "📜" },
  { id: "DE",   shortName: "DE",          name: "Debreceni Egyetem",                        nameEn: "University of Debrecen",                  color: "#c8102e", emoji: "🌽" },
  { id: "PPKE", shortName: "PPKE",        name: "Pázmány Péter Katolikus Egyetem",          nameEn: "Pázmány Péter Catholic University",       color: "#5d2a8c", emoji: "✝️" },
  { id: "BCE",  shortName: "Corvinus",    name: "Budapesti Corvinus Egyetem",               nameEn: "Corvinus University of Budapest",         color: "#0c2340", emoji: "💼" },
  { id: "PTE",  shortName: "PTE",         name: "Pécsi Tudományegyetem",                    nameEn: "University of Pécs",                      color: "#00754a", emoji: "🏛️" },
  { id: "ME",   shortName: "ME",          name: "Miskolci Egyetem",                         nameEn: "University of Miskolc",                   color: "#1f4e79", emoji: "⛏️" },
  { id: "MATE", shortName: "MATE",        name: "Magyar Agrár- és Élettudományi Egyetem",   nameEn: "Hungarian University of Agriculture",     color: "#3d8b37", emoji: "🌾" },
  { id: "OE",   shortName: "ÓE",          name: "Óbudai Egyetem",                           nameEn: "Óbuda University",                        color: "#e87722", emoji: "🔧" },
];

export const NON_STUDENT_ID = "NEM_EGYETEMISTA";
export const OTHER_ID = "EGYEB";
export const LEADERBOARD_TOP_N = 4;

export const NON_STUDENT_INFO: UniversityInfo = {
  id: NON_STUDENT_ID,
  shortName: "Nem egyetemista",
  name: "Nem egyetemista",
  nameEn: "Not a student",
  color: "#64748b",
  emoji: "🎒",
};

export function getUniversity(id: string | null | undefined): UniversityInfo | null {
  if (!id) return null;
  const top = TOP_UNIVERSITIES.find((u) => u.id === id);
  if (top) return top;
  if (id === NON_STUDENT_ID) return NON_STUDENT_INFO;
  if (id.startsWith(OTHER_ID + ":")) {
    const custom = id.slice(OTHER_ID.length + 1) || "Egyéb";
    return { id, shortName: custom, name: custom, nameEn: custom, color: "#94a3b8", emoji: "🏫" };
  }
  return { id, shortName: id, name: id, nameEn: id, color: "#94a3b8", emoji: "🏫" };
}

export function isTopUniversity(id: string | null | undefined): boolean {
  if (!id) return false;
  return TOP_UNIVERSITIES.some((u) => u.id === id);
}
