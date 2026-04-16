"use client";

import Link from "next/link";
import { useCurrencyStore } from "../store/currencyStore";
import { useNotebookStore } from "../store/notebookStore";
import { useVocabularyStore } from "../store/vocabularyStore";
import { useVocabularySetStore } from "../store/vocabularySetStore";

export default function Home() {
  const { coins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { hasHydrated: notebookHydrated, getBookmarkedWords } =
    useNotebookStore();

  const currentSet =
    sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];

  const notebookCount =
    notebookHydrated && currentSet ? getBookmarkedWords(currentSet.id).length : 0;

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[620px]">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          單詞勇者 Word RPG
        </h1>

        <p className="text-slate-600 text-lg mb-4">
          我的第一個背單詞遊戲網站！
        </p>

        <p className="text-slate-700 text-xl font-semibold mb-2">
          目前代幣：{hasHydrated ? coins : "讀取中..."}
        </p>

        <p className="text-slate-600 text-base mb-2">
          當前詞庫：{currentSet?.name ?? "未選擇"}
        </p>

        <p className="text-slate-600 text-base mb-8">
          當前詞庫收藏本數量：
          {notebookHydrated ? notebookCount : "讀取中..."}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/battle-select"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            開始冒險
          </Link>

          <Link
            href="/vocabulary"
            className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
          >
            詞庫管理
          </Link>

          <Link
            href="/gacha"
            className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition"
          >
            抽卡系統
          </Link>

          <Link
            href="/collection"
            className="bg-pink-600 text-white px-5 py-3 rounded-xl hover:bg-pink-700 transition"
          >
            角色收藏
          </Link>

          <Link
            href="/notebook"
            className="bg-amber-600 text-white px-5 py-3 rounded-xl hover:bg-amber-700 transition"
          >
            我的收藏本
          </Link>

          <Link
            href="/notebook-battle"
            className="bg-orange-600 text-white px-5 py-3 rounded-xl hover:bg-orange-700 transition"
          >
            收藏本特訓
          </Link>
        </div>
      </div>
    </main>
  );
}