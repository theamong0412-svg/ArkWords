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
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">新增單詞</h2>

      <p className="text-slate-600 mb-4">
        目前新增到詞庫：<span className="font-semibold">{selectedSetName}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="輸入英文單詞"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          placeholder="輸入中文意思"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition"
      >
        新增到目前詞庫
      </button>
    </div>
  );
}