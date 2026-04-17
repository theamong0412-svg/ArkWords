"use client";

import type { WordItem } from "../../data/vocabularySets";

type NotebookWordListProps = {
  words: WordItem[];
  onRemoveWord: (word: string) => void;
};

export default function NotebookWordList({
  words,
  onRemoveWord,
}: NotebookWordListProps) {
  if (words.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-500">
        收藏本目前是空的。去詞庫管理手動收藏，或在冒險中答錯自動加入吧。
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">收藏單詞</h2>

      <div className="space-y-3">
        {words.map((item) => (
          <div
            key={item.word}
            className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-lg font-semibold text-slate-800">{item.word}</p>
              <p className="text-slate-600">{item.meaning}</p>
            </div>

            <button
              onClick={() => onRemoveWord(item.word)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              移出收藏
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}