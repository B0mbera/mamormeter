"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { COOLDOWN_SECONDS } from "@/lib/constants";
import { Zap } from "lucide-react";

interface QuickDrink {
  emoji: string;
  name: string;
  nameEn: string;
  ml: number;
  alcoholPct: number;
}

const defaultQuickDrinks: QuickDrink[] = [
  { emoji: "🍺", name: "Sör 5dl", nameEn: "Beer 5dl", ml: 500, alcoholPct: 4.6 },
  { emoji: "🦌", name: "Jäger", nameEn: "Jäger", ml: 40, alcoholPct: 35 },
  { emoji: "🥃", name: "Pálinka", nameEn: "Pálinka", ml: 40, alcoholPct: 48 },
];

interface QuickAddBarProps {
  onDrinkAdded: () => void;
  lastDrinkTime: string | null;
}

export function QuickAddBar({ onDrinkAdded, lastDrinkTime }: QuickAddBarProps) {
  const userId = useUserStore((s) => s.userId);
  const { locale, t } = useLanguageStore();
  const [cooldown, setCooldown] = useState(0);
  const [adding, setAdding] = useState(false);

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

  async function addQuickDrink(drink: QuickDrink) {
    if (!userId || cooldown > 0 || adding) return;

    setAdding(true);
    try {
      const res = await fetch("/api/drinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: locale === "en" ? drink.nameEn : drink.name,
          ml: drink.ml,
          alcoholPct: drink.alcoholPct,
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
          name: `${drink.emoji} ${locale === "en" ? drink.nameEn : drink.name}`,
        })
      );
      onDrinkAdded();
    } catch {
      toast.error(t("toast.networkError"));
    } finally {
      setAdding(false);
    }
  }

  const isDisabled = cooldown > 0 || adding;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Zap className="h-4 w-4" />
          {t("dashboard.quickAdd")}
          {cooldown > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              {t("dashboard.cooldown", { seconds: cooldown })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {defaultQuickDrinks.map((drink) => (
            <Button
              key={drink.name}
              variant="outline"
              className="h-16 sm:h-20 flex flex-col gap-0.5 sm:gap-1 text-center"
              disabled={isDisabled}
              onClick={() => addQuickDrink(drink)}
            >
              <span className="text-xl sm:text-2xl">{drink.emoji}</span>
              <span className="text-[10px] sm:text-xs font-medium">
                {locale === "en" ? drink.nameEn : drink.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                {drink.ml}ml, {drink.alcoholPct}%
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
