import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, TranslationKey, getTranslation } from "@/lib/i18n";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: "hu",
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: TranslationKey, params?: Record<string, string | number>) =>
        getTranslation(get().locale, key, params),
    }),
    {
      name: "mamormeter-lang",
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
