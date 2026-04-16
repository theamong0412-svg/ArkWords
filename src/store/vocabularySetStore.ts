"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { vocabularySets as initialVocabularySets } from "../data/vocabularySets";
import type { VocabularySet, WordItem } from "../data/vocabularySets";

type VocabularySetState = {
  sets: VocabularySet[];
  addWordToSet: (setId: string, wordItem: WordItem) => void;
  addWordsToSet: (setId: string, wordItems: WordItem[]) => void;
  removeWordFromSet: (setId: string, word: string) => void;
};

function normalizeWord(word: string) {
  return word.trim().toLowerCase();
}

export const useVocabularySetStore = create<VocabularySetState>()(
  persist(
    (set) => ({
      sets: initialVocabularySets,

      addWordToSet: (setId, wordItem) =>
        set((state) => ({
          sets: state.sets.map((setItem) => {
            if (setItem.id !== setId) return setItem;

            const exists = setItem.words.some(
              (item) => normalizeWord(item.word) === normalizeWord(wordItem.word)
            );

            if (exists) return setItem;

            return {
              ...setItem,
              words: [...setItem.words, wordItem],
            };
          }),
        })),

      addWordsToSet: (setId, wordItems) =>
        set((state) => ({
          sets: state.sets.map((setItem) => {
            if (setItem.id !== setId) return setItem;

            const existingWordSet = new Set(
              setItem.words.map((item) => normalizeWord(item.word))
            );

            const uniqueNewItems: WordItem[] = [];

            for (const wordItem of wordItems) {
              const normalizedWord = normalizeWord(wordItem.word);

              if (!existingWordSet.has(normalizedWord)) {
                existingWordSet.add(normalizedWord);
                uniqueNewItems.push(wordItem);
              }
            }

            return {
              ...setItem,
              words: [...setItem.words, ...uniqueNewItems],
            };
          }),
        })),

      removeWordFromSet: (setId, word) =>
        set((state) => ({
          sets: state.sets.map((setItem) =>
            setItem.id === setId
              ? {
                  ...setItem,
                  words: setItem.words.filter(
                    (item) => normalizeWord(item.word) !== normalizeWord(word)
                  ),
                }
              : setItem
          ),
        })),
    }),
    {
      name: "word-rpg-vocabulary-sets-storage",
    }
  )
);