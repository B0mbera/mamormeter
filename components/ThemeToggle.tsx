"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 w-7 p-0"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Sötét mód" : "Világos mód"}
    >
      {theme === "light" ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
