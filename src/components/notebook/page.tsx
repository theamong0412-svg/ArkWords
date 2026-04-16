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
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
                Notebook Archive
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                我的收藏本
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                每個詞庫都有自己的專屬收藏本。答題錯誤時，自動收錄到對應詞庫的收藏本中，方便你反覆特訓。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/70">
                  Current Set
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {selectedSet?.name ?? "未選擇"}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Bookmarked Words
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {hasHydrated ? bookmarkedWords.length : "讀取中..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="game-panel p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Vocabulary Sets
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">選擇詞庫</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                切換不同詞庫，查看它們各自的收藏本內容。
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sets.map((setItem) => {
              const isSelected = selectedSet?.id === setItem.id;
              const count = hasHydrated
                ? getBookmarkedWords(setItem.id).length
                : 0;

              return (
                <button
                  key={setItem.id}
                  onClick={() => setSelectedSetId(setItem.id)}
                  className={[
                    "rounded-[24px] border p-5 text-left transition duration-300",
                    isSelected
                      ? "border-amber-300/25 bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-slate-950/70 shadow-[0_0_30px_rgba(251,191,36,0.12)]"
                      : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {setItem.name}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        收藏單詞數量：{hasHydrated ? count : "讀取中..."}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
                        當前
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="game-panel p-5 sm:p-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/notebook-battle"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              開始收藏本特訓
            </Link>

            <Link
              href="/battle-select"
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              去普通冒險
            </Link>

            <Link href="/" className="secondary-button">
              回首頁
            </Link>
          </div>
        </section>

        {selectedSet && (
          <section className="game-panel p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Current Notebook
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {selectedSet.name}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  當前收藏單詞數量：
                  {hasHydrated ? bookmarkedWords.length : "讀取中..."}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
              <NotebookWordList
                words={bookmarkedWords}
                onRemoveWord={(word) =>
                  removeBookmarkedWord(selectedSet.id, word)
                }
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}