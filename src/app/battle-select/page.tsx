"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";

export default function BattleSelectPage() {
  const router = useRouter();
  const { selectedSetId, setSelectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();

  function handleSelect(setId: string) {
    setSelectedSetId(setId);
    router.push("/battle");
  }

  return (
    <main className="min-h-screen bg-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4 text-center">
          選擇冒險詞庫
        </h1>

        <p className="text-center text-slate-600 mb-8">
          選擇一個詞庫開始冒險。詞庫內容會和詞庫管理頁同步。
        </p>

        {sets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <p className="text-xl text-slate-600 mb-6">目前沒有可用詞庫。</p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/vocabulary"
                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
              >
                前往詞庫管理
              </Link>

              <Link
                href="/"
                className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
              >
                回首頁
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sets.map((setItem) => {
                const isSelected = selectedSetId === setItem.id;
                const canBattle = setItem.words.length >= 4;

                return (
                  <div
                    key={setItem.id}
                    className={`bg-white rounded-2xl shadow p-6 border-2 transition ${
                      isSelected
                        ? "border-indigo-500 shadow-lg"
                        : "border-slate-200"
                    }`}
                  >
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {setItem.name}
                    </h2>

                    <p className="text-slate-600 mb-3">{setItem.description}</p>

                    <p className="text-sm text-slate-500 mb-2">
                      單詞數量：{setItem.words.length}
                    </p>

                    <p
                      className={`text-sm mb-5 ${
                        canBattle ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {canBattle ? "可開始冒險" : "至少需要 4 個單詞"}
                    </p>

                    <button
                      onClick={() => handleSelect(setItem.id)}
                      disabled={!canBattle}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                      {isSelected ? "使用這個詞庫冒險" : "選擇這個詞庫"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/"
                className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
              >
                回首頁
              </Link>

              <Link
                href="/vocabulary"
                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
              >
                詞庫管理
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}