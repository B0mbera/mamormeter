"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrinkPreset } from "@/types";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { COOLDOWN_SECONDS, MAX_MULTIPLIER } from "@/lib/constants";

interface DrinkPresetGridProps {
  presets: DrinkPreset[];
  onDrinkAdded: () => void;
  lastDrinkTime: string | null;
}

export function DrinkPresetGrid({
  presets,
  onDrinkAdded,
  lastDrinkTime,
}: DrinkPresetGridProps) {
  const userId = useUserStore((s) => s.userId);
  const { locale, t } = useLanguageStore();
  const [multipliers, setMultipliers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const updateCooldown = useCallback(() => {
    if (!lastDrinkTime) {
      setCooldown(0);
      return;
    }
    const elapsed = (Date.now() - new Date(lastDrinkTime).getTime()) / 1000;
    const remaining = Math.max(0, Math.ceil(COOLDOWN_SECONDS - elapsed));
    setCooldown(remaining);
  }, [lastDrinkTime]);

  useEffect(() => {
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [updateCooldown]);

  const categories =
    locale === "en"
      ? ["Beers", "Spirits", "Wine", "Cocktails", "Other"]
      : ["Sörök", "Tömény", "Bor", "Koktél", "Egyéb"];

  function getMultiplier(presetId: string): number {
    return multipliers[presetId] || 1;
  }

  function setMultiplier(presetId: string, value: number) {
    setMultipliers((prev) => ({ ...prev, [presetId]: value }));
  }

  function getPresetsByCategory(cat: string) {
    if (locale === "en") {
      return presets.filter((p) => p.categoryEn === cat);
    }
    return presets.filter((p) => p.category === cat);
  }

  function getPresetName(preset: DrinkPreset): string {
    return locale === "en" ? preset.nameEn : preset.name;
  }

  async function addPreset(preset: DrinkPreset) {
    if (!userId || cooldown > 0) return;

    const mult = getMultiplier(preset.id);
    setLoading(preset.id);

    try {
      const res = await fetch("/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: getPresetName(preset),
          ml: preset.ml * mult,
          alcoholPct: preset.alcoholPct,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        toast.error(t("toast.cooldown", { seconds: COOLDOWN_SECONDS }));
        return;
      }

      if (res.status === 422) {
        toast.error(t("bac.limitReached"));
        return;
      }

      if (!res.ok) {
        toast.error(data.error || t("toast.error"));
        return;
      }

      toast.success(
        t("toast.drinkAdded", {
          name: `${preset.emoji} ${getPresetName(preset)}${mult > 1 ? ` (${mult}x)` : ""}`,
        })
      );
      onDrinkAdded();
    } catch {
      toast.error(t("toast.networkError"));
    } finally {
      setLoading(null);
    }
  }

  const isDisabled = cooldown > 0;

  return (
    <div className="space-y-2">
      {isDisabled && (
        <div className="text-center text-xs text-muted-foreground py-1">
          {t("add.cooldownActive", { seconds: cooldown })}
        </div>
      )}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-[10px] sm:text-xs">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="space-y-1.5">
              {getPresetsByCategory(category).map((preset) => {
                const mult = getMultiplier(preset.id);
                return (
                  <Card key={preset.id}>
                    <CardContent className="pt-2.5 pb-2.5 sm:pt-3 sm:pb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl shrink-0">
                          {preset.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {getPresetName(preset)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {preset.ml * mult}ml · {preset.alcoholPct}%
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                          {Array.from({ length: MAX_MULTIPLIER }, (_, i) => i + 1).map(
                            (n) => (
                              <Button
                                key={n}
                                variant={mult === n ? "default" : "outline"}
                                size="sm"
                                className="h-6 w-6 sm:h-7 sm:w-8 text-[10px] sm:text-xs p-0"
                                onClick={() => setMultiplier(preset.id, n)}
                              >
                                {n}x
                              </Button>
                            )
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="shrink-0 h-7 sm:h-8 px-2 sm:px-3"
                          disabled={loading === preset.id || isDisabled}
                          onClick={() => addPreset(preset)}
                        >
                          {loading === preset.id ? "..." : "+"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
