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
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                Battle Preparation
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                選擇冒險詞庫
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                選擇一個詞庫開始冒險。出戰乾員可在收藏頁自由設定。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/70">
                  Total Sets
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {sets.length}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                  Current Selected
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {sets.find((setItem) => setItem.id === selectedSetId)?.name ??
                    "未選擇"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {sets.length === 0 ? (
          <section className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-5xl">
              ⚔️
            </div>

            <h2 className="mt-6 text-2xl font-black text-white sm:text-3xl">
              目前沒有可用詞庫
            </h2>

            <p className="mt-4 text-slate-300">
              先去詞庫管理建立一些單詞，再來開始冒險吧。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/vocabulary" className="primary-button">
                前往詞庫管理
              </Link>

              <Link href="/" className="secondary-button">
                回首頁
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sets.map((setItem) => {
                const isSelected = selectedSetId === setItem.id;
                const canBattle = setItem.words.length >= 4;

                return (
                  <article
                    key={setItem.id}
                    className={[
                      "rounded-[28px] border p-5 transition duration-300",
                      "hover:-translate-y-1 hover:shadow-2xl",
                      isSelected
                        ? "border-sky-300/25 bg-gradient-to-br from-sky-400/15 via-cyan-400/10 to-slate-950/80 shadow-[0_0_30px_rgba(56,189,248,0.12)]"
                        : "border-white/10 bg-white/5",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                        {isSelected ? "當前選中" : "可選詞庫"}
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          canBattle
                            ? "border border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                            : "border border-rose-300/20 bg-rose-400/10 text-rose-100"
                        }`}
                      >
                        {canBattle ? "可開始冒險" : "至少需要 4 個單詞"}
                      </div>
                    </div>

                    <h2 className="mt-5 text-2xl font-black text-white">
                      {setItem.name}
                    </h2>

                    <p className="mt-3 min-h-[56px] text-sm leading-7 text-slate-300">
                      {setItem.description || "這個詞庫目前還沒有描述。"}
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Words
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">
                        {setItem.words.length}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelect(setItem.id)}
                      disabled={!canBattle}
                      className={[
                        "mt-5 w-full rounded-2xl px-5 py-3 text-sm font-bold transition duration-300 sm:text-base",
                        canBattle
                          ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
                          : "cursor-not-allowed bg-slate-700 text-slate-300",
                      ].join(" ")}
                    >
                      {isSelected ? "使用這個詞庫冒險" : "選擇這個詞庫"}
                    </button>
                  </article>
                );
              })}
            </section>

            <section className="game-panel p-5 sm:p-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/" className="secondary-button">
                  回首頁
                </Link>

                <Link
                  href="/vocabulary"
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                >
                  詞庫管理
                </Link>

                <Link
                  href="/collection"
                  className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                >
                  去設置出戰乾員
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}