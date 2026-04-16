"use client";

import Link from "next/link";
import { useCurrencyStore } from "../store/currencyStore";
import { useNotebookStore } from "../store/notebookStore";
import { useVocabularyStore } from "../store/vocabularyStore";
import { useVocabularySetStore } from "../store/vocabularySetStore";

const quickActions = [
  {
    href: "/battle-select",
    label: "開始冒險",
    sublabel: "進入普通戰鬥與挑戰",
    style:
      "from-violet-500 via-fuchsia-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.35)]",
  },
  {
    href: "/vocabulary",
    label: "詞庫管理",
    sublabel: "新增、批量導入與整理詞表",
    style:
      "from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(20,184,166,0.28)]",
  },
  {
    href: "/gacha",
    label: "抽卡系統",
    sublabel: "600 代幣抽一次，收集角色",
    style:
      "from-purple-500 via-violet-500 to-indigo-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.28)]",
  },
  {
    href: "/collection",
    label: "角色收藏",
    sublabel: "查看已獲得角色與星級",
    style:
      "from-pink-500 via-rose-500 to-orange-400 text-white shadow-[0_0_30px_rgba(244,114,182,0.28)]",
  },
  {
    href: "/notebook",
    label: "我的收藏本",
    sublabel: "集中查看已收藏單詞",
    style:
      "from-amber-500 via-orange-500 to-yellow-400 text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.28)]",
  },
  {
    href: "/notebook-battle",
    label: "收藏本特訓",
    sublabel: "高效複習收藏單詞",
    style:
      "from-sky-500 via-cyan-500 to-blue-500 text-white shadow-[0_0_30px_rgba(56,189,248,0.28)]",
  },
];

export default function Home() {
  const { coins, hasHydrated } = useCurrencyStore();
  const { selectedSetId } = useVocabularyStore();
  const { sets } = useVocabularySetStore();
  const { hasHydrated: notebookHydrated, getBookmarkedWords } =
    useNotebookStore();

  const currentSet =
    sets.find((setItem) => setItem.id === selectedSetId) ?? sets[0];

  const notebookCount =
    notebookHydrated && currentSet ? getBookmarkedWords(currentSet.id).length : 0;

  return (
    <div className="relative">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid items-stretch gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="game-panel p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fuchsia-200 uppercase">
              Word RPG Adventure
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              把背單詞，
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                變成一場冒險
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              用答題戰鬥累積代幣，用抽卡收集角色，用收藏本反覆特訓。
              這不是單純的詞表網站，而是你的專屬單詞養成 RPG。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/battle-select" className="primary-button">
                立即開始冒險
              </Link>

              <Link href="/vocabulary" className="secondary-button">
                前往詞庫管理
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <p className="stat-label">目前代幣</p>
                <p className="stat-value">
                  {hasHydrated ? coins.toLocaleString() : "讀取中..."}
                </p>
              </div>

              <div className="stat-card">
                <p className="stat-label">當前詞庫</p>
                <p className="stat-value text-xl">
                  {currentSet?.name ?? "未選擇"}
                </p>
              </div>

              <div className="stat-card">
                <p className="stat-label">收藏本數量</p>
                <p className="stat-value">
                  {notebookHydrated ? notebookCount : "讀取中..."}
                </p>
              </div>
            </div>
          </div>

          <div className="game-panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-fuchsia-400/10 to-transparent" />

            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                  Hero Preview
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  你的單詞勇者正在待命
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  這是一個立繪
                </p>
              </div>

              <div className="relative flex min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
                <div className="absolute h-56 w-56 rounded-full bg-violet-500/25 blur-3xl" />
                <div className="absolute h-40 w-40 rounded-full bg-cyan-400/15 blur-2xl" />

                <div className="relative z-10 flex w-full max-w-[280px] flex-col items-center rounded-[30px] border border-white/15 bg-slate-950/50 px-6 py-8 shadow-2xl">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-fuchsia-300/30 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/40 to-cyan-400/40 text-4xl shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                    ✦
                  </div>

                  <p className="mt-5 text-xl font-bold text-white">主角色立繪區</p>
                  <p className="mt-2 text-center text-sm leading-6 text-slate-300">
                    可替換成：
                    <br />
                    `/public/characters/home-hero.png`
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                    <span>★★★★★</span>
                    <span>預設看板角色</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="game-panel p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200/80">
                Quick Access
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                選擇你的下一步
              </h2>
              <p className="mt-2 text-slate-300">
                遊戲選單
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[24px] border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl"
              >
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-r px-4 py-2 text-sm font-bold ${item.style}`}
                >
                  {item.label}
                </div>

                <p className="mt-4 text-lg font-semibold text-white">
                  {item.label}
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.sublabel}
                </p>

                <div className="mt-5 text-sm font-medium text-cyan-200 transition group-hover:translate-x-1">
                  前往頁面 →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="game-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
              冒險獎勵
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">普通冒險</h3>
            <p className="mt-3 text-slate-300">答題戰鬥成功可獲得 180 代幣。</p>
          </div>

          <div className="game-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/80">
              特訓獎勵
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">收藏本特訓</h3>
            <p className="mt-3 text-slate-300">完成收藏本特訓可獲得 200 代幣。</p>
          </div>

          <div className="game-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-200/80">
              抽卡消耗
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">角色召喚</h3>
            <p className="mt-3 text-slate-300">
              每次抽卡消耗 600 代幣，稀有角色等你帶回家。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}