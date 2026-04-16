"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyState = {
  coins: number;
  hasHydrated: boolean;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      coins: 0,
      hasHydrated: false,

      addCoins: (amount) =>
        set((state) => ({
          coins: state.coins + amount,
        })),

      spendCoins: (amount) =>
        set((state) => ({
          coins: Math.max(0, state.coins - amount),
        })),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "word-rpg-currency-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);