"use client";

import type { WordItem } from "../../data/vocabularySets";

type WordListProps = {
  words: WordItem[];
  selectedSetName: string;
  onDeleteWord: (word: string) => void;
  onToggleBookmark: (item: WordItem) => void;
  isBookmarked: (word: string) => boolean;
};

export default function WordList({
  words,
  selectedSetName,
  onDeleteWord,
  onToggleBookmark,
  isBookmarked,
}: WordListProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">單詞列表</h2>

      <p className="text-slate-600 mb-4">
        目前查看詞庫：<span className="font-semibold">{selectedSetName}</span>
      </p>

      {words.length === 0 ? (
        <p className="text-slate-500">這個詞庫目前還沒有單詞。</p>
      ) : (
        <div className="space-y-3">
          {words.map((item) => {
            const bookmarked = isBookmarked(item.word);

            return (
              <div
                key={item.word}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {item.word}
                  </p>
                  <p className="text-slate-600">{item.meaning}</p>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => onToggleBookmark(item)}
                    className={`px-4 py-2 rounded-lg transition text-white ${
                      bookmarked
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {bookmarked ? "已收藏" : "收藏"}
                  </button>

                  <button
                    onClick={() => onDeleteWord(item.word)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    刪除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}