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
    activeCharacterMeta?.name ?? ownedActiveCharacter?.name ?? "博士";
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
        setMessage(`你完成了收藏本特訓！獲得 ${rewardCoins} 合成玉！`);
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
        setMessage("博士，你被打敗了！正在與羅德島失去連接...錯題已保留在當前收藏本中。");
        setGameOver(true);
        return;
      }

      setMessage("回答錯誤！敵人攻擊了你！錯題已保留在當前收藏本中。");
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
      <main className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
        <div className="mx-auto max-w-3xl">
          <section className="terminal-shell cut-panel noise-overlay p-8 text-center sm:p-10">
            <h1 className="text-3xl font-black text-[#fff1d8] sm:text-4xl">
              收藏本特訓
            </h1>

            <p className="mt-4 text-[#e7d4b8]">
              當前詞庫：
              <span className="font-bold text-[#fff1d8]">
                {currentSet?.name ?? "未選擇"}
              </span>
            </p>

            <p className="mt-3 text-[#d7c2a4]">
              收藏本至少需要 4 個單詞才能開始特訓。
            </p>

            <p className="mt-3 text-[#d7c2a4]">
              目前收藏數量：{bookmarkedWords.length}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/notebook" className="primary-button">
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
    <main className="px-2 py-2 sm:px-5 lg:px-8 lg:py-4">
      <div className="mx-auto w-full max-w-7xl">
        <section className="terminal-shell cut-panel noise-overlay p-2.5 sm:p-4 lg:p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0 space-y-3">
             {/* mobile */}
