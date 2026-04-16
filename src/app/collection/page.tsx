"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCharacterStore } from "../../store/characterStore";
import type { GachaCharacter } from "../../data/gachaPool";

type GroupedCharacter = {
  id: number;
  name: string;
  stars: 3 | 4 | 5 | 6;
  count: number;
};

function getStarStyle(stars: 3 | 4 | 5 | 6) {
  switch (stars) {
    case 3:
      return "bg-slate-100 text-slate-700 border-slate-300";
    case 4:
      return "bg-blue-100 text-blue-700 border-blue-300";
    case 5:
      return "bg-purple-100 text-purple-700 border-purple-300";
    case 6:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
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

  const groupedCharacters = useMemo(() => {
    return groupCharacters(ownedCharacters);
  }, [ownedCharacters]);

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-800 mb-4 text-center">
          角色收藏
        </h1>

        <p className="text-center text-lg text-slate-600 mb-2">
          已擁有角色種類：{groupedCharacters.length}
        </p>

        <p className="text-center text-lg text-slate-600 mb-8">
          累計角色總數：{ownedCharacters.length}
        </p>

        {groupedCharacters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <p className="text-xl text-slate-600 mb-6">
              你還沒有任何角色，先去抽卡吧！
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/gacha"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition"
              >
                前往抽卡
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {groupedCharacters.map((character) => (
                <div
                  key={character.id}
                  className="bg-white rounded-2xl shadow p-6 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${getStarStyle(
                        character.stars
                      )}`}
                    >
                      {character.stars} 星
                    </div>

                    <div className="text-sm font-semibold text-slate-500">
                      持有數量 × {character.count}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {character.name}
                  </h2>

                  <p className="text-slate-500 mb-4">角色編號：#{character.id}</p>

                  <button
                    onClick={() => removeCharacterById(character.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    刪除一張（測試用）
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/gacha"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition"
              >
                繼續抽卡
              </Link>

              <Link
                href="/"
                className="bg-slate-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition"
              >
                回首頁
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}