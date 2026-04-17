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

  const currentSelectedName =
    sets.find((setItem) => setItem.id === selectedSetId)?.name ?? "未選擇";

  return (
    <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="terminal-shell cut-panel noise-overlay p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-[#a65a22]/8 to-transparent" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="metal-label">Battle Preparation</div>
                <div className="hazard-chip">Adventure Select</div>
              </div>

              <h1 className="mt-4 text-3xl font-black text-[#fff1d8] sm:text-4xl lg:text-5xl">
                選擇冒險詞庫
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7c2a4] sm:text-base">
                選擇一個詞庫開始冒險。出戰乾員可在收藏頁自由設定。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[400px] xl:max-w-[440px]">
              <div className="stat-card">
                <p className="stat-label">Total Sets</p>
                <p className="stat-value">{sets.length}</p>
              </div>

              <div className="stat-card">
                <p className="stat-label">Current Selected</p>
                <p className="mt-2 line-clamp-2 text-lg font-black text-[#fff1d8]">
                  {currentSelectedName}
                </p>
              </div>
            </div>
          </div>
        </section>

        {sets.length === 0 ? (
          <section className="terminal-shell cut-panel noise-overlay p-8 text-center sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] border border-[#7b5c44] bg-[linear-gradient(180deg,rgba(39,27,19,0.95),rgba(22,16,12,0.98))] text-5xl shadow-[0_16px_32px_rgba(0,0,0,0.28)]">
              ⚔️
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#fff1d8] sm:text-3xl">
              目前沒有可用詞庫
            </h2>

            <p className="mt-4 text-[#d7c2a4]">
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
            <section className="console-grid">
              {sets.map((setItem) => {
                const isSelected = selectedSetId === setItem.id;
                const canBattle = setItem.words.length >= 4;

                return (
                  <article
                    key={setItem.id}
                    className={[
                      "console-tile noise-overlay",
                      isSelected
                        ? "border-[#c8894e] bg-[linear-gradient(180deg,rgba(40,27,19,0.98),rgba(22,15,12,0.98))] shadow-[0_18px_34px_rgba(0,0,0,0.3),0_0_0_1px_rgba(201,120,39,0.08)_inset]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          isSelected
                            ? "border border-[#c8894e]/35 bg-[#3a2618]/90 text-[#f0bf86]"
                            : "border border-[#6d5440]/50 bg-[#221813]/90 text-[#d2b28c]",
                        ].join(" ")}
                      >
                        {isSelected ? "當前選中" : "可選詞庫"}
                      </div>

                      <div
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          canBattle
                            ? "border border-[#7a9651]/35 bg-[#29311c]/90 text-[#c7dba0]"
                            : "border border-[#9f6348]/35 bg-[#311d18]/90 text-[#efb299]",
                        ].join(" ")}
                      >
                        {canBattle ? "可開始冒險" : "至少需要 4 個單詞"}
                      </div>
                    </div>

                    <div className="relative z-10 mt-5">
                      <p className="console-code">Vocabulary Module</p>
                      <h2 className="mt-2 break-words text-2xl font-black text-[#fff1d8]">
                        {setItem.name}
                      </h2>
                    </div>

                    <p className="relative z-10 mt-3 min-h-[56px] text-sm leading-7 text-[#d7c2a4]">
                      {setItem.description || "這個詞庫目前還沒有描述。"}
                    </p>

                    <div className="relative z-10 mt-4 rounded-[20px] border border-[#5d4939] bg-[#120e0b]/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a68866]">
                        Words
                      </p>
                      <p className="mt-2 text-2xl font-black text-[#fff1d8]">
                        {setItem.words.length}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelect(setItem.id)}
                      disabled={!canBattle}
                      className={[
                        "relative z-10 mt-5 w-full rounded-xl px-5 py-3 text-sm font-bold transition duration-300 sm:text-base",
                        canBattle
                          ? "border border-[#d28a48]/60 bg-gradient-to-b from-[#c97827] to-[#8f4a17] text-[#fff4df] shadow-[0_0_20px_rgba(201,120,39,0.16)] hover:-translate-y-0.5"
                          : "cursor-not-allowed border border-[#5c4a3b] bg-[#40342c] text-[#c3b19e]",
                      ].join(" ")}
                    >
                      {isSelected ? "使用這個詞庫冒險" : "選擇這個詞庫"}
                    </button>
                  </article>
                );
              })}
            </section>

            <section className="terminal-shell noise-overlay p-5 sm:p-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/" className="secondary-button">
                  回首頁
                </Link>

                <Link
                  href="/vocabulary"
                  className="inline-flex items-center justify-center rounded-xl border border-[#7c8c56]/60 bg-gradient-to-b from-[#677643] to-[#3f4a28] px-6 py-3 text-sm font-bold text-[#f1eddc] shadow-[0_0_20px_rgba(103,118,67,0.14)] transition duration-300 hover:-translate-y-0.5 sm:text-base"
                >
                  詞庫管理
                </Link>

                <Link
                  href="/collection"
                  className="inline-flex items-center justify-center rounded-xl border border-[#c08655]/60 bg-gradient-to-b from-[#a86435] to-[#6d3b1f] px-6 py-3 text-sm font-bold text-[#fff1df] shadow-[0_0_20px_rgba(168,100,53,0.14)] transition duration-300 hover:-translate-y-0.5 sm:text-base"
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