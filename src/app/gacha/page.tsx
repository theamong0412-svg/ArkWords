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
      return "border-[#8b765f]/40 bg-[#2b211a]/90 text-[#d8c2a4]";
    case 4:
      return "border-[#8e8457]/40 bg-[#2d2b1b]/90 text-[#d8d2a4]";
    case 5:
      return "border-[#9a734f]/40 bg-[#312116]/90 text-[#e3c097]";
    case 6:
      return "border-[#c38a4c]/45 bg-[#3a2618]/90 text-[#f0bf86]";
    default:
      return "border-[#8b765f]/40 bg-[#2b211a]/90 text-[#d8c2a4]";
  }
}

function getResultCardStyle(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "border-[#655241] bg-[linear-gradient(180deg,rgba(29,23,19,0.98),rgba(18,14,11,0.98))]";
    case 4:
      return "border-[#6f6645] bg-[linear-gradient(180deg,rgba(31,29,19,0.98),rgba(18,14,11,0.98))]";
    case 5:
      return "border-[#7a5a42] bg-[linear-gradient(180deg,rgba(34,24,18,0.98),rgba(19,14,11,0.98))]";
    case 6:
      return "border-[#9a6b3d] bg-[linear-gradient(180deg,rgba(40,27,19,0.98),rgba(21,15,12,0.98))]";
    default:
      return "border-[#655241] bg-[linear-gradient(180deg,rgba(29,23,19,0.98),rgba(18,14,11,0.98))]";
  }
}

function getStarText(stars: 3 | 4 | 5 | 6) {
  return "★".repeat(stars);
}

function getResultGlow(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "shadow-[0_0_36px_rgba(130,110,90,0.12)]";
    case 4:
      return "shadow-[0_0_40px_rgba(141,134,93,0.14)]";
    case 5:
      return "shadow-[0_0_45px_rgba(166,107,63,0.16)]";
    case 6:
      return "shadow-[0_0_55px_rgba(207,125,41,0.22)]";
    default:
      return "shadow-[0_0_36px_rgba(130,110,90,0.12)]";
  }
}

