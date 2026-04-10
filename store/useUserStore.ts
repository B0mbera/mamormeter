import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Cookie helpers for session persistence
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface UserState {
  userId: string | null;
  sessionId: string;
  _hasHydrated: boolean;
  setUserId: (id: string) => void;
  clearUser: () => void;
  restoreFromCookie: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      sessionId: uuidv4(),
      _hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),
      setUserId: (id: string) => {
        set({ userId: id });
        setCookie("mamormeter-uid", id);
        setCookie("mamormeter-sid", get().sessionId);
      },
      clearUser: () => set({ userId: null }),
      restoreFromCookie: () => {
        const current = get().userId;
        if (!current) {
          const cookieId = getCookie("mamormeter-uid");
          if (cookieId) {
            set({ userId: cookieId });
          }
        }
        // Ensure session ID is always in cookie
        setCookie("mamormeter-sid", get().sessionId);
        // Ensure userId is always in cookie if present
        const uid = get().userId;
        if (uid) {
          setCookie("mamormeter-uid", uid);
        }
      },
    }),
    {
      name: "mamormeter-user",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
