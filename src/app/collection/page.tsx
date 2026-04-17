"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";

import { useCharacterStore } from "../../store/characterStore";
import { useCurrencyStore } from "../../store/currencyStore";
import { useActiveCharacterStore } from "../../store/activeCharacterStore";
import type { GachaCharacter } from "../../data/gachaPool";
import { gachaPool } from "../../data/gachaPool";

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

function getCardStyle(stars: 3 | 4 | 5 | 6) {
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

function getPortraitGlow(stars: 3 | 4 | 5 | 6) {
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
    <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="terminal-shell cut-panel noise-overlay p-5 sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-[#a65a22]/8 to-transparent" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="metal-label">Character Archive</div>
                <div className="hazard-chip">Operator Collection</div>
              </div>

              <h1 className="mt-4 text-3xl font-black text-[#fff1d8] sm:text-4xl lg:text-5xl">
                乾員收藏
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7c2a4] sm:text-base">
                在這裡管理乾員、設置當前出戰乾員。戰鬥頁會顯示你目前選中的出戰乾員形象。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[560px]">
              <div className="stat-card">
                <p className="stat-label">Unique Characters</p>
                <p className="stat-value">{groupedCharacters.length}</p>
              </div>

              <div className="stat-card">
                <p className="stat-label">Total Owned</p>
                <p className="stat-value">{ownedCharacters.length}</p>
              </div>

              <div className="stat-card">
                <p className="stat-label">Coins</p>
                <p className="stat-value">
                  {hasHydrated ? coins : "讀取中..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="terminal-shell noise-overlay p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="info-card info-card-b p-4 text-sm leading-7 text-[#f0dfc1]">
              每解雇一名乾員，他們會爲你留下{" "}
              <span className="font-black">20 合成玉。但你真的要這麽做嗎，博士？</span>。
            </div>

            <div className="info-card info-card-c p-4 text-sm leading-7 text-[#f0dfc1]">
              當前出戰乾員：
              <span className="ml-2 font-black text-[#fff1d8]">
                {activeCharacter?.name ?? "尚未設定"}
              </span>
            </div>
          </div>
        </section>

        {groupedCharacters.length === 0 ? (
          <section className="terminal-shell cut-panel noise-overlay p-8 text-center sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] border border-[#7b5c44] bg-[linear-gradient(180deg,rgba(39,27,19,0.95),rgba(22,16,12,0.98))] text-5xl shadow-[0_16px_32px_rgba(0,0,0,0.28)]">
              🎴
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#fff1d8] sm:text-3xl">
              你還沒有任何乾員
            </h2>

            <p className="mt-4 text-[#d7c2a4]">
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
                const characterMeta =
                  gachaPool.find((item) => item.id === character.id) ?? character;

                return (
                  <article
                    key={character.id}
                    className={[
                      "console-tile noise-overlay group p-5",
                      getCardStyle(character.stars),
                      isActive
                        ? "border-[#c8894e] shadow-[0_18px_34px_rgba(0,0,0,0.3),0_0_0_1px_rgba(201,120,39,0.08)_inset]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div
                        className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${getStarStyle(
                          character.stars
                        )}`}
                      >
                        {character.stars} 星
                      </div>

                      <div className="rounded-full border border-[#6d5440]/50 bg-[#221813]/90 px-3 py-1 text-sm font-semibold text-[#d2b28c]">
                        × {character.count}
                      </div>
                    </div>

                    <div className="relative z-10 mt-5 flex items-center justify-center">
                      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-[24px] border border-[#6d5440]/60 bg-[linear-gradient(180deg,rgba(23,17,14,0.96),rgba(15,11,9,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <div
                          className={`absolute h-36 w-36 rounded-full blur-3xl ${getPortraitGlow(
                            character.stars
                          )}`}
                        />

                        <div className="absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/25 to-transparent" />
                        <div className="absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/15 to-transparent" />

                        {characterMeta.portrait ? (
                          <div className="relative z-10 h-full w-full">
                            <Image
                              src={characterMeta.portrait}
                              alt={character.name}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1280px) 50vw, 320px"
                            />
                          </div>
                        ) : (
                          <div className="relative z-10 flex h-full w-full items-center justify-center text-6xl">
                            {getCharacterIcon(character.stars)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10 mt-5">
                      <p className="console-code">Operator Archive</p>
                      <h2 className="mt-2 text-2xl font-black text-[#fff1d8]">
                        {character.name}
                      </h2>
                      <p className="mt-2 text-sm text-[#a68866]">
                        乾員編號：#{character.id}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#d7c2a4]">
                        收藏頁與抽卡頁會顯示靜態立繪。
                        <br />
                        戰鬥頁會顯示對應角色動畫。
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSetActiveCharacter(character.id)}
                        className={
                          isActive
                            ? "rounded-xl border border-[#c8894e]/60 bg-gradient-to-b from-[#c97827] to-[#8f4a17] px-5 py-3 text-sm font-bold text-[#fff4df] shadow-[0_0_20px_rgba(201,120,39,0.16)]"
                            : "rounded-xl border border-[#8a724f]/55 bg-gradient-to-b from-[#6c7a44] to-[#454f2d] px-5 py-3 text-sm font-bold text-[#f2ecdd] shadow-[0_0_20px_rgba(108,122,68,0.12)] transition duration-300 hover:-translate-y-0.5"
                        }
                      >
                        {isActive ? "當前出戰" : "設為出戰"}
                      </button>

                      <button
                        onClick={() => handleDismissCharacter(character.id)}
                        className="rounded-xl border border-[#a86a56]/50 bg-gradient-to-b from-[#a15435] to-[#6e341f] px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(161,84,53,0.12)] transition duration-300 hover:-translate-y-0.5"
                      >
                        解雇（+20合成玉）
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="terminal-shell noise-overlay p-5 sm:p-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/gacha" className="primary-button">
                  繼續尋訪
                </Link>

                <Link
                  href="/battle-select"
                  className="inline-flex items-center justify-center rounded-xl border border-[#7c8c56]/60 bg-gradient-to-b from-[#677643] to-[#3f4a28] px-6 py-3 text-sm font-bold text-[#f1eddc] shadow-[0_0_20px_rgba(103,118,67,0.14)] transition duration-300 hover:-translate-y-0.5 sm:text-base"
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