"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LayoutDashboard, Plus, Trophy, Heart } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguageStore();

  if (pathname === "/" || pathname === "/onboarding") return null;

  const navItems = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/add", label: t("nav.add"), icon: Plus },
    { href: "/leaderboard", label: t("nav.leaderboard"), icon: Trophy },
    { href: "/support", label: t("nav.support"), icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 sm:py-2 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 sm:px-4 py-1 rounded-2xl transition-all duration-200 min-w-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] sm:text-[10px] font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
