"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GachaPityState = {
  totalPulls: number;
  pullsSinceFiveStarOrAbove: number;
  pullsSinceSixStar: number;
  recordPullResult: (stars: 3 | 4 | 5 | 6) => void;
  resetPity: () => void;
};

export const useGachaPityStore = create<GachaPityState>()(
  persist(
    (set) => ({
      totalPulls: 0,
      pullsSinceFiveStarOrAbove: 0,
      pullsSinceSixStar: 0,

      recordPullResult: (stars) =>
        set((state) => ({
          totalPulls: state.totalPulls + 1,
          pullsSinceFiveStarOrAbove: stars >= 5 ? 0 : state.pullsSinceFiveStarOrAbove + 1,
          pullsSinceSixStar: stars === 6 ? 0 : state.pullsSinceSixStar + 1,
        })),

      resetPity: () =>
        set({
          totalPulls: 0,
          pullsSinceFiveStarOrAbove: 0,
          pullsSinceSixStar: 0,
        }),
    }),
    {
      name: "word-rpg-gacha-pity-storage",
    }
  )
);