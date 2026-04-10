"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Navigation } from "@/components/Navigation";
import { PromilleCard } from "@/components/PromilleCard";
import { QuickAddBar } from "@/components/QuickAddBar";
import { DrinkLog } from "@/components/DrinkLog";
import { PromilleChart } from "@/components/PromilleChart";
import { UniversityBadge } from "@/components/UniversityBadge";
import { User, Drink, PromilleResult, ChartDataPoint } from "@/types";
import { calculatePromille } from "@/lib/widmark";
import { isMedikus } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const { locale } = useLanguageStore();

  const [user, setUser] = useState<User | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [promille, setPromille] = useState<PromilleResult | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        router.replace("/onboarding");
        return;
      }
      const data = await res.json();

      setUser(data);
      setDrinks(data.drinks || []);

      const drinksForCalc = (data.drinks || []).map((d: Drink) => ({
        ml: d.ml,
        alcoholPct: d.alcoholPct,
        consumedAt: new Date(d.consumedAt),
      }));

      const result = calculatePromille(
        drinksForCalc,
        data.weightKg,
        data.gender
      );
      setPromille(result);

      // Build chart data from drinks
      if (data.drinks && data.drinks.length > 0) {
        const sorted = [...data.drinks].sort(
          (a: Drink, b: Drink) =>
            new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime()
        );

        const points: ChartDataPoint[] = [];
        const cumulativeDrinks: Array<{
          ml: number;
          alcoholPct: number;
          consumedAt: Date;
        }> = [];

        for (const drink of sorted) {
          cumulativeDrinks.push({
            ml: drink.ml,
            alcoholPct: drink.alcoholPct,
            consumedAt: new Date(drink.consumedAt),
          });

          const p = calculatePromille(
            cumulativeDrinks,
            data.weightKg,
            data.gender
          );

          points.push({
            time: new Date(drink.consumedAt).toLocaleTimeString(locale === "en" ? "en-GB" : "hu-HU", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            promille: p.currentPromille,
          });
        }

        // Add current time point
        points.push({
          time: new Date().toLocaleTimeString(locale === "en" ? "en-GB" : "hu-HU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          promille: result.currentPromille,
        });

        setChartData(points);
      } else {
        setChartData([]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userId, router, locale]);

  useEffect(() => {
    if (!userId) {
      router.replace("/onboarding");
      return;
    }
    fetchData();
  }, [userId, router, fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(fetchData, 30000);
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  if (loading || !user || !promille) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">⏳</span>
      </div>
    );
  }

  const lastDrinkTime =
    drinks.length > 0
      ? drinks.reduce((latest, d) =>
          new Date(d.consumedAt).getTime() > new Date(latest.consumedAt).getTime()
            ? d
            : latest
        ).consumedAt
      : null;

  return (
    <div className="pb-20 pt-3">
      <div className="max-w-md mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMedikus() && user.university ? (
              <UniversityBadge universityId={user.university} size="lg" showName={false} />
            ) : (
              <span className="text-2xl">{user.emoji}</span>
            )}
            <div>
              <h1 className="text-sm sm:text-base font-bold">{user.name}</h1>
              {isMedikus() && user.university && (
                <UniversityBadge universityId={user.university} size="sm" />
              )}
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <PromilleCard promille={promille} />
        <QuickAddBar onDrinkAdded={fetchData} lastDrinkTime={lastDrinkTime} />
        <PromilleChart data={chartData} />
        <DrinkLog drinks={drinks} onDrinkDeleted={fetchData} />
      </div>
      <Navigation />
    </div>
  );
}
