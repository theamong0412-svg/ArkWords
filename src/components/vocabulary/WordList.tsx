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
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <h2 className="text-2xl font-black text-white mb-2">單詞列表</h2>

      <p className="text-slate-300 mb-5 leading-7">
        目前查看詞庫：
        <span className="ml-1 font-bold text-violet-200">{selectedSetName}</span>
      </p>

      {words.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-4 py-8 text-center text-slate-400">
          這個詞庫目前還沒有單詞。
        </div>
      ) : (
        <div className="space-y-3">
          {words.map((item) => {
            const bookmarked = isBookmarked(item.word);

            return (
              <div
                key={item.word}
                className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-slate-950/35 px-4 py-4 transition duration-300 hover:border-white/20 hover:bg-slate-900/50 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-words text-lg font-bold text-white">
                    {item.word}
                  </p>
                  <p className="mt-1 break-words text-slate-300">
                    {item.meaning}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    onClick={() => onToggleBookmark(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
                      bookmarked
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg"
                    }`}
                  >
                    {bookmarked ? "已收藏" : "收藏"}
                  </button>

                  <button
                    onClick={() => onDeleteWord(item.word)}
                    className="rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2 text-sm font-bold text-white transition hover:shadow-lg"
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