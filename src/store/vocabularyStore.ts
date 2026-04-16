"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type VocabularyState = {
  selectedSetId: string;
  setSelectedSetId: (id: string) => void;
};

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set) => ({
      selectedSetId: "basic-1",
      setSelectedSetId: (id) => set({ selectedSetId: id }),
    }),
    {
      name: "word-rpg-vocabulary-storage",
    }
  )
);