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
      <main className="min-h-screen bg-green-50 p-8">
        <p>目前沒有可用詞庫。</p>
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
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">
          詞庫管理
        </h1>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <Link
            href="/"
            className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
          >
            回首頁
          </Link>

          <Link
            href="/notebook"
            className="bg-amber-600 text-white px-5 py-3 rounded-xl hover:bg-amber-700 transition"
          >
            我的收藏本
          </Link>
        </div>

        <MyWordList
          sets={sets}
          selectedSetId={selectedSet.id}
          onSelectSet={setSelectedSetId}
        />

        <WordForm
          selectedSetId={selectedSet.id}
          selectedSetName={selectedSet.name}
          onAddWord={handleAddWord}
        />

        <BulkImportForm
          selectedSetName={selectedSet.name}
          onBulkImport={handleBulkImport}
        />

        <WordList
          words={selectedSet.words}
          selectedSetName={selectedSet.name}
          onDeleteWord={handleDeleteWord}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={(word) => isBookmarked(selectedSet.id, word)}
        />
      </div>
    </main>
  );
}