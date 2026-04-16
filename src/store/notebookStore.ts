"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WordItem } from "../data/vocabularySets";

type NotebookMap = Record<string, WordItem[]>;

type NotebookState = {
  hasHydrated: boolean;
  notebooksBySet: NotebookMap;
  addBookmarkedWord: (setId: string, wordItem: WordItem) => void;
  removeBookmarkedWord: (setId: string, word: string) => void;
  clearBookmarkedWords: (setId: string) => void;
  getBookmarkedWords: (setId: string) => WordItem[];
  isBookmarked: (setId: string, word: string) => boolean;
  setHasHydrated: (value: boolean) => void;
};

function normalizeWord(word: string) {
  return word.trim().toLowerCase();
}

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      notebooksBySet: {},

      addBookmarkedWord: (setId, wordItem) =>
        set((state) => {
          const currentWords = state.notebooksBySet[setId] ?? [];

          const exists = currentWords.some(
            (item) => normalizeWord(item.word) === normalizeWord(wordItem.word)
          );

          if (exists) return state;

          return {
            notebooksBySet: {
              ...state.notebooksBySet,
              [setId]: [...currentWords, wordItem],
            },
          };
        }),

      removeBookmarkedWord: (setId, word) =>
        set((state) => {
          const currentWords = state.notebooksBySet[setId] ?? [];

          return {
            notebooksBySet: {
              ...state.notebooksBySet,
              [setId]: currentWords.filter(
                (item) => normalizeWord(item.word) !== normalizeWord(word)
              ),
            },
          };
        }),

      clearBookmarkedWords: (setId) =>
        set((state) => ({
          notebooksBySet: {
            ...state.notebooksBySet,
            [setId]: [],
          },
        })),

      getBookmarkedWords: (setId) => {
        return get().notebooksBySet[setId] ?? [];
      },

      isBookmarked: (setId, word) => {
        const currentWords = get().notebooksBySet[setId] ?? [];
        return currentWords.some(
          (item) => normalizeWord(item.word) === normalizeWord(word)
        );
      },

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "word-rpg-notebook-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);