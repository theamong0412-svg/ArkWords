"use client";

import { useState } from "react";

type WordFormProps = {
  selectedSetId: string;
  selectedSetName: string;
  onAddWord: (word: string, meaning: string) => void;
};

export default function WordForm({
  selectedSetId,
  selectedSetName,
  onAddWord,
}: WordFormProps) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  function handleSubmit() {
    const trimmedWord = word.trim();
    const trimmedMeaning = meaning.trim();

    if (!selectedSetId) return;
    if (!trimmedWord || !trimmedMeaning) return;

    onAddWord(trimmedWord, trimmedMeaning);
    setWord("");
    setMeaning("");
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <h2 className="text-2xl font-black text-white mb-2">新增單詞</h2>

      <p className="text-slate-300 mb-5 leading-7">
        目前新增到詞庫：
        <span className="ml-1 font-bold text-emerald-200">{selectedSetName}</span>
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-5">
        <input
          type="text"
          placeholder="輸入英文單詞"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-400/20"
        />

        <input
          type="text"
          placeholder="輸入中文意思"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
      >
        新增到目前詞庫
      </button>
    </div>
  );
}