<div className="space-y-2.5 lg:hidden">
  <div className="rounded-[18px] border border-[#6c533f] bg-[linear-gradient(180deg,rgba(31,22,18,0.96),rgba(16,12,10,0.98))] p-3">
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
      <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[16px] border border-[#7a614d] bg-[#201710]">
        {playerBattleMedia ? (
          <CharacterVideo
            src={playerBattleMedia}
            alt={playerDisplayName}
            className="h-full w-full scale-[2.1] object-contain"
          />
        ) : (
          <span className="text-4xl">🧙</span>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d09f6b]/80">
          Player
        </p>
        <p className="mt-1 truncate text-2xl font-black text-[#fff1d8]">
          {playerDisplayName}
        </p>

        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#d7c2a4]">
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
    </div>
  </div>

  <div className="rounded-[18px] border border-[#6c533f] bg-[linear-gradient(180deg,rgba(31,22,18,0.96),rgba(16,12,10,0.98))] p-3">
    <div className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d09f6b]/80">
          Monster
        </p>
        <p className="mt-1 truncate text-2xl font-black text-[#fff1d8]">
          怪物
        </p>

        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#d7c2a4]">
            <span>HP</span>
            <span>
              {monsterHp}/{monsterMaxHp}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ width: `${monsterPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[16px] border border-[#7a614d] bg-[#201710] text-4xl">
        👾
      </div>
    </div>
  </div>

  <div className="rounded-[18px] border border-[#6c533f] bg-[linear-gradient(180deg,rgba(34,24,18,0.96),rgba(17,12,10,0.98))] px-4 py-5 text-center">
    <h1 className="break-words text-5xl font-black leading-none text-[#fff1d8]">
      {question.word}
    </h1>
  </div>
</div>

              {/* desktop */}
              <div className="hidden rounded-[28px] border border-[#6c533f] bg-[linear-gradient(180deg,rgba(32,23,18,0.95),rgba(17,12,10,0.96))] p-4 sm:p-5 lg:block">
                <div className="grid items-center gap-4 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[24px] border border-[#8f744f]/40 bg-[#2a1d14] shadow-[0_0_24px_rgba(201,120,39,0.12)] sm:h-44 sm:w-44">
                      {playerBattleMedia ? (
                        <CharacterVideo
                          src={playerBattleMedia}
                          alt={playerDisplayName}
                          className="h-full w-full scale-[2.2] -translate-y-2 object-contain"
                        />
                      ) : (
                        <span className="text-5xl sm:text-6xl">🧙</span>
                      )}
                    </div>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d09f6b]/80">
                      Player
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#fff1d8]">
                      {playerDisplayName}
                    </h2>

                    <div className="mt-3 w-full max-w-[150px]">
                      <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#d7c2a4]">
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

                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-[#9c7247]/30 bg-[#302117]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0b27c]">
                      Notebook Question
                    </div>

                    <p className="mt-3 text-sm text-[#d7c2a4]">
                      請選擇這個收藏單詞的正確中文意思
                    </p>

                    <h1 className="mt-4 break-words text-5xl font-black text-[#fff1d8] sm:text-6xl xl:text-7xl">
                      {question.word}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <div className="rounded-full border border-[#9c7247]/30 bg-[#302117]/80 px-3 py-1.5 text-xs font-semibold text-[#f0dfc1]">
                        合成玉：{hasHydrated ? coins.toLocaleString() : "讀取中..."}
                      </div>
                      <div className="rounded-full border border-[#755841]/30 bg-[#211712]/80 px-3 py-1.5 text-xs font-semibold text-[#d7c2a4]">
                        收藏本：{currentSet.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-40 w-40 items-center justify-center rounded-[24px] border border-[#8f744f]/40 bg-[#2a1d14] text-5xl shadow-[0_0_24px_rgba(201,120,39,0.1)] sm:h-44 sm:w-44 sm:text-6xl">
                      👾
                    </div>

                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d09f6b]/80">
                      Monster
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#fff1d8]">
                      怪物
                    </h2>

                    <div className="mt-3 w-full max-w-[150px]">
                      <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#d7c2a4]">
                        <span>HP</span>
                        <span>
                          {monsterHp}/{monsterMaxHp}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                          style={{ width: `${monsterPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#6c533f] bg-[linear-gradient(180deg,rgba(27,20,16,0.94),rgba(17,12,10,0.96))] p-3 sm:p-4 lg:rounded-[28px] lg:p-5">
                <div className="mb-3 hidden items-center justify-between gap-2 sm:flex">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d09f6b]/80">
                    Answer Options
                  </p>
                  <div className="rounded-full border border-[#755841]/30 bg-[#211712]/80 px-3 py-1 text-[11px] font-semibold text-[#d7c2a4]">
                    當前收藏本：{currentSet.name}
                  </div>
                </div>

                <AnswerOptions
                  options={question.options}
                  onAnswer={checkAnswer}
                  disabled={gameOver}
                />
              </div>

              <div className="space-y-3 xl:hidden">
                <div className="rounded-[20px] border border-[#624c3b] bg-[#17120e]/90 p-4 text-sm leading-7 text-[#e7d4b8]">
                  {message}
                </div>

                <div className="rounded-[20px] border border-[#624c3b] bg-[#17120e]/90 p-3">
                  <div className="grid gap-2">
                    {gameOver && (
                      <button onClick={restartGame} className="primary-button w-full">
                        重新開始
                      </button>
                    )}

                    <Link
                      href="/notebook"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-[#d28a48]/60 bg-gradient-to-b from-[#c97827] to-[#8f4a17] px-6 py-3 text-center text-sm font-bold text-[#fff4df] shadow-[0_0_20px_rgba(201,120,39,0.16)] transition duration-300 hover:-translate-y-0.5"
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

            <div className="hidden xl:flex xl:flex-col xl:gap-3">
              <div className="rounded-[24px] border border-[#624c3b] bg-[#17120e]/90 p-4 text-sm leading-7 text-[#e7d4b8] xl:min-h-[160px]">
                {message}
              </div>

              <div className="rounded-[24px] border border-[#624c3b] bg-[#17120e]/90 p-4">
                <div className="flex flex-wrap gap-2">
                  {gameOver && (
                    <button onClick={restartGame} className="primary-button w-full">
                      重新開始
                    </button>
                  )}

                  <Link
                    href="/notebook"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-[#d28a48]/60 bg-gradient-to-b from-[#c97827] to-[#8f4a17] px-6 py-3 text-center text-sm font-bold text-[#fff4df] shadow-[0_0_20px_rgba(201,120,39,0.16)] transition duration-300 hover:-translate-y-0.5"
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