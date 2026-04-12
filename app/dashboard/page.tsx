"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { PromilleCard } from "@/components/PromilleCard";
import { QuickAddBar } from "@/components/QuickAddBar";
import { DrinkLog } from "@/components/DrinkLog";
import { PromilleChart } from "@/components/PromilleChart";
import { UniversityBadge } from "@/components/UniversityBadge";
import { User, Drink, PromilleResult, ChartDataPoint } from "@/types";
import { calculatePromille, calculateChartData } from "@/lib/widmark";

export default function DashboardPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const restoreFromCookie = useUserStore((s) => s.restoreFromCookie);
  const _hasHydrated = useUserStore((s) => s._hasHydrated);
  const { locale } = useLanguageStore();

  const [user, setUser] = useState<User | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [promille, setPromille] = useState<PromilleResult | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    restoreFromCookie();
  }, [restoreFromCookie]);

  // Recalculate promille + chart from existing drinks (no API call)
  const recalculate = useCallback((userData: User, drinksData: Drink[]) => {
    const drinksForCalc = drinksData.map((d) => ({
      ml: d.ml,
      alcoholPct: d.alcoholPct,
      consumedAt: new Date(d.consumedAt),
    }));

    const result = calculatePromille(drinksForCalc, userData.weightKg, userData.gender);
    setPromille(result);
    setChartData(calculateChartData(drinksForCalc, userData.weightKg, userData.gender, locale));
  }, [locale]);

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
      recalculate(data, data.drinks || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userId, router, recalculate]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!userId) {
      router.replace("/onboarding");
      return;
    }
    fetchData();
  }, [userId, router, fetchData, _hasHydrated]);

  // Auto-refresh API data every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(fetchData, 30000);
    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  // Client-side recalc every 60s (updates chart decay without API call)
  useEffect(() => {
    if (!user || drinks.length === 0) return;
    const timer = setInterval(() => recalculate(user, drinks), 60000);
    return () => clearInterval(timer);
  }, [user, drinks, recalculate]);

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
            {user.university ? (
              <UniversityBadge universityId={user.university} size="lg" showName={false} />
            ) : (
              <span className="text-2xl">{user.emoji}</span>
            )}
            <div>
              <h1 className="text-sm sm:text-base font-bold">{user.name}</h1>
              {user.university && (
                <UniversityBadge universityId={user.university} size="sm" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
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
