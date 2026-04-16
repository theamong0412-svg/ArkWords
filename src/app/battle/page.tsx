"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import { useNotebookStore } from "../../store/notebookStore";
import { generateQuestion } from "../../lib/question";
import { GAME_BALANCE } from "../../config/gameBalance";
import BattleStatus from "../../components/battle/BattleStatus";
import AnswerOptions from "../../components/battle/AnswerOptions";

export default function BattlePage() {
  const { coins, addCoins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { addBookmarkedWord } = useNotebookStore();

  const currentSet = useMemo(() => {
    return sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];
  }, [sets, selectedSetId]);

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

      setMessage("回答正確！你攻擊了怪物！");
    } else {
      const newPlayerHp = Math.max(playerHp - wrongDamage, 0);
      setPlayerHp(newPlayerHp);

      addBookmarkedWord(currentSet.id, {
        word: question.word,
        meaning: question.correctAnswer,
      });

      if (newPlayerHp === 0) {
        setMessage("你被怪物打敗了！錯題已自動加入當前詞庫收藏本。");
        setGameOver(true);
        return;
      }

      setMessage("回答錯誤！怪物攻擊了你！錯題已自動加入當前詞庫收藏本。");
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

  if (!currentSet) {
    return (
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-3xl font-black text-white">開始冒險</h1>
            <p className="mt-4 text-slate-300">目前沒有可用詞庫。</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className="secondary-button">
                返回主頁
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (currentSet.words.length < 4 || !question) {
    return (
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-4xl">
              📚
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              Battle Locked
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
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
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                Battle Stage
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                開始冒險
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                回答正確就能攻擊怪物，回答錯誤則會受傷，錯題也會自動加入當前詞庫收藏本。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Coins
                </p>
                <p className="mt-2 text-2xl font-black text-amber-100">
                  {hasHydrated ? coins.toLocaleString() : "讀取中..."}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/15 bg-violet-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200/70">
                  Vocabulary Set
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {currentSet.name}
                </p>
              </div>
            </div>
          </div>
        </section>

        <BattleStatus
          playerHp={playerHp}
          playerMaxHp={playerMaxHp}
          monsterHp={monsterHp}
          monsterMaxHp={monsterMaxHp}
        />

        <section className="game-panel overflow-hidden p-4 sm:p-6">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 sm:p-6">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Question
            </p>

            <p className="mt-3 text-center text-sm text-slate-300">
              請選擇這個單詞的正確中文意思
            </p>

            <h2 className="mt-4 break-words text-center text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              {question.word}
            </h2>
          </div>

          <div className="mt-4">
            <AnswerOptions
              options={question.options}
              onAnswer={checkAnswer}
              disabled={gameOver}
            />
          </div>

          <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-center text-sm leading-7 text-slate-200 sm:text-base">
            {message}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {gameOver && (
              <button onClick={restartGame} className="primary-button">
                重新開始
              </button>
            )}

            <Link href="/notebook" className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base">
              查看收藏本
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