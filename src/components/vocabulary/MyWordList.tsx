"use client";

import type { VocabularySet } from "../../data/vocabularySets";

type MyWordListProps = {
  sets: VocabularySet[];
  selectedSetId: string;
  onSelectSet: (setId: string) => void;
};

export default function MyWordList({
  sets,
  selectedSetId,
  onSelectSet,
}: MyWordListProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">我的詞庫</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sets.map((setItem) => {
          const isSelected = setItem.id === selectedSetId;

          return (
            <button
              key={setItem.id}
              onClick={() => onSelectSet(setItem.id)}
              className={`text-left rounded-2xl border-2 p-5 transition ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-slate-50 hover:border-green-300"
              }`}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {setItem.name}
              </h3>

              <p className="text-slate-600 mb-2">{setItem.description}</p>

              <p className="text-sm text-slate-500">
                單詞數量：{setItem.words.length}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}