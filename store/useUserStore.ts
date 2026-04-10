import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Tiny UUIDv4 generator (no external dependency required)
// ---------------------------------------------------------------------------
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---------------------------------------------------------------------------
// Cookie helpers (client-side only)
// ---------------------------------------------------------------------------
const COOKIE_NAME = "mamormeter_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// Device-ID helpers – persists a stable UUID regardless of localStorage state
// ---------------------------------------------------------------------------
const DEVICE_KEY = "mamormeter_device_id";

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";

  // 1. Check cookie first
  const fromCookie = getCookie(DEVICE_KEY);
  if (fromCookie) {
    // Keep localStorage in sync
    try {
      localStorage.setItem(DEVICE_KEY, fromCookie);
    } catch {
      // ignore quota / security errors
    }
    return fromCookie;
  }

  // 2. Check localStorage
  try {
    const fromLS = localStorage.getItem(DEVICE_KEY);
    if (fromLS) {
      setCookie(DEVICE_KEY, fromLS, COOKIE_MAX_AGE);
      return fromLS;
    }
  } catch {
    // ignore
  }

  // 3. Generate fresh UUID and persist in both stores
  const id = generateUUID();
  setCookie(DEVICE_KEY, id, COOKIE_MAX_AGE);
  try {
    localStorage.setItem(DEVICE_KEY, id);
  } catch {
    // ignore
  }
  return id;
}

// ---------------------------------------------------------------------------
// Custom storage adapter that syncs with cookies
// ---------------------------------------------------------------------------
const cookieSyncStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;

    // Try localStorage first, then cookie fallback
    try {
      const fromLS = localStorage.getItem(key);
      if (fromLS) return fromLS;
    } catch {
      // ignore
    }

    const fromCookie = getCookie(key);
    if (fromCookie) {
      try {
        localStorage.setItem(key, fromCookie);
      } catch {
        // ignore
      }
    }
    return fromCookie;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
    setCookie(key, value, COOKIE_MAX_AGE);
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    // Expire the cookie immediately
    if (typeof document !== "undefined") {
      document.cookie = `${key}=; max-age=0; path=/; SameSite=Lax`;
    }
  },
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface UserState {
  userId: string | null;
  deviceId: string | null;
  setUserId: (id: string) => void;
  clearUser: () => void;
  initDeviceId: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      deviceId: null,
      setUserId: (id: string) => set({ userId: id }),
      clearUser: () => set({ userId: null }),
      initDeviceId: () => {
        const id = getOrCreateDeviceId();
        set({ deviceId: id });
      },
    }),
    {
      name: "mamormeter-user",
      storage: createJSONStorage(() => cookieSyncStorage),
    }
  )
);

