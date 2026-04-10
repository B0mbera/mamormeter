import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id: string) => set({ userId: id }),
      clearUser: () => set({ userId: null }),
    }),
    {
      name: "mamormeter-user",
    }
  )
);
