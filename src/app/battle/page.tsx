"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import { useNotebookStore } from "../../store/notebookStore";
import { useCharacterStore } from "../../store/characterStore";
import { useActiveCharacterStore } from "../../store/activeCharacterStore";
import { generateQuestion } from "../../lib/question";
import { GAME_BALANCE } from "../../config/gameBalance";
import { gachaPool } from "../../data/gachaPool";
import AnswerOptions from "../../components/battle/AnswerOptions";
import CharacterVideo from "../../components/ui/CharacterVideo";

export default function BattlePage() {
  const { coins, addCoins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { addBookmarkedWord } = useNotebookStore();
  const { ownedCharacters } = useCharacterStore();
  const { activeCharacterId } = useActiveCharacterStore();

  const currentSet = useMemo(() => {
    return sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];
  }, [sets, selectedSetId]);

  const ownedActiveCharacter = useMemo(() => {
    if (!activeCharacterId) return null;
    return (
      ownedCharacters.find((character) => character.id === activeCharacterId) ??
      null
    );
  }, [ownedCharacters, activeCharacterId]);

  const activeCharacterMeta = useMemo(() => {
    if (!activeCharacterId) return null;
    return gachaPool.find((character) => character.id === activeCharacterId) ?? null;
  }, [activeCharacterId]);

  const playerDisplayName =
    activeCharacterMeta?.name ?? ownedActiveCharacter?.name ?? "玩家";

  const playerBattleMedia = activeCharacterMeta?.battleMedia;

  const playerMaxHp = GAME_BALANCE.battle.playerMaxHp;
  const monsterMaxHp = GAME_BALANCE.battle.monsterMaxHp;
  const correctDamage = GAME_BALANCE.battle.correctDamage;
  const wrongDamage = GAME_BALANCE.battle.wrongDamage;
  const rewardCoins = GAME_BALANCE.battle.rewardCoins;

  const [playerHp, setPlayerHp] = useState<number>(playerMaxHp);
  const [monsterHp, setMonsterHp] = useState<number>(monsterMaxHp);
  const [message, setMessage] = useState("請選擇正確的中文意思");
  const [gameOver, setGameOver] = useState(false);
  const [question, setQuestion] = useState(() =>
    currentSet && currentSet.words.length >= 4
      ? generateQuestion(currentSet.words)
      : null
  );

  useEffect(() => {
    if (currentSet && currentSet.words.length >= 4) {
      setQuestion(generateQuestion(currentSet.words));
      setMessage("請選擇正確的中文意思");
      setGameOver(false);
      setPlayerHp(playerMaxHp);
      setMonsterHp(monsterMaxHp);
    } else {
      setQuestion(null);
    }
  }, [currentSet, playerMaxHp, monsterMaxHp]);

  function checkAnswer(option: string) {
    if (gameOver || !question || !currentSet || currentSet.words.length < 4) {
      return;
    }

    if (option === question.correctAnswer) {
      const newMonsterHp = Math.max(monsterHp - correctDamage, 0);
      setMonsterHp(newMonsterHp);

      if (newMonsterHp === 0) {
        addCoins(rewardCoins);
        setMessage(`你打敗怪物了！獲得 ${rewardCoins} 代幣！`);
        setGameOver(true);
        return;
      }

      setMessage("回答正確！你攻擊了整合運動！");
    } else {
      const newPlayerHp = Math.max(playerHp - wrongDamage, 0);
      setPlayerHp(newPlayerHp);

      addBookmarkedWord(currentSet.id, {
        word: question.word,
        meaning: question.correctAnswer,
      });

      if (newPlayerHp === 0) {
        setMessage("博士，你被擊敗了！正在與羅德島失去連接...錯題已自動加入當前詞庫收藏本。");
        setGameOver(true);
        return;
      }

      setMessage("回答錯誤！整合運動攻擊了你！錯題已自動加入當前詞庫收藏本。");
    }

    setQuestion(generateQuestion(currentSet.words));
  }

  function restartGame() {
    if (!currentSet || currentSet.words.length < 4) return;

    setPlayerHp(playerMaxHp);
    setMonsterHp(monsterMaxHp);
    setMessage("請選擇正確的中文意思");
    setQuestion(generateQuestion(currentSet.words));
    setGameOver(false);
  }

  const playerPercent = Math.max(0, (playerHp / playerMaxHp) * 100);
  const monsterPercent = Math.max(0, (monsterHp / monsterMaxHp) * 100);

  if (!currentSet) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <section className="game-panel p-8 text-center sm:p-10">
            <h1 className="text-3xl font-black text-white">開始冒險</h1>
            <p className="mt-4 text-slate-300">目前沒有可用詞庫。</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="secondary-button">
                返回主頁
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (currentSet.words.length < 4 || !question) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <section className="game-panel p-8 text-center sm:p-10">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              無法開始冒險
            </h1>

            <p className="mt-4 text-slate-200">
              當前詞庫：<span className="font-bold text-white">{currentSet.name}</span>
            </p>

            <p className="mt-3 text-slate-300">
              這個詞庫的單詞數量不足 4 個，暫時無法生成題目。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/vocabulary" className="primary-button">
                去詞庫管理
              </Link>
              <Link href="/" className="secondary-button">
                返回主頁
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
        <section className="game-panel overflow-hidden p-3 sm:p-4 lg:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="rounded-[24px] border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 to-slate-950/40 p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
                  {playerBattleMedia ? (
                    <CharacterVideo
                      src={playerBattleMedia}
                      alt={playerDisplayName}
                      className="h-full w-full object-contain scale-110"
                    />
                  ) : (
                    <span className="text-3xl">🧙</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">
                        Player
                      </p>
                      <h2 className="truncate text-2xl font-black text-white">
                        {playerDisplayName}
                      </h2>
                    </div>

                    <div className="shrink-0 text-right text-sm font-bold text-slate-200">
                      {playerHp} / {playerMaxHp}
                    </div>
                  </div>

                  <div className="mt-2 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                    <div
                      className="flex h-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-green-500 text-[10px] font-bold text-white transition-all duration-500"
                      style={{ width: `${playerPercent}%` }}
                    >
                      {playerHp}
                    </div>
                  </div>

                  <div className="mt-2 flex gap-1.5">
                    {Array.from({ length: playerMaxHp }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-lg ${index < playerHp ? "opacity-100" : "opacity-25"}`}
                      >
                        ❤️
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-black tracking-[0.2em] text-white">
              VS
            </div>

            <div className="rounded-[24px] border border-rose-300/15 bg-gradient-to-l from-rose-400/10 to-slate-950/40 p-3 sm:p-4">
              <div className="flex items-center gap-3 lg:flex-row-reverse">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-400/10 text-3xl shadow-[0_0_20px_rgba(244,63,94,0.18)]">
                  👾
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 lg:flex-row-reverse">
                    <div className="lg:text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200/75">
                        Monster
                      </p>
                      <h2 className="truncate text-2xl font-black text-white">
                        怪物
                      </h2>
                    </div>

                    <div className="shrink-0 text-right text-sm font-bold text-slate-200">
                      {monsterHp} / {monsterMaxHp}
                    </div>
                  </div>

                  <div className="mt-2 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                    <div
                      className="flex h-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-[10px] font-bold text-white transition-all duration-500"
                      style={{ width: `${monsterPercent}%` }}
                    >
                      {monsterHp}
                    </div>
                  </div>

                  <div className="mt-2 flex gap-1.5 lg:justify-end">
                    {Array.from({ length: monsterMaxHp }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2.5 w-2.5 rounded-full ${
                          index < monsterHp
                            ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.7)]"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[26px] border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/40 px-4 py-5 text-center sm:px-6 sm:py-6">
            <div className="mb-2 inline-flex items-center rounded-full border border-fuchsia-300/15 bg-fuchsia-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-200/75">
              Question
            </div>

            <p className="text-sm text-slate-300">請選擇這個單詞的正確中文意思</p>

            <h1 className="mt-3 break-words text-4xl font-black text-white sm:text-5xl xl:text-6xl">
              {question.word}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <div className="rounded-full border border-amber-300/15 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
                代幣：{hasHydrated ? coins.toLocaleString() : "讀取中..."}
              </div>
              <div className="rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                詞庫：{currentSet.name}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_290px]">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
              <AnswerOptions
                options={question.options}
                onAnswer={checkAnswer}
                disabled={gameOver}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
                {message}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex flex-wrap gap-2">
                  {gameOver && (
                    <button onClick={restartGame} className="primary-button w-full">
                      重新開始
                    </button>
                  )}

                  <Link
                    href="/notebook"
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-center text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    查看收藏本
                  </Link>

                  <Link href="/" className="secondary-button w-full justify-center">
                    返回主頁
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}