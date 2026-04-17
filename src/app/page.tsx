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
      "from-[#cf7d29] via-[#a65a22] to-[#713917] text-[#fff4e2] shadow-[0_0_22px_rgba(207,125,41,0.22)]",
    code: "A-01",
  },
  {
    href: "/vocabulary",
    label: "詞庫管理",
    sublabel: "新增、批量導入與整理詞表",
    style:
      "from-[#6d7b42] via-[#556234] to-[#394221] text-[#f3ecd9] shadow-[0_0_22px_rgba(109,123,66,0.2)]",
    code: "D-12",
  },
  {
    href: "/gacha",
    label: "尋訪系統",
    sublabel: "600 合成玉抽一次，拯救乾員",
    style:
      "from-[#9b5427] via-[#72391a] to-[#4a2412] text-[#fff0dd] shadow-[0_0_22px_rgba(155,84,39,0.2)]",
    code: "R-07",
  },
  {
    href: "/collection",
    label: "乾員收藏",
    sublabel: "查看已獲得乾員與星級",
    style:
      "from-[#b7783d] via-[#8c5227] to-[#693919] text-[#fff1de] shadow-[0_0_22px_rgba(183,120,61,0.2)]",
    code: "C-03",
  },
  {
    href: "/notebook",
    label: "我的收藏本",
    sublabel: "集中查看已收藏單詞",
    style:
      "from-[#d0a15a] via-[#b97c36] to-[#8f581f] text-[#1a120d] shadow-[0_0_22px_rgba(208,161,90,0.22)]",
    code: "N-09",
  },
  {
    href: "/notebook-battle",
    label: "收藏本特訓",
    sublabel: "高效複習收藏單詞",
    style:
      "from-[#8b7045] via-[#6f5736] to-[#4f3b25] text-[#f5ebd7] shadow-[0_0_22px_rgba(139,112,69,0.2)]",
    code: "T-22",
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
          <div className="terminal-shell cut-panel noise-overlay p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-[#a65a22]/8 to-transparent" />
            <div className="absolute left-6 right-6 top-[78px] h-px bg-gradient-to-r from-transparent via-[#cf7d29]/30 to-transparent" />

            <div className="relative flex flex-wrap items-center gap-3">
              <div className="metal-label">ArkWords:Endfield 方舟.終末詞界</div>
              <div className="hazard-chip">Survivor Terminal</div>
            </div>

            <h1 className="relative mt-5 max-w-3xl text-4xl font-black leading-tight text-[#fff1d9] sm:text-5xl lg:text-6xl">
              【已連接至羅德島】博士，您好。
              <span className="block bg-gradient-to-r from-[#f0cf9d] via-[#d98a45] to-[#b56a31] bg-clip-text text-transparent">
                你願意用單詞，拯救失落的泰拉大陸嗎？
              </span>
            </h1>

            <p className="relative mt-5 max-w-2xl text-base leading-8 text-[#d7c2a4] sm:text-lg">
              答題戰鬥累積合成玉，廢墟中尋找乾員。
              注意，此詞表網站是你在終末之時與方舟的最後連結。
            </p>

            <div className="relative mt-8 flex flex-wrap gap-4">
              <Link href="/battle-select" className="primary-button">
                終端：立即開始冒險
              </Link>

              <Link href="/vocabulary" className="secondary-button">
                資源：前往詞庫管理
              </Link>
            </div>

            <div className="panel-divider relative mt-8" />

            <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
              <div className="stat-card">
                <p className="stat-label">目前合成玉</p>
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

          <div className="vault-panel noise-overlay p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
            <div className="absolute right-5 top-5 rounded-md border border-[#b47c49]/40 bg-[#2a1b14]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e3b27a]">
              Vault Dock
            </div>

            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#cf9b66]/80">
                  Hero Preview
                </p>
                <h2 className="mt-3 text-2xl font-bold text-[#fff1d9] sm:text-3xl">
                  你的看板娘/郎正在待命
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#d7c2a4] sm:text-base">
                  這是你推的立繪
                </p>
              </div>

              <div className="scan-room p-6">
                <div className="absolute h-56 w-56 rounded-full bg-[#cf7d29]/18 blur-3xl" />
                <div className="absolute h-40 w-40 rounded-full bg-[#78694c]/14 blur-2xl" />
                <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/40 to-transparent" />
                <div className="absolute inset-x-10 bottom-8 h-px bg-gradient-to-r from-transparent via-[#ddb07d]/20 to-transparent" />

                <div className="avatar-core">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[22px] border border-[#d19857]/30 bg-gradient-to-br from-[#c97827]/35 via-[#9a5722]/35 to-[#5d3417]/35 text-4xl text-[#fff0da] shadow-[0_0_30px_rgba(201,120,39,0.2)]">
                    ✦
                  </div>

                  <p className="mt-5 text-xl font-bold text-[#fff1d8]">主角色立繪區</p>
                  <p className="mt-2 text-center text-sm leading-6 text-[#d7c2a4]">
                    可替換成：
                    <br />
                    `/public/characters/home-hero.png`
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-full border border-[#c49862]/25 bg-[#8d6436]/12 px-4 py-2 text-sm text-[#f1ddb9]">
                    <span>★★★★★</span>
                    <span>預設看板角色</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="terminal-shell noise-overlay p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d09f6b]/80">
                Quick Access
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#fff1d8] sm:text-3xl">
                選擇你的下一步
              </h2>
              <p className="mt-2 text-[#d7c2a4]">遊戲選單</p>
            </div>
          </div>

          <div className="panel-divider mt-5" />

          <div className="console-grid mt-6">
            {quickActions.map((item) => (
              <Link key={item.href} href={item.href} className="console-tile group">
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-r px-4 py-2 text-sm font-bold ${item.style}`}
                  >
                    {item.label}
                  </div>
                  <span className="console-code">{item.code}</span>
                </div>

                <p className="relative z-10 mt-4 text-lg font-semibold text-[#fff1d8]">
                  {item.label}
                </p>

                <p className="relative z-10 mt-2 text-sm leading-7 text-[#d7c2a4]">
                  {item.sublabel}
                </p>

                <div className="relative z-10 mt-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#d6924f] transition group-hover:translate-x-1">
                    前往頁面 →
                  </span>
                  <span className="rounded-md border border-[#6f543f] bg-[#201710]/80 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#a68866]">
                    Module
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="info-card info-card-a noise-overlay">
            <div className="absolute right-5 top-5 rounded-md border border-[#8ea15e]/30 bg-[#324028]/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#b8ca90]">
              Reward
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9eb076]/80">
              冒險獎勵
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#fff1d8]">普通冒險</h3>
            <p className="mt-3 text-[#d7c2a4]">擊敗整合運動成功可獲得 180 合成玉。</p>
          </div>

          <div className="info-card info-card-b noise-overlay">
            <div className="absolute right-5 top-5 rounded-md border border-[#c88f56]/30 bg-[#49311d]/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#e0b27c]">
              Training
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9b377]/80">
              特訓獎勵
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#fff1d8]">收藏本特訓</h3>
            <p className="mt-3 text-[#d7c2a4]">完成收藏本特訓可獲得 200 合成玉。</p>
          </div>

          <div className="info-card info-card-c noise-overlay">
            <div className="absolute right-5 top-5 rounded-md border border-[#a06d52]/30 bg-[#3b241d]/30 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#cf9b78]">
              Rescue
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c98a5e]/80">
              尋訪消耗
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#fff1d8]">乾員尋訪</h3>
            <p className="mt-3 text-[#d7c2a4]">
              每次尋訪消耗 600 合成玉。博士，乾員們等你回家。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}