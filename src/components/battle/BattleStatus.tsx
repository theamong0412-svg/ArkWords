"use client";

type BattleStatusProps = {
  playerHp: number;
  playerMaxHp: number;
  monsterHp: number;
  monsterMaxHp: number;
};

export default function BattleStatus({
  playerHp,
  playerMaxHp,
  monsterHp,
  monsterMaxHp,
}: BattleStatusProps) {
  const playerPercent = Math.max(0, (playerHp / playerMaxHp) * 100);
  const monsterPercent = Math.max(0, (monsterHp / monsterMaxHp) * 100);

  const playerHpColor =
    playerPercent > 60
      ? "from-emerald-400 to-green-500"
      : playerPercent > 30
      ? "from-amber-400 to-orange-500"
      : "from-rose-500 to-red-600";

  const monsterHpColor =
    monsterPercent > 60
      ? "from-fuchsia-500 to-pink-500"
      : monsterPercent > 30
      ? "from-orange-400 to-red-500"
      : "from-red-600 to-rose-700";

  return (
    <section className="game-panel overflow-hidden p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <div className="rounded-[24px] border border-cyan-300/15 bg-gradient-to-b from-cyan-400/10 to-transparent p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-[24px] border border-cyan-300/30 bg-gradient-to-br from-sky-400/20 via-cyan-400/20 to-violet-400/20 text-5xl shadow-[0_0_35px_rgba(34,211,238,0.18)] transition-all duration-300 sm:h-28 sm:w-28 sm:text-6xl">
              🧙
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
              Player
            </p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
              玩家
            </h2>

            <div className="mt-4 w-full max-w-[260px]">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                <span>HP</span>
                <span>
                  {playerHp} / {playerMaxHp}
                </span>
              </div>

              <div className="h-5 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                <div
                  className={`flex h-full items-center justify-center rounded-full bg-gradient-to-r ${playerHpColor} text-[11px] font-bold text-white transition-all duration-500`}
                  style={{ width: `${playerPercent}%` }}
                >
                  {playerHp > 0 ? playerHp : 0}
                </div>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: playerMaxHp }).map((_, index) => (
                  <span
                    key={index}
                    className={`text-lg transition ${
                      index < playerHp ? "opacity-100" : "opacity-25"
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-black tracking-[0.3em] text-slate-200 shadow-xl sm:h-20 sm:w-20 sm:text-xl">
            VS
          </div>
        </div>

        <div className="rounded-[24px] border border-rose-300/15 bg-gradient-to-b from-rose-400/10 to-transparent p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-[24px] border border-rose-300/30 bg-gradient-to-br from-rose-400/20 via-red-400/20 to-orange-400/20 text-5xl shadow-[0_0_35px_rgba(244,63,94,0.18)] transition-all duration-300 sm:h-28 sm:w-28 sm:text-6xl">
              👾
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200/70">
              Monster
            </p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
              怪物
            </h2>

            <div className="mt-4 w-full max-w-[260px]">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                <span>HP</span>
                <span>
                  {monsterHp} / {monsterMaxHp}
                </span>
              </div>

              <div className="h-5 overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                <div
                  className={`flex h-full items-center justify-center rounded-full bg-gradient-to-r ${monsterHpColor} text-[11px] font-bold text-white transition-all duration-500`}
                  style={{ width: `${monsterPercent}%` }}
                >
                  {monsterHp > 0 ? monsterHp : 0}
                </div>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: monsterMaxHp }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition ${
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
    </section>
  );
}