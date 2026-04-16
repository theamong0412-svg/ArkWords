"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useNotebookStore } from "../../store/notebookStore";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import NotebookWordList from "../../components/notebook/NotebookWordList";

export default function NotebookPage() {
  const { selectedSetId, setSelectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { hasHydrated, getBookmarkedWords, removeBookmarkedWord } =
    useNotebookStore();

  const selectedSet = useMemo(() => {
    return sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];
  }, [sets, selectedSetId]);

  const bookmarkedWords =
    hasHydrated && selectedSet ? getBookmarkedWords(selectedSet.id) : [];

  return (
    <main className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-800 mb-4 text-center">
          我的收藏本
        </h1>

        <p className="text-center text-slate-600 mb-6">
          每個詞庫都有自己的專屬收藏本。
        </p>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">選擇詞庫</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.map((setItem) => {
              const isSelected = selectedSet?.id === setItem.id;
              const count = hasHydrated
                ? getBookmarkedWords(setItem.id).length
                : 0;

              return (
                <button
                  key={setItem.id}
                  onClick={() => setSelectedSetId(setItem.id)}
                  className={`text-left rounded-2xl border-2 p-5 transition ${
                    isSelected
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-200 bg-slate-50 hover:border-amber-300"
                  }`}
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {setItem.name}
                  </h3>

                  <p className="text-slate-600 text-sm">
                    收藏單詞數量：{hasHydrated ? count : "讀取中..."}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <Link
            href="/notebook-battle"
            className="bg-amber-600 text-white px-5 py-3 rounded-xl hover:bg-amber-700 transition"
          >
            開始收藏本特訓
          </Link>

          <Link
            href="/"
            className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
          >
            回首頁
          </Link>
        </div>

        {selectedSet && (
          <>
            <p className="text-center text-lg text-slate-600 mb-6">
              當前收藏本：{selectedSet.name}，單詞數量：
              {hasHydrated ? bookmarkedWords.length : "讀取中..."}
            </p>

            <NotebookWordList
              words={bookmarkedWords}
              onRemoveWord={(word) =>
                removeBookmarkedWord(selectedSet.id, word)
              }
            />
          </>
        )}
      </div>
    </main>
  );
}