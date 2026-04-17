"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/battle-select", label: "冒險" },
  { href: "/vocabulary", label: "詞庫" },
  { href: "/gacha", label: "尋訪" },
  { href: "/collection", label: "乾員" },
  { href: "/notebook", label: "收藏本" },
  { href: "/notebook-battle", label: "特訓" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { coins, hasHydrated } = useCurrencyStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#4f3928]/70 bg-[#0f0b09]/88 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[16px] border border-[#5e4634]/80 bg-[linear-gradient(180deg,rgba(28,20,16,0.94),rgba(16,11,9,0.96))] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#cf7d29]/8 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,236,214,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,236,214,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative flex h-14 items-center justify-between gap-2 px-3 sm:px-4">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-2.5"
              onClick={() => setMenuOpen(false)}
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#c48239]/60 bg-gradient-to-br from-[#c97827] to-[#6e3914] text-lg font-black text-[#fff4df] shadow-[0_0_14px_rgba(201,120,39,0.16)] transition duration-300 group-hover:scale-105">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,239,218,0.14),transparent_45%)]" />
                <span className="relative">W</span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-xl font-black leading-none text-[#fff1d8] sm:text-2xl">
                  Arkwords
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-[12px] border border-[#7a5a42]/75 bg-[#1b1410]/92 px-2.5 py-2 text-[#f0dfc1]">
                <span className="text-sm">🪙</span>
                <div className="leading-none">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#b99466]">
                    合成玉
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#fff1d8] sm:text-sm">
                    {hasHydrated ? coins.toLocaleString() : "..."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label={menuOpen ? "關閉選單" : "打開選單"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#7a5a42]/80 bg-[#1b1410]/92 text-[#f0dfc1] transition hover:border-[#b27a45] hover:bg-[#241a14]"
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <span
                    className={[
                      "block h-0.5 w-4 rounded-full bg-current transition",
                      menuOpen ? "translate-y-[5px] rotate-45" : "",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "block h-0.5 w-4 rounded-full bg-current transition",
                      menuOpen ? "opacity-0" : "",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "block h-0.5 w-4 rounded-full bg-current transition",
                      menuOpen ? "-translate-y-[5px] -rotate-45" : "",
                    ].join(" ")}
                  />
                </div>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="relative border-t border-[#4f3928]/60 bg-[#120d0a]/96 px-3 py-3 sm:px-4">
              <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,236,214,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,236,214,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />

              <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      "relative overflow-hidden rounded-[12px] border px-3 py-3 text-sm font-semibold transition",
                      isActive(item.href)
                        ? "border-[#d49a58] bg-[linear-gradient(180deg,#cf7d29_0%,#8f4a17_100%)] text-[#1a110c]"
                        : "border-[#5f4937] bg-[#1a1410]/92 text-[#e5d2b3] hover:border-[#b27a45] hover:bg-[#261c16] hover:text-[#fff1d8]",
                    ].join(" ")}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,rgba(255,240,220,0.25),transparent_40%)]" />
                    <span className="relative">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}