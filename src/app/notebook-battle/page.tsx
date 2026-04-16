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
const rewardCoins: number = GAME_BALANCE.battle.rewardCoins;

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
      <main className="min-h-screen bg-amber-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-lg">
          <h1 className="text-3xl font-bold text-amber-800 mb-4">
            收藏本特訓
          </h1>

          <p className="text-slate-700 mb-3">
            當前詞庫：{currentSet?.name ?? "未選擇"}
          </p>

          <p className="text-slate-600 mb-3">
            收藏本至少需要 4 個單詞才能開始特訓。
          </p>

          <p className="text-slate-600 mb-6">
            目前收藏數量：{bookmarkedWords.length}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/notebook"
              className="bg-amber-600 text-white px-5 py-3 rounded-xl hover:bg-amber-700 transition"
            >
              前往收藏本
            </Link>

            <Link
              href="/battle"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              去冒險累積錯題
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 p-2 md:p-3">
      <div className="h-full max-w-5xl mx-auto flex flex-col gap-2">
        <div className="shrink-0 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-amber-900">
            收藏本特訓
          </h1>
          <p className="text-sm md:text-base font-semibold text-yellow-700 mt-1">
            目前代幣：{hasHydrated ? coins : "讀取中..."}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            當前收藏本：{currentSet.name}
          </p>
        </div>

        <div className="shrink-0">
          <BattleStatus
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
            monsterHp={monsterHp}
            monsterMaxHp={monsterMaxHp}
          />
        </div>

        <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex flex-col">
          <p className="text-slate-600 text-sm text-center mb-1">
            請選擇這個收藏單詞的意思
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-3">
            {question.word}
          </h2>

          <div className="shrink-0">
            <AnswerOptions
              options={question.options}
              onAnswer={checkAnswer}
              disabled={gameOver}
            />
          </div>

          <div className="mt-3 bg-slate-100 rounded-xl px-3 py-2 text-sm md:text-base text-slate-700 text-center min-h-[52px] flex items-center justify-center">
            {message}
          </div>

          <div className="mt-3 flex justify-center min-h-[48px] gap-3 flex-wrap">
            {gameOver && (
              <button
                onClick={restartGame}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition"
              >
                重新開始
              </button>
            )}

            <Link
              href="/notebook"
              className="bg-amber-600 text-white px-5 py-2 rounded-xl hover:bg-amber-700 transition"
            >
              返回收藏本
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}