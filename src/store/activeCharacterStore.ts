"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveCharacterState = {
  activeCharacterId: number | null;
  setActiveCharacterId: (id: number) => void;
  clearActiveCharacterId: () => void;
};

export const useActiveCharacterStore = create<ActiveCharacterState>()(
  persist(
    (set) => ({
      activeCharacterId: null,

      setActiveCharacterId: (id) =>
        set({
          activeCharacterId: id,
        }),

      clearActiveCharacterId: () =>
        set({
          activeCharacterId: null,
        }),
    }),
    {
      name: "word-rpg-active-character-storage",
    }
  )
);