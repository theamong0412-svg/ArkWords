"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useCharacterStore } from "../../store/characterStore";
import { useCurrencyStore } from "../../store/currencyStore";
import { useActiveCharacterStore } from "../../store/activeCharacterStore";
import type { GachaCharacter } from "../../data/gachaPool";

type GroupedCharacter = {
  id: number;
  name: string;
  stars: 3 | 4 | 5 | 6;
  count: number;
  portrait?: string;
  battleMedia?: string;
};

function getStarStyle(stars: 3 | 4 | 5 | 6) {
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

function getCardStyle(stars: 3 | 4 | 5 | 6) {
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

function getCharacterIcon(stars: 3 | 4 | 5 | 6) {
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

function groupCharacters(characters: GachaCharacter[]): GroupedCharacter[] {
  const map = new Map<number, GroupedCharacter>();

  for (const character of characters) {
    const existing = map.get(character.id);

    if (existing) {
      existing.count += 1;
    } else {
      map.set(character.id, {
        id: character.id,
        name: character.name,
        stars: character.stars,
        count: 1,
        portrait: character.portrait,
        battleMedia: character.battleMedia,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.stars !== a.stars) {
      return b.stars - a.stars;
    }
    return a.id - b.id;
  });
}

export default function CollectionPage() {
 
  const { ownedCharacters, removeCharacterById } = useCharacterStore();
  const { coins, addCoins, hasHydrated } = useCurrencyStore();
  const { activeCharacterId, setActiveCharacterId } = useActiveCharacterStore();

  const groupedCharacters = useMemo(() => {
    return groupCharacters(ownedCharacters);
  }, [ownedCharacters]);

  const activeCharacter = groupedCharacters.find(
    (character) => character.id === activeCharacterId
  );

  function handleDismissCharacter(characterId: number) {
    addCoins(20);
    removeCharacterById(characterId);
  }

  function handleSetActiveCharacter(characterId: number) {
  setActiveCharacterId(characterId);
}
  return (
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/20 bg-pink-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-200/80">
                Character Archive
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                乾員收藏
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                在這裡管理乾員、設置當前出戰乾員。戰鬥頁會顯示你目前選中的出戰乾員形象。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                  Unique Characters
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {groupedCharacters.length}
                </p>
              </div>

              <div className="rounded-2xl border border-pink-300/15 bg-pink-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-200/70">
                  Total Owned
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {ownedCharacters.length}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Coins
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {hasHydrated ? coins : "讀取中..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="game-panel p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
              每解雇一名乾員，他們會爲你留下 <span className="font-black">20 合成玉。但你真的要這麽做嗎，博士？</span>。
            </div>

            <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4 text-sm leading-7 text-violet-100">
              當前出戰乾員：
              <span className="ml-2 font-black text-white">
                {activeCharacter?.name ?? "尚未設定"}
              </span>
            </div>
          </div>
        </section>

        {groupedCharacters.length === 0 ? (
          <section className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-5xl">
              🎴
            </div>

            <h2 className="mt-6 text-2xl font-black text-white sm:text-3xl">
              你還沒有任何乾員
            </h2>

            <p className="mt-4 text-slate-300">
              先去抽卡，把第一位乾員帶回收藏頁吧。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/gacha" className="primary-button">
                前往尋訪
              </Link>

              <Link href="/" className="secondary-button">
                回首頁
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {groupedCharacters.map((character) => {
                const isActive = activeCharacterId === character.id;

                return (
                  <article
                    key={character.id}
                    className={`group overflow-hidden rounded-[28px] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${getCardStyle(
                      character.stars
                    )}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${getStarStyle(
                          character.stars
                        )}`}
                      >
                        {character.stars} 星
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                        × {character.count}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40">
                        <div className="absolute h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
                        <div className="relative z-10 text-6xl">
                          {getCharacterIcon(character.stars)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h2 className="text-2xl font-black text-white">
                        {character.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">
                        乾員編號：#{character.id}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        收藏頁與抽卡頁會顯示靜態立繪。
                        <br />
                        戰鬥頁會顯示對應角色動畫。
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSetActiveCharacter(character.id)}
                        className={
                          isActive
                            ? "rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg"
                            : "rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                        }
                      >
                        {isActive ? "當前出戰" : "設為出戰"}
                      </button>

                      <button
                        onClick={() => handleDismissCharacter(character.id)}
                        className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        解雇（+20合成玉）
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="game-panel p-5 sm:p-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/gacha" className="primary-button">
                  繼續尋訪
                </Link>

                <Link
                  href="/battle-select"
                  className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
                >
                  去冒險
                </Link>

                <Link href="/" className="secondary-button">
                  回首頁
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}