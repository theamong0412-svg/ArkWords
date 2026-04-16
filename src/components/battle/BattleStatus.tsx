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
  const playerPercent = (playerHp / playerMaxHp) * 100;
  const monsterPercent = (monsterHp / monsterMaxHp) * 100;

  return (
    <div className="bg-white rounded-2xl shadow p-3 md:p-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center">
          <div
            id="player-sprite"
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-100 border-4 border-blue-300 flex items-center justify-center text-4xl md:text-5xl mb-2 transition-all duration-300"
          >
            🧙
          </div>

          <h2 className="text-lg md:text-xl font-bold text-blue-800 mb-1">
            玩家
          </h2>

          <div className="w-full max-w-[220px]">
            <p className="font-semibold text-slate-700 mb-1 text-center text-sm">
              HP：{playerHp} / {playerMaxHp}
            </p>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-4 rounded-full text-white text-[10px] flex items-center justify-center transition-all duration-500"
                style={{ width: `${playerPercent}%` }}
              >
                {playerHp}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            id="monster-sprite"
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-red-100 border-4 border-red-300 flex items-center justify-center text-4xl md:text-5xl mb-2 transition-all duration-300"
          >
            👾
          </div>

          <h2 className="text-lg md:text-xl font-bold text-red-800 mb-1">
            怪物
          </h2>

          <div className="w-full max-w-[220px]">
            <p className="font-semibold text-slate-700 mb-1 text-center text-sm">
              HP：{monsterHp} / {monsterMaxHp}
            </p>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-500 h-4 rounded-full text-white text-[10px] flex items-center justify-center transition-all duration-500"
                style={{ width: `${monsterPercent}%` }}
              >
                {monsterHp}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <div className="text-lg md:text-xl font-bold text-slate-400 tracking-[0.35em]">
          VS
        </div>
      </div>
    </div>
  );
}