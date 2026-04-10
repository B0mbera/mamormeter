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

  return (
    <Card>
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
              className="text-5xl sm:text-6xl font-bold tabular-nums"
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
              color: "white",
              borderColor: "transparent",
            }}
          >
            {getStatusText(promille.status, locale)}
          </Badge>

          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {getSoberingText(promille.soberingMinutes, locale)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
