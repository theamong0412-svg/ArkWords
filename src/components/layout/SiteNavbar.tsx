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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 self-start lg:self-auto"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-violet-500/80 via-fuchsia-500/80 to-cyan-400/80 shadow-[0_0_30px_rgba(168,85,247,0.35)] transition duration-300 group-hover:scale-105">
            <span className="text-lg font-black text-white">W</span>
          </div>

          <div>
            <p className="text-lg font-black tracking-wide text-white sm:text-xl">
              Word RPG
            </p>
            <p className="text-xs text-slate-300 sm:text-sm">
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
                    ? "bg-white text-slate-900 shadow-lg"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex self-start lg:self-auto">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.12)]">
            <span className="text-lg">🪙</span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
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