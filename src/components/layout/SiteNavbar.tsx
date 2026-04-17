"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";

const navItems = [
  { href: "/", label: "首頁", code: "H-00" },
  { href: "/battle-select", label: "冒險", code: "A-01" },
  { href: "/vocabulary", label: "詞庫", code: "D-12" },
  { href: "/gacha", label: "抽卡", code: "R-07" },
  { href: "/collection", label: "收藏", code: "C-03" },
  { href: "/notebook", label: "收藏本", code: "N-09" },
  { href: "/notebook-battle", label: "特訓", code: "T-22" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { coins, hasHydrated } = useCurrencyStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentNavLabel = useMemo(() => {
    const matched = navItems.find((item) =>
      item.href === "/"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    return matched?.label ?? "首頁";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#5e4634]/80 bg-[#100c09]/86 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-[#6f533d]/80 bg-[linear-gradient(180deg,rgba(30,22,17,0.96),rgba(17,12,10,0.98))] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#cf7d29]/10 to-transparent" />
          <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-[#d89149] to-[#7b431c]/40 opacity-90" />
          <div className="absolute inset-0 opacity-[0.045] bg-[linear-gradient(rgba(255,236,214,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,236,214,0.12)_1px,transparent_1px)] bg-[size:26px_26px]" />

          {/* Mobile */}
          <div className="relative lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <Link
                href="/"
                className="group flex min-w-0 items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#c48239]/60 bg-gradient-to-br from-[#c97827] to-[#6e3914] shadow-[0_0_18px_rgba(201,120,39,0.18)] transition duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,239,218,0.14),transparent_45%)]" />
                  <span className="relative text-base font-black text-[#fff4df]">W</span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-black tracking-[0.08em] text-[#fff1d8]">
                    Word RPG
                  </p>
                  <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#c8b08d]">
                    {currentNavLabel}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <div className="relative overflow-hidden rounded-[14px] border border-[#8c6239]/75 bg-[linear-gradient(180deg,rgba(39,26,18,0.96),rgba(23,16,12,0.98))] px-3 py-2 text-[#f0dfc1] shadow-[0_0_20px_rgba(201,120,39,0.08)]">
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#cf7d29]/8 to-transparent" />
                  <div className="relative flex items-center gap-2">
                    <span className="text-sm">🪙</span>
                    <div className="leading-none">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-[#b99466]">
                        Supply
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#fff1d8]">
                        {hasHydrated ? coins.toLocaleString() : "..."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={mobileMenuOpen ? "關閉選單" : "打開選單"}
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#7a5a42]/80 bg-[#1d1511]/92 text-[#f0dfc1] transition hover:border-[#b27a45] hover:bg-[#261c16] hover:text-[#fff1d8]"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span
                      className={[
                        "block h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "translate-y-2 rotate-45" : "",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "block h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "opacity-0" : "",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "block h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "-translate-y-2 -rotate-45" : "",
                      ].join(" ")}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="px-4 pb-3">
              <div className="h-px bg-gradient-to-r from-transparent via-[#c07a35]/25 to-transparent" />
            </div>

            {mobileMenuOpen && (
              <div className="px-4 pb-4">
                <div className="grid gap-2">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === item.href
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={[
                          "group relative overflow-hidden rounded-[16px] border px-3 py-3 transition",
                          isActive
                            ? "border-[#d49a58] bg-[linear-gradient(180deg,#cf7d29_0%,#8f4a17_100%)] text-[#1a110c] shadow-[0_0_18px_rgba(201,120,39,0.22)]"
                            : "border-[#5f4937] bg-[#1a1410]/92 text-[#e5d2b3] hover:border-[#b27a45] hover:bg-[#261c16] hover:text-[#fff1d8]",
                        ].join(" ")}
                      >
                        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,rgba(255,240,220,0.25),transparent_40%)]" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "flex h-9 w-9 items-center justify-center rounded-[10px] border text-[10px] font-black uppercase tracking-[0.12em]",
                                isActive
                                  ? "border-[#f1c692]/60 bg-[#f5d4a8]/35 text-[#2b160a]"
                                  : "border-[#7a614d] bg-[#241a14] text-[#b6936c]",
                              ].join(" ")}
                            >
                              {item.code}
                            </div>

                            <div className="leading-tight">
                              <p className="text-sm font-semibold">{item.label}</p>
                            </div>
                          </div>

                          <span
                            className={[
                              "text-xs font-medium transition",
                              isActive ? "text-[#2b160a]/80" : "text-[#d6924f]",
                            ].join(" ")}
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="relative hidden lg:block">
            <div className="flex flex-col gap-4 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
                <Link href="/" className="group flex items-center gap-3 self-start">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[16px] border border-[#c48239]/60 bg-gradient-to-br from-[#c97827] to-[#6e3914] shadow-[0_0_18px_rgba(201,120,39,0.18)] transition duration-300 group-hover:scale-105">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,239,218,0.14),transparent_45%)]" />
                    <span className="relative text-lg font-black text-[#fff4df]">W</span>
                  </div>

                  <div>
                    <p className="text-lg font-black tracking-[0.08em] text-[#fff1d8] sm:text-xl">
                      Word RPG
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#c8b08d] sm:text-sm">
                      Survivor Terminal
                    </p>
                  </div>
                </Link>

                <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-[#8d6848]/60 to-transparent xl:block" />

                <div className="hidden xl:flex items-center gap-2 rounded-full border border-[#7a5a42]/70 bg-[#1d1511]/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d5ab77]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#d88a43] shadow-[0_0_10px_rgba(216,138,67,0.5)]" />
                  Rhodes Island Link Active
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group relative overflow-hidden rounded-[14px] border px-3 py-2 transition sm:px-4",
                        isActive
                          ? "border-[#d49a58] bg-[linear-gradient(180deg,#cf7d29_0%,#8f4a17_100%)] text-[#1a110c] shadow-[0_0_18px_rgba(201,120,39,0.22)]"
                          : "border-[#5f4937] bg-[#1a1410]/92 text-[#e5d2b3] hover:border-[#b27a45] hover:bg-[#261c16] hover:text-[#fff1d8]",
                      ].join(" ")}
                    >
                      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,rgba(255,240,220,0.25),transparent_40%)]" />
                      <div className="relative flex items-center gap-3">
                        <div
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-[10px] border text-[10px] font-black uppercase tracking-[0.12em]",
                            isActive
                              ? "border-[#f1c692]/60 bg-[#f5d4a8]/35 text-[#2b160a]"
                              : "border-[#7a614d] bg-[#241a14] text-[#b6936c]",
                          ].join(" ")}
                        >
                          {item.code}
                        </div>

                        <div className="leading-tight">
                          <p className="text-sm font-semibold">{item.label}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="self-start xl:self-auto">
                <div className="relative overflow-hidden rounded-[18px] border border-[#8c6239]/75 bg-[linear-gradient(180deg,rgba(39,26,18,0.96),rgba(23,16,12,0.98))] px-4 py-3 text-sm text-[#f0dfc1] shadow-[0_0_20px_rgba(201,120,39,0.08)]">
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#cf7d29]/8 to-transparent" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#b17d49]/45 bg-[#2b1c14] text-lg shadow-[inset_0_1px_0_rgba(255,232,205,0.05)]">
                      🪙
                    </div>

                    <div className="leading-tight">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#b99466]">
                        Supply
                      </p>
                      <p className="mt-1 font-bold text-[#fff1d8]">
                        {hasHydrated ? coins.toLocaleString() : "讀取中..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#c07a35]/25 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}