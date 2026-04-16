"use client";

import Link from "next/link";
import { useMemo } from "react";
import MyWordList from "../../components/vocabulary/MyWordList";
import WordForm from "../../components/vocabulary/WordForm";
import WordList from "../../components/vocabulary/WordList";
import BulkImportForm from "../../components/vocabulary/BulkImportForm";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import { useNotebookStore } from "../../store/notebookStore";
import type { WordItem } from "../../data/vocabularySets";

export default function VocabularyPage() {
  const { selectedSetId, setSelectedSetId } = useVocabularyStore();
  const { sets, addWordToSet, addWordsToSet, removeWordFromSet } =
    useVocabularySetStore();
  const { addBookmarkedWord, isBookmarked } = useNotebookStore();

  const selectedSet = useMemo(() => {
    return sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];
  }, [sets, selectedSetId]);

  if (!selectedSet) {
    return (
      <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-3xl">
          <section className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl">
              📚
            </div>
            <h1 className="mt-5 text-3xl font-black text-white">詞庫管理</h1>
            <p className="mt-4 text-slate-300">目前沒有可用詞庫。</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="secondary-button">
                回首頁
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  function handleAddWord(word: string, meaning: string) {
    addWordToSet(selectedSet.id, { word, meaning });
  }

  function handleBulkImport(items: WordItem[]) {
    addWordsToSet(selectedSet.id, items);
  }

  function handleDeleteWord(word: string) {
    removeWordFromSet(selectedSet.id, word);
  }

  function handleToggleBookmark(item: WordItem) {
    addBookmarkedWord(selectedSet.id, item);
  }

  return (
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                Vocabulary Workshop
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                詞庫管理
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                在這裡新增、整理、批量導入單詞，也可以把重要單詞加入收藏本，為冒險與特訓做好準備。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/70">
                  Current Set
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {selectedSet.name}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                  Word Count
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {selectedSet.words.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="game-panel p-5 sm:p-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="secondary-button">
              回首頁
            </Link>

            <Link
              href="/notebook"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              我的收藏本
            </Link>

            <Link
              href="/battle-select"
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              去冒險
            </Link>
          </div>
        </section>

        <section className="game-panel p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Sets
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">選擇詞庫</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              這裡保留你原本的多詞庫系統，並且作為其他功能頁的同步來源。
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
            <MyWordList
              sets={sets}
              selectedSetId={selectedSet.id}
              onSelectSet={setSelectedSetId}
            />
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="game-panel p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Add Word
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                單個新增單詞
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                直接向目前詞庫新增單字與中文意思。
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
              <WordForm
                selectedSetId={selectedSet.id}
                selectedSetName={selectedSet.name}
                onAddWord={handleAddWord}
              />
            </div>
          </section>

          <section className="game-panel p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Bulk Import
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                批量導入詞表
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                一次導入多筆資料，快速建立新的詞庫內容。
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
              <BulkImportForm
                selectedSetName={selectedSet.name}
                onBulkImport={handleBulkImport}
              />
            </div>
          </section>
        </div>

        <section className="game-panel p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Word Library
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                當前詞庫內容
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                你可以刪除單詞，也可以把單詞加入當前詞庫的收藏本。
              </p>
            </div>

            <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
              {selectedSet.name}・共 {selectedSet.words.length} 筆
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
            <WordList
              words={selectedSet.words}
              selectedSetName={selectedSet.name}
              onDeleteWord={handleDeleteWord}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={(word) => isBookmarked(selectedSet.id, word)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}