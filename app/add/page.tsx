"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { DrinkPresetGrid } from "@/components/DrinkPresetGrid";
import { DrinkPreset, Drink } from "@/types";
import {
  COOLDOWN_SECONDS,
  MAX_ML_PER_DRINK,
  MIN_ML_PER_DRINK,
  MAX_ALCOHOL_PCT,
} from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AddDrinkPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const { t } = useLanguageStore();

  const [presets, setPresets] = useState<DrinkPreset[]>([]);
  const [lastDrinkTime, setLastDrinkTime] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customMl, setCustomMl] = useState(100);
  const [customAlcohol, setCustomAlcohol] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [presetsRes, userRes] = await Promise.all([
        fetch("/api/presets"),
        userId ? fetch(`/api/users/${userId}`) : null,
      ]);

      if (presetsRes.ok) {
        setPresets(await presetsRes.json());
      }

      if (userRes && userRes.ok) {
        const user = await userRes.json();
        if (user.drinks && user.drinks.length > 0) {
          const latest = user.drinks.reduce((a: Drink, b: Drink) =>
            new Date(a.consumedAt).getTime() > new Date(b.consumedAt).getTime()
              ? a
              : b
          );
          setLastDrinkTime(latest.consumedAt);
        }
      }
    } catch {
      // ignore
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      router.replace("/onboarding");
      return;
    }
    fetchData();
  }, [userId, router, fetchData]);

  async function addCustomDrink() {
    if (!userId || loading) return;

    if (!customName.trim()) {
      toast.error(t("validation.drinkNameRequired"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: customName.trim(),
          ml: customMl,
          alcoholPct: customAlcohol,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        toast.error(t("toast.cooldown", { seconds: COOLDOWN_SECONDS }));
        return;
      }

      if (!res.ok) {
        toast.error(data.error || t("toast.error"));
        return;
      }

      toast.success(t("toast.drinkAdded", { name: customName.trim() }));
      setCustomName("");
      setShowCustom(false);
      fetchData();
    } catch {
      toast.error(t("toast.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-20 pt-3">
      <div className="max-w-md mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">{t("add.title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Presets */}
        <DrinkPresetGrid
          presets={presets}
          onDrinkAdded={fetchData}
          lastDrinkTime={lastDrinkTime}
        />

        {/* Custom drink toggle */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowCustom(!showCustom)}
        >
          {showCustom ? "✕" : t("add.customTitle")}
        </Button>

        {/* Custom drink form */}
        {showCustom && (
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label>{t("add.customName")}</Label>
                <Input
                  placeholder={t("add.customNamePlaceholder")}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {t("add.ml", { ml: customMl })}
                </Label>
                <Slider
                  min={MIN_ML_PER_DRINK}
                  max={MAX_ML_PER_DRINK}
                  step={10}
                  value={[customMl]}
                  onValueChange={([v]) => setCustomMl(v)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {t("add.alcohol", { pct: customAlcohol })}
                </Label>
                <Slider
                  min={0}
                  max={MAX_ALCOHOL_PCT}
                  step={0.5}
                  value={[customAlcohol]}
                  onValueChange={([v]) => setCustomAlcohol(v)}
                />
              </div>

              <Button
                className="w-full"
                onClick={addCustomDrink}
                disabled={loading}
              >
                {loading ? t("add.submitting") : t("add.submit")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Navigation />
    </div>
  );
}
