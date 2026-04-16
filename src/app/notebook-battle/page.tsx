"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCurrencyStore } from "../../store/currencyStore";
import { useNotebookStore } from "../../store/notebookStore";
import { useVocabularyStore } from "../../store/vocabularyStore";
import { useVocabularySetStore } from "../../store/vocabularySetStore";
import { useCharacterStore } from "../../store/characterStore";
import { useActiveCharacterStore } from "../../store/activeCharacterStore";
import { generateQuestion } from "../../lib/question";
import { GAME_BALANCE } from "../../config/gameBalance";
import { gachaPool } from "../../data/gachaPool";
import AnswerOptions from "../../components/battle/AnswerOptions";
import CharacterVideo from "../../components/ui/CharacterVideo";

export default function NotebookBattlePage() {
  const { coins, addCoins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { getBookmarkedWords, addBookmarkedWord } = useNotebookStore();
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

  const playerPercent = Math.max(0, (playerHp / playerMaxHp) * 100);
  const monsterPercent = Math.max(0, (monsterHp / monsterMaxHp) * 100);

  if (!currentSet || bookmarkedWords.length < 4 || !question) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <section className="game-panel p-8 text-center sm:p-10">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
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
    <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-7xl">
        <section className="game-panel overflow-hidden p-3 sm:p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_270px]">
            <div className="min-w-0">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <div className="rounded-[24px] border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 to-slate-950/35 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-cyan-300/25 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.18)] sm:h-24 sm:w-24">
                      {playerBattleMedia ? (
                        <CharacterVideo
                          src={playerBattleMedia}
                          alt={playerDisplayName}
                          className="h-full w-full object-contain scale-200"
                        />
                      ) : (
                        <span className="text-4xl sm:text-5xl">🧙</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/75">
                            Player
                          </p>
                          <h2 className="truncate text-2xl font-black text-white sm:text-3xl">
                            {playerDisplayName}
                          </h2>
                        </div>

                        <div className="shrink-0 text-sm font-bold text-slate-200">
                          {playerHp}/{playerMaxHp}
                        </div>
                      </div>

                      <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                          style={{ width: `${playerPercent}%` }}
                        />
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

                <div className="hidden lg:flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base font-black tracking-[0.2em] text-white">
                  VS
                </div>

                <div className="rounded-[24px] border border-rose-300/15 bg-gradient-to-l from-rose-400/10 to-slate-950/35 p-3">
                  <div className="flex items-center gap-3 lg:flex-row-reverse">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] border border-rose-300/25 bg-rose-400/10 text-4xl shadow-[0_0_20px_rgba(244,63,94,0.18)] sm:h-24 sm:w-24 sm:text-5xl">
                      👾
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3 lg:flex-row-reverse">
                        <div className="min-w-0 lg:text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200/75">
                            Monster
                          </p>
                          <h2 className="truncate text-2xl font-black text-white sm:text-3xl">
                            怪物
                          </h2>
                        </div>

                        <div className="shrink-0 text-sm font-bold text-slate-200">
                          {monsterHp}/{monsterMaxHp}
                        </div>
                      </div>

                      <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${monsterPercent}%` }}
                        />
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

              <div className="mt-3 rounded-[26px] border border-white/10 bg-gradient-to-b from-white/5 to-slate-950/35 p-4 sm:p-5">
                <div className="text-center">
                  <div className="mb-2 inline-flex items-center rounded-full border border-amber-300/15 bg-amber-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/75">
                    Notebook Question
                  </div>

                  <p className="text-sm text-slate-300">
                    請選擇這個收藏單詞的正確中文意思
                  </p>

                  <h1 className="mt-3 break-words text-4xl font-black text-white sm:text-5xl xl:text-6xl">
                    {question.word}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <div className="rounded-full border border-amber-300/15 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
                      代幣：{hasHydrated ? coins.toLocaleString() : "讀取中..."}
                    </div>
                    <div className="rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                      收藏本：{currentSet.name}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <AnswerOptions
                    options={question.options}
                    onAnswer={checkAnswer}
                    disabled={gameOver}
                  />
                </div>
              </div>
            </div>

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
                    返回收藏本
                  </Link>

                  <Link href="/" className="secondary-button w-full justify-center">
                    回首頁
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