function getResultGlowBg(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "bg-[#8a7766]/12";
    case 4:
      return "bg-[#8d865d]/14";
    case 5:
      return "bg-[#a66b3f]/14";
    case 6:
      return "bg-[#cf7d29]/18";
    default:
      return "bg-[#8a7766]/12";
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
    <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="terminal-shell cut-panel noise-overlay p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-[#a65a22]/8 to-transparent" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="metal-label">Summon Gate</div>
                <div className="hazard-chip">Recruitment Terminal</div>
              </div>

              <h1 className="mt-4 text-3xl font-black text-[#fff1d8] sm:text-4xl lg:text-5xl">
                尋訪系統
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7c2a4] sm:text-base">
                消耗合成玉尋訪乾員，累積抽數吃保底，收集你的專屬乾員圖鑑吧，博士。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[560px]">
              <div className="stat-card">
                <p className="stat-label">Coins</p>
                <p className="stat-value">
                  {hasHydrated ? coins.toLocaleString() : "讀取中..."}
                </p>
              </div>

              <div className="stat-card">
                <p className="stat-label">Owned</p>
                <p className="stat-value">{ownedCharacters.length}</p>
              </div>

              <div className="stat-card">
                <p className="stat-label">Total Pulls</p>
                <p className="stat-value">{totalPulls}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="terminal-shell noise-overlay p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a68866]">
                  Rates
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#fff1d8]">
                  概率與保底
                </h2>
              </div>

              <div className="rounded-full border border-[#6d5440]/50 bg-[#221813]/90 px-4 py-2 text-sm text-[#d7c2a4]">
                單次尋訪消耗{" "}
                <span className="font-bold text-[#fff1d8]">{GACHA_COST}</span> 合成玉。
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="info-card info-card-c p-4 text-center">
                <p className="text-sm font-bold text-[#d8c2a4]">三星</p>
                <p className="mt-2 text-xl font-black text-[#fff1d8]">40%</p>
              </div>

              <div className="info-card info-card-a p-4 text-center">
                <p className="text-sm font-bold text-[#d8d2a4]">四星</p>
                <p className="mt-2 text-xl font-black text-[#fff1d8]">50%</p>
              </div>

              <div className="info-card info-card-b p-4 text-center">
                <p className="text-sm font-bold text-[#e3c097]">五星</p>
                <p className="mt-2 text-xl font-black text-[#fff1d8]">8%</p>
              </div>

              <div className="rounded-[24px] border border-[#9a6b3d]/70 bg-[linear-gradient(180deg,rgba(48,31,20,0.96),rgba(24,16,11,0.98))] p-4 text-center shadow-[0_18px_30px_rgba(0,0,0,0.24)]">
                <p className="text-sm font-bold text-[#f0bf86]">六星</p>
                <p className="mt-2 text-xl font-black text-[#fff1d8]">2%</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-[22px] border border-[#624c3b] bg-[#17120e]/90 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-[#d7c2a4]">
                  <span>五星以上保底</span>
                  <span className="font-bold text-[#fff1d8]">
                    {pullsSinceFiveStarOrAbove} /{" "}
                    {GAME_BALANCE.gacha.pity.fiveStarOrAbove}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#a86435] to-[#d0833a] transition-all duration-500"
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

              <div className="rounded-[22px] border border-[#624c3b] bg-[#17120e]/90 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-[#d7c2a4]">
                  <span>六星保底</span>
                  <span className="font-bold text-[#fff1d8]">
                    {pullsSinceSixStar} / {GAME_BALANCE.gacha.pity.sixStar}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#d1a15a] to-[#cf7d29] transition-all duration-500"
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

            <div className="mt-6 rounded-[26px] border border-[#9a6b3d]/40 bg-[linear-gradient(180deg,rgba(44,28,19,0.96),rgba(21,15,11,0.98))] p-5 shadow-[0_18px_34px_rgba(0,0,0,0.26)]">
              <p className="text-sm leading-7 text-[#f0dfc1]">{message}</p>

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
                className="inline-flex items-center justify-center rounded-xl border border-[#7c8c56]/60 bg-gradient-to-b from-[#677643] to-[#3f4a28] px-6 py-3 text-sm font-bold text-[#f1eddc] shadow-[0_0_20px_rgba(103,118,67,0.14)] transition duration-300 hover:-translate-y-0.5 sm:text-base"
              >
                去冒險
              </Link>

              <Link
                href="/collection"
                className="inline-flex items-center justify-center rounded-xl border border-[#c08655]/60 bg-gradient-to-b from-[#a86435] to-[#6d3b1f] px-6 py-3 text-sm font-bold text-[#fff1df] shadow-[0_0_20px_rgba(168,100,53,0.14)] transition duration-300 hover:-translate-y-0.5 sm:text-base"
              >
                角色收藏
              </Link>
            </div>
          </section>

          <section className="terminal-shell noise-overlay p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a68866]">
                  Latest Result
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#fff1d8]">
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
              <div className="mt-6 flex min-h-[460px] items-center justify-center rounded-[30px] border border-dashed border-[#6b5240] bg-[linear-gradient(180deg,rgba(25,18,14,0.96),rgba(16,12,10,0.98))] p-8 text-center text-[#a68866]">
                <div>
                  <div className="text-6xl">🎴</div>
                  <p className="mt-4 text-lg text-[#d7c2a4]">
                    尚未尋訪，開始你的第一次抽卡吧。
                  </p>
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
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a68866]">
                        Operator Acquired
                      </p>
                      <h3 className="mt-2 text-3xl font-black text-[#fff1d8] sm:text-4xl">
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

                  <div className="relative overflow-hidden rounded-[28px] border border-[#6d5440]/60 bg-[linear-gradient(180deg,rgba(23,17,14,0.96),rgba(15,11,9,0.98))] p-4 sm:p-5">
                    <div
                      className={`absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl ${getResultGlowBg(
                        result.stars
                      )}`}
                    />
                    <div className="absolute inset-x-8 top-4 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/25 to-transparent" />
                    <div className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/15 to-transparent" />

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
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-[24px] border border-[#6d5440]/60 bg-[#1a1410]/90">
                          <div className="text-7xl">
                            {getFallbackIcon(result.stars)}
                          </div>

                          <p className="mt-5 text-center text-sm leading-6 text-[#d7c2a4]">
                            角色立繪占位區
                            <br />
                            後續可在 gachaPool.ts 中補上{" "}
                            <span className="font-mono text-[#e0b27c]">
                              portrait
                            </span>
                            。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="stat-card">
                      <p className="stat-label">Character ID</p>
                      <p className="mt-2 text-xl font-black text-[#fff1d8]">
                        #{result.id}
                      </p>
                    </div>

                    <div className="stat-card">
                      <p className="stat-label">Duplicate</p>
                      <p className="mt-2 text-xl font-black text-[#fff1d8]">
                        {duplicateCount > 1 ? `已持有 ${duplicateCount - 1} 張` : "首次獲得"}
                      </p>
                    </div>

                    <div className="stat-card">
                      <p className="stat-label">Pull Cost</p>
                      <p className="mt-2 text-xl font-black text-[#fff1d8]">
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