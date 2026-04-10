"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drink } from "@/types";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Trash2, ListOrdered } from "lucide-react";

interface DrinkLogProps {
  drinks: Drink[];
  onDrinkDeleted: () => void;
}

export function DrinkLog({ drinks, onDrinkDeleted }: DrinkLogProps) {
  const { locale, t } = useLanguageStore();

  async function deleteDrink(drinkId: string, drinkName: string) {
    try {
      const res = await fetch(`/api/drinks/${drinkId}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error(t("toast.error"));
        return;
      }
      toast.success(t("toast.drinkDeleted", { name: drinkName }));
      onDrinkDeleted();
    } catch {
      toast.error(t("toast.networkError"));
    }
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString(locale === "en" ? "en-GB" : "hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDrinkEmoji(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes("sör") || lower.includes("beer") || lower.includes("ipa") || lower.includes("guinness") || lower.includes("kapucinus"))
      return "🍺";
    if (lower.includes("bor") || lower.includes("wine")) return "🍷";
    if (lower.includes("pezsgő") || lower.includes("champagne")) return "🥂";
    if (lower.includes("mojito") || lower.includes("long island") || lower.includes("gin tonic") || lower.includes("koktél") || lower.includes("cocktail") || lower.includes("vodka-red"))
      return "🍹";
    return "🥃";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <ListOrdered className="h-4 w-4" />
          {t("dashboard.todaysDrinks")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {drinks.length === 0 ? (
          <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
            {t("dashboard.noDrinks")}
          </p>
        ) : (
          <div className="space-y-1.5">
            {drinks.map((drink) => (
              <div
                key={drink.id}
                className="flex items-center justify-between rounded-2xl border p-2 sm:p-3 transition-all duration-200 hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-lg sm:text-xl shrink-0">
                    {getDrinkEmoji(drink.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{drink.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {drink.ml}ml · {drink.alcoholPct}% · {formatTime(drink.consumedAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => deleteDrink(drink.id, drink.name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
