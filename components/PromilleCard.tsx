"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromilleResult } from "@/types";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getStatusText, getSoberingText } from "@/lib/i18n";
import { Wine } from "lucide-react";

interface PromilleCardProps {
  promille: PromilleResult;
}

export function PromilleCard({ promille }: PromilleCardProps) {
  const { locale, t } = useLanguageStore();

  const isDangerous = promille.status === "dangerous" || promille.status === "lethal";
  const isLethal = promille.status === "lethal";

  return (
    <Card className={isDangerous ? "border-red-500/50 bg-red-500/5" : ""}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <Wine className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t("dashboard.currentPromille")}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={`text-5xl sm:text-6xl font-bold tabular-nums ${isLethal ? "animate-pulse" : ""}`}
              style={{ color: promille.statusColor }}
            >
              {promille.currentPromille.toFixed(2)}
            </span>
            <span
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: promille.statusColor }}
            >
              ‰
            </span>
          </div>

          <Badge
            className="text-xs sm:text-sm px-3 py-1"
            style={{
              backgroundColor: promille.statusColor,
              color: isLethal ? "white" : "white",
              borderColor: "transparent",
            }}
          >
            {getStatusText(promille.status, locale)}
          </Badge>

          {isDangerous && !isLethal && (
            <div className="w-full rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center">
              <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">
                {t("bac.dangerWarning")}
              </p>
            </div>
          )}

          {isLethal && (
            <div className="w-full rounded-lg bg-red-600/20 border border-red-600/50 p-3 text-center animate-pulse">
              <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">
                {t("bac.lethalWarning")}
              </p>
            </div>
          )}

          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {getSoberingText(promille.soberingMinutes, locale)}
          </p>

          {/* Clinical BAC reference scale */}
          <div className="w-full pt-2 border-t">
            <div className="grid grid-cols-3 gap-1 text-center text-[9px] sm:text-[10px] text-muted-foreground">
              <div>
                <span className="font-medium text-yellow-500">0.3–0.8‰</span>
                <p>{locale === "hu" ? "Jókedvű" : "Cheerful"}</p>
              </div>
              <div>
                <span className="font-medium text-red-500">2.5–3.5‰</span>
                <p>{locale === "hu" ? "Bódult" : "Stupor"}</p>
              </div>
              <div>
                <span className="font-medium text-red-800 dark:text-red-300">5.0+‰</span>
                <p>{locale === "hu" ? "Halálos" : "Lethal"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
