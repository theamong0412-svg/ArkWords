"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";
import { useCharacterStore } from "../../store/characterStore";
import { useGachaPityStore } from "../../store/gachaPityStore";
import { drawCharacter } from "../../lib/gacha";
import { GAME_BALANCE } from "../../config/gameBalance";
import { gachaPool, type GachaCharacter } from "../../data/gachaPool";

const GACHA_COST = GAME_BALANCE.gacha.costPerDraw;

function getStarBadgeStyle(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "border-slate-300/20 bg-slate-400/15 text-slate-200";
    case 4:
      return "border-sky-300/20 bg-sky-400/15 text-sky-200";
    case 5:
      return "border-violet-300/20 bg-violet-400/15 text-violet-200";
    case 6:
      return "border-amber-300/20 bg-amber-400/15 text-amber-100";
    default:
      return "border-slate-300/20 bg-slate-400/15 text-slate-200";
  }
}

function getResultCardStyle(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "border-slate-300/15 bg-gradient-to-br from-slate-400/10 via-slate-900/50 to-slate-950/80";
    case 4:
      return "border-sky-300/15 bg-gradient-to-br from-sky-400/10 via-slate-900/50 to-slate-950/80";
    case 5:
      return "border-violet-300/15 bg-gradient-to-br from-violet-400/10 via-fuchsia-500/10 to-slate-950/80";
    case 6:
      return "border-amber-300/20 bg-gradient-to-br from-amber-300/15 via-orange-400/10 to-slate-950/80";
    default:
      return "border-slate-300/15 bg-gradient-to-br from-slate-400/10 via-slate-900/50 to-slate-950/80";
  }
}

function getStarText(stars: 3 | 4 | 5 | 6) {
  return "★".repeat(stars);
}

function getResultGlow(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "shadow-[0_0_40px_rgba(148,163,184,0.15)]";
    case 4:
      return "shadow-[0_0_40px_rgba(56,189,248,0.18)]";
    case 5:
      return "shadow-[0_0_45px_rgba(168,85,247,0.22)]";
    case 6:
      return "shadow-[0_0_55px_rgba(251,191,36,0.28)]";
    default:
      return "shadow-[0_0_40px_rgba(148,163,184,0.15)]";
  }
}

function getFallbackIcon(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 6:
      return "👑";
    case 5:
      return "✨";
    case 4:
      return "🌟";
    case 3:
      return "⚔️";
    default:
      return "⚔️";
  }
}

