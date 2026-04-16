"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GachaCharacter } from "../data/gachaPool";

type CharacterState = {
  ownedCharacters: GachaCharacter[];
  addCharacter: (character: GachaCharacter) => void;
  removeCharacterById: (id: number) => void;
  clearCharacters: () => void;
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      ownedCharacters: [],

      addCharacter: (character) =>
        set((state) => ({
          ownedCharacters: [...state.ownedCharacters, character],
        })),

      removeCharacterById: (id) =>
        set((state) => {
          const index = state.ownedCharacters.findIndex(
            (character) => character.id === id
          );

          if (index === -1) return state;

          return {
            ownedCharacters: state.ownedCharacters.filter(
              (_, i) => i !== index
            ),
          };
        }),

      clearCharacters: () =>
        set({
          ownedCharacters: [],
        }),
    }),
    {
      name: "word-rpg-character-storage",
    }
  )
);