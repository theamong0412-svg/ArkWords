"use client";

import { useState } from "react";
import type { WordItem } from "../../data/vocabularySets";

type BulkImportFormProps = {
  selectedSetName: string;
  onBulkImport: (items: WordItem[]) => void;
};

function normalizeWord(word: string) {
  return word.trim().toLowerCase();
}

function parseLine(line: string): WordItem | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replaceAll("，", ",");

  let parts: string[] = [];

  if (normalized.includes("=")) {
    parts = normalized.split("=");
  } else if (normalized.includes(",")) {
    parts = normalized.split(",");
  } else {
    return null;
  }

  if (parts.length < 2) return null;

  const word = parts[0]?.trim();
  const meaning = parts.slice(1).join(" ").trim();

  if (!word || !meaning) return null;

  return { word, meaning };
}

export default function BulkImportForm({
  selectedSetName,
  onBulkImport,
}: BulkImportFormProps) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(
    "支援格式：apple=蘋果 或 apple,蘋果"
  );

  function handleImport() {
    const lines = text.split("\n");
    const parsedItems: WordItem[] = [];
    const seenWords = new Set<string>();

    let invalidCount = 0;
    let duplicateCount = 0;

    for (const line of lines) {
      const parsed = parseLine(line);

      if (!parsed) {
        if (line.trim()) invalidCount += 1;
        continue;
      }

      const normalizedWord = normalizeWord(parsed.word);

      if (seenWords.has(normalizedWord)) {
        duplicateCount += 1;
        continue;
      }

      seenWords.add(normalizedWord);
      parsedItems.push(parsed);
    }

    if (parsedItems.length === 0) {
      setMessage("沒有成功解析到任何單詞，請使用 = 或 , 作為分隔。");
      return;
    }

    onBulkImport(parsedItems);
    setText("");

    let resultMessage = `成功解析 ${parsedItems.length} 個單詞`;

    if (duplicateCount > 0) {
      resultMessage += `，忽略 ${duplicateCount} 個重複項`;
    }

    if (invalidCount > 0) {
      resultMessage += `，另有 ${invalidCount} 行格式無法識別`;
    }

    setMessage(resultMessage + "。");
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <h2 className="text-2xl font-black text-white mb-2">批量導入單詞</h2>

      <p className="text-slate-300 mb-5 leading-7">
        目前導入到詞庫：
        <span className="ml-1 font-bold text-cyan-200">{selectedSetName}</span>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`take off=起飛；脫下\nlook forward to,期待`}
        className="mb-4 h-48 w-full resize-none rounded-[24px] border border-white/10 bg-slate-950/50 px-4 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-400/20"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleImport}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
        >
          批量導入
        </button>

        <p className="text-sm leading-7 text-slate-300">{message}</p>
      </div>
    </div>
  );
}