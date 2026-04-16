"use client";

import type { VocabularySet } from "../../data/vocabularySets";

type MyWordListProps = {
  sets: VocabularySet[];
  selectedSetId: string;
  onSelectSet: (setId: string) => void;
};

export default function MyWordList({
  sets,
  selectedSetId,
  onSelectSet,
}: MyWordListProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <h2 className="text-2xl font-black text-white mb-4">我的詞庫</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sets.map((setItem) => {
          const isSelected = setItem.id === selectedSetId;

          return (
            <button
              key={setItem.id}
              onClick={() => onSelectSet(setItem.id)}
              className={[
                "text-left rounded-[22px] border p-5 transition duration-300",
                "hover:-translate-y-0.5 hover:shadow-xl",
                isSelected
                  ? "border-emerald-300/25 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-slate-950/70 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                  : "border-white/10 bg-slate-950/35 hover:border-white/20 hover:bg-slate-900/50",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">
                    {setItem.name}
                  </h3>

                  <p className="text-slate-300 mb-3 leading-7">
                    {setItem.description || "這個詞庫目前還沒有描述。"}
                  </p>
                </div>

                {isSelected && (
                  <div className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
                    當前
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Words
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {setItem.words.length}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}