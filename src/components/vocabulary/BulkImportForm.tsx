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
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">批量導入單詞</h2>

      <p className="text-slate-600 mb-4">
        目前導入到詞庫：<span className="font-semibold">{selectedSetName}</span>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`take off=起飛；脫下\nlook forward to,期待`}
        className="w-full h-48 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 mb-4 resize-none"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleImport}
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          批量導入
        </button>

        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}