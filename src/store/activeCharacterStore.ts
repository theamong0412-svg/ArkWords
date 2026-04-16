"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveCharacterState = {
  activeCharacterId: number | null;
  hasHydrated: boolean;
  setActiveCharacterId: (id: number) => void;
  clearActiveCharacterId: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useActiveCharacterStore = create<ActiveCharacterState>()(
  persist(
    (set) => ({
      activeCharacterId: null,
      hasHydrated: false,

      setActiveCharacterId: (id) =>
        set({
          activeCharacterId: id,
        }),

      clearActiveCharacterId: () =>
        set({
          activeCharacterId: null,
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "word-rpg-active-character-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);