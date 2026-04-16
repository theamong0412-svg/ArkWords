"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gachaPool as initialGachaPool } from "../data/gachaPool";
import type { GachaCharacter } from "../data/gachaPool";

type GachaPoolState = {
  pool: GachaCharacter[];
  addPoolCharacter: (character: Omit<GachaCharacter, "id">) => void;
  removePoolCharacter: (id: number) => void;
  resetPool: () => void;
};

export const useGachaPoolStore = create<GachaPoolState>()(
  persist(
    (set) => ({
      pool: initialGachaPool,

      addPoolCharacter: (character) =>
        set((state) => ({
          pool: [
            ...state.pool,
            {
              id: Date.now(),
              name: character.name,
              rarity: character.rarity,
            },
          ],
        })),

      removePoolCharacter: (id) =>
        set((state) => ({
          pool: state.pool.filter((character) => character.id !== id),
        })),

      resetPool: () =>
        set({
          pool: initialGachaPool,
        }),
    }),
    {
      name: "word-rpg-gacha-pool-storage",
    }
  )
);