"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";
import { useCharacterStore } from "../../store/characterStore";
import { useGachaPityStore } from "../../store/gachaPityStore";
import { drawCharacter } from "../../lib/gacha";
import { GAME_BALANCE } from "../../config/gameBalance";
import type { GachaCharacter } from "../../data/gachaPool";

const GACHA_COST = GAME_BALANCE.gacha.costPerDraw;

function getStarStyle(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "bg-slate-100 text-slate-700";
    case 4:
      return "bg-blue-100 text-blue-700";
    case 5:
      return "bg-purple-100 text-purple-700";
    case 6:
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
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
  const [message, setMessage] = useState(`花費 ${GACHA_COST} 代幣，試試你的手氣吧！`);

  function handleDraw() {
    if (!hasHydrated) {
      setMessage("資料讀取中，請稍候再抽卡。");
      return;
    }

    if (coins < GACHA_COST) {
      setMessage("代幣不足，先去冒險賺代幣吧！");
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
    setMessage(`恭喜你抽中了 ${character.stars} 星角色：${character.name}！`);
  }

  return (
    <main className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-800 mb-4 text-center">
          抽卡系統
        </h1>

        <p className="text-center text-xl font-semibold text-yellow-700 mb-2">
          目前代幣：{hasHydrated ? coins : "讀取中..."}
        </p>

        <p className="text-center text-lg text-slate-600 mb-2">
          已擁有角色數量：{ownedCharacters.length}
        </p>

        <p className="text-center text-lg text-slate-600 mb-8">
          累計抽卡次數：{totalPulls}
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">概率與保底</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm md:text-base">
  <div className="bg-slate-100 text-slate-700 rounded-xl p-3">三星：40%</div>
  <div className="bg-blue-100 text-blue-700 rounded-xl p-3">四星：50%</div>
  <div className="bg-purple-100 text-purple-700 rounded-xl p-3">五星：8%</div>
  <div className="bg-yellow-100 text-yellow-700 rounded-xl p-3">六星：2%</div>
</div>

          <div className="text-slate-600 space-y-2">
            <p>五星以上保底：{pullsSinceFiveStarOrAbove} / {GAME_BALANCE.gacha.pity.fiveStarOrAbove}</p>
            <p>六星保底：{pullsSinceSixStar} / {GAME_BALANCE.gacha.pity.sixStar}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-slate-600 text-lg mb-6">
            單抽消耗 {GACHA_COST} 代幣
          </p>

          <button
            onClick={handleDraw}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition mb-6"
          >
            單抽一次
          </button>

          <div className="bg-slate-100 rounded-xl p-4 mb-6 text-slate-700 text-lg">
            {message}
          </div>

          {result && (
            <div className="rounded-2xl p-6 mb-6 border-2 border-purple-200 bg-white shadow">
              <p className="text-lg text-slate-600 mb-3">抽卡結果</p>

              <div
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${getStarStyle(
                  result.stars
                )}`}
              >
                {result.stars} 星
              </div>

              <h2 className="text-3xl font-bold text-purple-800 mb-2">
                {result.name}
              </h2>

              <p className="text-slate-600">你獲得了一名新角色。</p>
            </div>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
            >
              回首頁
            </Link>

            <Link
              href="/battle-select"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              去冒險
            </Link>

            <Link
              href="/collection"
              className="bg-pink-600 text-white px-5 py-3 rounded-xl hover:bg-pink-700 transition"
            >
              查看收藏
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}