"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCurrencyStore } from "../../store/currencyStore";
import { useNotebookStore } from "../../store/notebookStore";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import { generateQuestion } from "../../lib/question";
import { GAME_BALANCE } from "../../config/gameBalance";
import BattleStatus from "../../components/battle/BattleStatus";
import AnswerOptions from "../../components/battle/AnswerOptions";

export default function NotebookBattlePage() {
  const { coins, addCoins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { getBookmarkedWords, addBookmarkedWord } = useNotebookStore();

  const currentSet = useMemo(() => {
    return sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];
  }, [sets, selectedSetId]);

  const bookmarkedWords = currentSet ? getBookmarkedWords(currentSet.id) : [];

  const playerMaxHp: number = GAME_BALANCE.battle.playerMaxHp;
  const monsterMaxHp: number = GAME_BALANCE.battle.monsterMaxHp;
  const correctDamage: number = GAME_BALANCE.battle.correctDamage;
  const wrongDamage: number = GAME_BALANCE.battle.wrongDamage;
  const rewardCoins: number = GAME_BALANCE.notebookBattle.rewardCoins;

  const [playerHp, setPlayerHp] = useState<number>(playerMaxHp);
  const [monsterHp, setMonsterHp] = useState<number>(monsterMaxHp);
  const [message, setMessage] = useState("請選擇收藏本單詞的正確意思");
  const [gameOver, setGameOver] = useState(false);

  const [question, setQuestion] = useState(() =>
    bookmarkedWords.length >= 4 ? generateQuestion(bookmarkedWords) : null
  );

  function checkAnswer(option: string) {
    if (gameOver || !question || !currentSet || bookmarkedWords.length < 4) {
      return;
    }

    if (option === question.correctAnswer) {
      const newMonsterHp = Math.max(monsterHp - correctDamage, 0);
      setMonsterHp(newMonsterHp);

      if (newMonsterHp === 0) {
        addCoins(rewardCoins);
        setMessage(`你完成了收藏本特訓！獲得 ${rewardCoins} 代幣！`);
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
        setMessage("你被怪物打敗了！錯題已保留在當前收藏本中。");
        setGameOver(true);
        return;
      }

      setMessage("回答錯誤！怪物攻擊了你！錯題已保留在當前收藏本中。");
    }

    setQuestion(generateQuestion(bookmarkedWords));
  }

  function restartGame() {
    if (bookmarkedWords.length < 4) return;

    setPlayerHp(playerMaxHp);
    setMonsterHp(monsterMaxHp);
    setMessage("請選擇收藏本單詞的正確意思");
    setQuestion(generateQuestion(bookmarkedWords));
    setGameOver(false);
  }

  if (!currentSet || bookmarkedWords.length < 4 || !question) {
    return (
      <main className="px-3 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-3xl">
          <section className="game-panel p-8 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-4xl">
              📒
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/80">
              Notebook Training
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              收藏本特訓
            </h1>

            <p className="mt-4 text-slate-200">
              當前詞庫：<span className="font-bold text-white">{currentSet?.name ?? "未選擇"}</span>
            </p>

            <p className="mt-3 text-slate-300">
              收藏本至少需要 4 個單詞才能開始特訓。
            </p>

            <p className="mt-3 text-slate-300">
              目前收藏數量：{bookmarkedWords.length}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/notebook"
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                前往收藏本
              </Link>

              <Link
                href="/battle"
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                去冒險累積錯題
              </Link>

              <Link href="/" className="secondary-button">
                回首頁
              </Link>
            </div>
          </section>
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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
                Notebook Training
              </div>

              <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                收藏本特訓
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                專門複習收藏本中的單詞。答對即可攻擊怪物，完成特訓可獲得代幣獎勵。
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
                  Current Notebook
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
              Notebook Question
            </p>

            <p className="mt-3 text-center text-sm text-slate-300">
              請選擇這個收藏單詞的正確中文意思
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

            <Link
              href="/notebook"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              返回收藏本
            </Link>

            <Link href="/" className="secondary-button">
              回首頁
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}