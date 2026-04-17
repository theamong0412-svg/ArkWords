"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrencyStore } from "@/store/currencyStore";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/battle-select", label: "冒險" },
  { href: "/vocabulary", label: "詞庫" },
  { href: "/gacha", label: "抽卡" },
  { href: "/collection", label: "收藏" },
  { href: "/notebook", label: "收藏本" },
  { href: "/notebook-battle", label: "特訓" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { coins, hasHydrated } = useCurrencyStore();

  return (
    <header className="sticky top-0 z-50 border-b border-[#5f4937]/80 bg-[#120d0a]/82 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 self-start lg:self-auto"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c48239]/60 bg-gradient-to-br from-[#c97827] to-[#6e3914] shadow-[0_0_18px_rgba(201,120,39,0.18)] transition duration-300 group-hover:scale-105">
            <span className="text-lg font-black text-[#fff4df]">W</span>
          </div>

          <div>
            <p className="text-lg font-black tracking-wide text-[#fff1d8] sm:text-xl">
              Word RPG
            </p>
            <p className="text-xs text-[#c8b08d] sm:text-sm">
              單詞冒險 × 抽卡養成
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border border-[#d49a58] bg-[#c97827] text-[#1b120d] shadow-[0_0_18px_rgba(201,120,39,0.22)]"
                    : "border border-[#5f4937] bg-[#1a1410]/90 text-[#e5d2b3] hover:border-[#b27a45] hover:bg-[#261c16] hover:text-[#fff1d8]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex self-start lg:self-auto">
          <div className="flex items-center gap-3 rounded-2xl border border-[#8c6239]/70 bg-[#241811]/95 px-4 py-2 text-sm text-[#f0dfc1] shadow-[0_0_20px_rgba(201,120,39,0.08)]">
            <span className="text-lg">🪙</span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#b99466]">
                Coins
              </p>
              <p className="font-bold">
                {hasHydrated ? coins.toLocaleString() : "讀取中..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}