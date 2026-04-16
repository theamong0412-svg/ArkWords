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
    activeCharacterMeta?.name ?? ownedActiveCharacter?.name ?? "博士";
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
        setMessage(`你打敗敵人了！獲得 ${rewardCoins} 合成玉！`);
        setGameOver(true);
        return;
      }

      setMessage("回答正確！你攻擊了敵人！");
    } else {
      const newPlayerHp = Math.max(playerHp - wrongDamage, 0);
      setPlayerHp(newPlayerHp);

      addBookmarkedWord(currentSet.id, {
        word: question.word,
        meaning: question.correctAnswer,
      });

      if (newPlayerHp === 0) {
        setMessage("博士，你被打敗了！正在與羅德島失去神經連接...錯題已自動加入當前詞庫收藏本。");
        setGameOver(true);
        return;
      }

      setMessage("回答錯誤！敵人攻擊了你！錯題已自動加入當前詞庫收藏本。");
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
      <div className="mx-auto w-full max-w-7xl">
        <section className="game-panel overflow-hidden p-3 sm:p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_240px]">
            <div className="min-w-0">
              {/* 第一個 panel：角色 / 單詞 / 怪物 */}
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/35 p-4 sm:p-5">
                <div className="grid items-center gap-4 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
                  {/* 玩家 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[24px] border border-cyan-300/25 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:h-44 sm:w-44">
                      {playerBattleMedia ? (
                        <CharacterVideo
                          src={playerBattleMedia}
                          alt={playerDisplayName}
                          className="h-full w-full object-contain scale-220"
                        />
                      ) : (
                        <span className="text-5xl sm:text-6xl">🧙</span>
                      )}
                    </div>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">
                      Player
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      {playerDisplayName}
                    </h2>

                    <div className="mt-3 w-full max-w-[140px]">
                      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>HP</span>
                        <span>
                          {playerHp}/{playerMaxHp}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                          style={{ width: `${playerPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 中間題目 */}
                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-fuchsia-300/15 bg-fuchsia-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-200/75">
                      Question
                    </div>

                    <p className="mt-3 text-sm text-slate-300">
                      請選擇這個單詞的正確中文意思
                    </p>

                    <h1 className="mt-4 break-words text-5xl font-black text-white sm:text-6xl xl:text-7xl">
                      {question.word}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <div className="rounded-full border border-amber-300/15 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
                        ：{hasHydrated ? coins.toLocaleString() : "讀取中..."}
                      </div>
                      <div className="rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                        詞庫：{currentSet.name}
                      </div>
                    </div>
                  </div>

                  {/* 怪物 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-40 w-40 items-center justify-center rounded-[24px] border border-rose-300/25 bg-rose-400/10 text-5xl shadow-[0_0_24px_rgba(244,63,94,0.18)] sm:h-44 sm:w-44 sm:text-6xl">
                      👾
                    </div>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200/75">
                      Monster
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      怪物
                    </h2>

                    <div className="mt-3 w-full max-w-[140px]">
                      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>HP</span>
                        <span>
                          {monsterHp}/{monsterMaxHp}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${monsterPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 第二個 panel：選項 */}
              <div className="mt-3 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/35 p-4 sm:p-5">
                <AnswerOptions
                  options={question.options}
                  onAnswer={checkAnswer}
                  disabled={gameOver}
                />
              </div>
            </div>

            {/* 右側 */}
            <div className="flex flex-col gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200 xl:min-h-[150px]">
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