export default function GachaPage() {
  const { coins, spendCoins, hasHydrated } = useCurrencyStore();
  const { ownedCharacters, addCharacter } = useCharacterStore();
  const {
    totalPulls,
    pullsSinceFiveStarOrAbove,
    pullsSinceSixStar,
    recordPullResult,
  } = useGachaPityStore();

  const [result, setResult] = useState<GachaCharacter | null>(null);
  const [message, setMessage] = useState(
    `花費 ${GACHA_COST} 合成玉，拯救失落的乾員。`
  );

  const duplicateCount = useMemo(() => {
    if (!result) return 0;
    return ownedCharacters.filter((character) => character.name === result.name)
      .length;
  }, [ownedCharacters, result]);

  const resultMeta = useMemo(() => {
    if (!result) return null;
    return gachaPool.find((character) => character.id === result.id) ?? result;
  }, [result]);

  function handleDraw() {
    if (!hasHydrated) {
      setMessage("資料讀取中，請稍候再抽卡。");
      return;
    }

    if (coins < GACHA_COST) {
      setMessage("【錯誤】合成玉不足。");
      return;
    }

    const character = drawCharacter({
      pullsSinceFiveStarOrAbove,
      pullsSinceSixStar,
    });

    spendCoins(GACHA_COST);
    addCharacter(character);
    recordPullResult(character.stars);
    setResult(character);
    setMessage(`你尋訪到了 ${character.stars} 星乾員：${character.name}。`);
  }

  return (
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/80">
                Summon Gate
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                尋訪系統
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                消耗合成玉尋訪乾員，累積抽數吃保底，收集你的專屬乾員圖鑑吧，博士。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Coins
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {hasHydrated ? coins.toLocaleString() : "讀取中..."}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                  Owned
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {ownedCharacters.length}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/70">
                  Total Pulls
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {totalPulls}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="game-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Rates
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  概率與保底
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                單次尋訪消耗{" "}
                <span className="font-bold text-white">{GACHA_COST}</span> 合成玉。
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-300/15 bg-slate-400/10 p-4 text-center">
                <p className="text-sm font-bold text-slate-100">三星</p>
                <p className="mt-2 text-xl font-black text-white">40%</p>
              </div>

              <div className="rounded-2xl border border-sky-300/15 bg-sky-400/10 p-4 text-center">
                <p className="text-sm font-bold text-sky-100">四星</p>
                <p className="mt-2 text-xl font-black text-white">50%</p>
              </div>

              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4 text-center">
                <p className="text-sm font-bold text-violet-100">五星</p>
                <p className="mt-2 text-xl font-black text-white">8%</p>
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4 text-center">
                <p className="text-sm font-bold text-amber-100">六星</p>
                <p className="mt-2 text-xl font-black text-white">2%</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>五星以上保底</span>
                  <span className="font-bold text-white">
                    {pullsSinceFiveStarOrAbove} /{" "}
                    {GAME_BALANCE.gacha.pity.fiveStarOrAbove}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (pullsSinceFiveStarOrAbove /
                          GAME_BALANCE.gacha.pity.fiveStarOrAbove) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>六星保底</span>
                  <span className="font-bold text-white">
                    {pullsSinceSixStar} / {GAME_BALANCE.gacha.pity.sixStar}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (pullsSinceSixStar / GAME_BALANCE.gacha.pity.sixStar) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-cyan-400/5 p-5">
              <p className="text-sm leading-7 text-slate-200">{message}</p>

              <button onClick={handleDraw} className="primary-button mt-5 w-full">
                尋訪一次
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/" className="secondary-button">
                回首頁
              </Link>

              <Link
                href="/battle-select"
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                去冒險
              </Link>

              <Link
                href="/collection"
                className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                角色收藏
              </Link>
            </div>
          </section>

          <section className="game-panel p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Latest Result
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  尋訪結果
                </h2>
              </div>

              {result && (
                <div
                  className={`rounded-full border px-4 py-2 text-sm font-bold ${getStarBadgeStyle(
                    result.stars
                  )}`}
                >
                  {result.stars} 星
                </div>
              )}
            </div>

            {!result ? (
              <div className="mt-6 flex min-h-[460px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
                <div>
                  <div className="text-6xl">🎴</div>
                  <p className="mt-4 text-lg">尚未尋訪，開始你的第一次抽卡吧。</p>
                </div>
              </div>
            ) : (
              <div
                className={`mt-6 overflow-hidden rounded-[30px] border p-5 sm:p-6 ${getResultCardStyle(
                  result.stars
                )} ${getResultGlow(result.stars)}`}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Operator Acquired
                      </p>
                      <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                        {result.name}
                      </h3>
                    </div>

                    <div
                      className={`rounded-full border px-4 py-2 text-sm font-bold ${getStarBadgeStyle(
                        result.stars
                      )}`}
                    >
                      {getStarText(result.stars)}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 p-4 sm:p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

                    <div className="relative z-10 flex aspect-[4/5] w-full items-center justify-center">
                      {resultMeta?.portrait ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={resultMeta.portrait}
                            alt={result.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1280px) 60vw, 420px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/5">
                          <div className="text-7xl">
                            {getFallbackIcon(result.stars)}
                          </div>

                          <p className="mt-5 text-center text-sm leading-6 text-slate-300">
                            角色立繪占位區
                            <br />
                            後續可在 gachaPool.ts 中補上{" "}
                            <span className="font-mono text-cyan-200">
                              portrait
                            </span>
                            。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Character ID
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        #{result.id}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Duplicate
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        {duplicateCount > 1 ? `已持有 ${duplicateCount - 1} 張` : "首次獲得"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Pull Cost
                      </p>
                      <p className="mt-2 text-xl font-black text-white">
                        {GACHA_COST}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleDraw} className="primary-button">
                      再尋訪一次
                    </button>

                    <Link href="/collection" className="secondary-button">
                      查看收藏
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}