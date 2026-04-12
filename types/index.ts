export interface User {
  id: string;
  name: string;
  weightKg: number;
  gender: "male" | "female";
  emoji: string;
  university: string | null;
  createdAt: string;
  drinks: Drink[];
}

export interface Drink {
  id: string;
  userId: string;
  name: string;
  ml: number;
  alcoholPct: number;
  consumedAt: string;
}

export interface DrinkPreset {
  id: string;
  name: string;
  nameEn: string;
  ml: number;
  alcoholPct: number;
  category: string;
  categoryEn: string;
  emoji: string;
}

export type PromilleStatus =
  | "sober"
  | "happy"
  | "moderate"
  | "drunk"
  | "very-drunk";

export interface PromilleResult {
  currentPromille: number;
  maxPromille: number;
  eliminatedPromille: number;
  soberingMinutes: number;
  totalAlcoholGrams: number;
  status: PromilleStatus;
  statusColor: string;
}

export interface UserWithPromille {
  id: string;
  name: string;
  weightKg: number;
  gender: "male" | "female";
  emoji: string;
  university: string | null;
  createdAt: string;
  drinks: Drink[];
  promille: PromilleResult;
}

export interface LeaderboardEntry {
  user: User;
  promille: PromilleResult;
  totalAlcoholGrams: number;
  rank: number;
  drinksSummary: string[];
}

export interface PartyScore {
  partyId: string;
  name: string;
  nameEn: string;
  color: string;
  emoji: string;
  totalPromille: number;
  totalAlcoholGrams: number;
  memberCount: number;
  rank: number;
}

export interface ChartDataPoint {
  time: string;
  promille: number;
}

export interface CreateUserPayload {
  name: string;
  weightKg: number;
  gender: "male" | "female";
  emoji?: string;
  university?: string | null;
}

export interface CreateDrinkPayload {
  userId: string;
  name: string;
  ml: number;
  alcoholPct: number;
  consumedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
