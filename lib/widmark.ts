import { PromilleResult, PromilleStatus, ChartDataPoint } from "@/types";

interface DrinkInput {
  ml: number;
  alcoholPct: number;
  consumedAt: string | Date;
}

export function calculateAlcoholGrams(ml: number, alcoholPct: number): number {
  return ml * (alcoholPct / 100) * 0.789;
}

export function getWidmarkFactor(gender: "male" | "female"): number {
  return gender === "male" ? 0.68 : 0.55;
}

export function calculatePromille(
  drinks: DrinkInput[],
  weightKg: number,
  gender: "male" | "female",
  atTime?: Date
): PromilleResult {
  const now = atTime || new Date();

  if (drinks.length === 0) {
    return {
      currentPromille: 0,
      maxPromille: 0,
      eliminatedPromille: 0,
      soberingMinutes: 0,
      totalAlcoholGrams: 0,
      status: "sober",
      statusColor: "#22c55e",
    };
  }

  const totalAlcoholGrams = drinks.reduce(
    (sum, drink) => sum + calculateAlcoholGrams(drink.ml, drink.alcoholPct),
    0
  );

  const r = getWidmarkFactor(gender);
  const maxPromille = totalAlcoholGrams / (weightKg * r);

  const firstDrinkTime = new Date(
    Math.min(...drinks.map((d) => new Date(d.consumedAt).getTime()))
  );
  const elapsedHours =
    (now.getTime() - firstDrinkTime.getTime()) / (1000 * 60 * 60);
  const eliminatedPromille = Math.max(0, elapsedHours) * 0.15;

  const currentPromille = Math.max(0, maxPromille - eliminatedPromille);
  const soberingMinutes =
    currentPromille > 0 ? (currentPromille / 0.15) * 60 : 0;

  const { status, statusColor } = getPromilleStatus(currentPromille);

  return {
    currentPromille: Math.round(currentPromille * 100) / 100,
    maxPromille: Math.round(maxPromille * 100) / 100,
    eliminatedPromille: Math.round(eliminatedPromille * 100) / 100,
    soberingMinutes: Math.round(soberingMinutes),
    totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
    status,
    statusColor,
  };
}

export function getPromilleStatus(promille: number): {
  status: PromilleStatus;
  statusColor: string;
} {
  if (promille < 0.3) return { status: "sober", statusColor: "#22c55e" };
  if (promille < 0.8) return { status: "happy", statusColor: "#eab308" };
  if (promille < 1.5) return { status: "moderate", statusColor: "#f97316" };
  if (promille < 2.5) return { status: "drunk", statusColor: "#ef4444" };
  return { status: "very-drunk", statusColor: "#a855f7" };
}

export function calculateTotalAlcoholGrams(drinks: DrinkInput[]): number {
  return drinks.reduce(
    (sum, drink) => sum + calculateAlcoholGrams(drink.ml, drink.alcoholPct),
    0
  );
}

export function calculateChartData(
  drinks: DrinkInput[],
  weightKg: number,
  gender: "male" | "female",
  locale: string = "hu"
): ChartDataPoint[] {
  if (drinks.length === 0) return [];

  const now = new Date();
  const localeStr = locale === "en" ? "en-GB" : "hu-HU";
  const sortedDrinks = [...drinks].sort(
    (a, b) =>
      new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime()
  );

  const firstDrinkTime = new Date(sortedDrinks[0].consumedAt);
  const r = getWidmarkFactor(gender);

  const totalAlcoholGrams = drinks.reduce(
    (sum, drink) => sum + calculateAlcoholGrams(drink.ml, drink.alcoholPct),
    0
  );
  const maxPromille = totalAlcoholGrams / (weightKg * r);
  const soberingTotalMinutes = (maxPromille / 0.15) * 60;
  const endTime = new Date(
    firstDrinkTime.getTime() + soberingTotalMinutes * 60 * 1000
  );
  // Show chart up to 30 min into the future, but at most until sober
  const chartEnd = new Date(
    Math.min(
      Math.max(now.getTime() + 30 * 60 * 1000, endTime.getTime()),
      endTime.getTime()
    )
  );

  const points: ChartDataPoint[] = [];
  const intervalMs = 15 * 60 * 1000;

  for (
    let t = firstDrinkTime.getTime();
    t <= chartEnd.getTime();
    t += intervalMs
  ) {
    const alcoholAtTime = sortedDrinks
      .filter((d) => new Date(d.consumedAt).getTime() <= t)
      .reduce(
        (sum, drink) => sum + calculateAlcoholGrams(drink.ml, drink.alcoholPct),
        0
      );

    const maxBac = alcoholAtTime / (weightKg * r);
    const elapsed = (t - firstDrinkTime.getTime()) / (1000 * 60 * 60);
    const eliminated = elapsed * 0.15;
    const bac = Math.max(0, maxBac - eliminated);

    points.push({
      time: new Date(t).toLocaleTimeString(localeStr, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      promille: Math.round(bac * 100) / 100,
    });
  }

  return points;
}
