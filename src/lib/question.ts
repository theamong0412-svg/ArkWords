import type { WordItem } from "../data/vocabularySets";

type Question = {
  word: string;
  correctAnswer: string;
  options: string[];
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export function generateQuestion(words: WordItem[]): Question {
  if (words.length < 4) {
    throw new Error("至少需要 4 個單詞才能生成題目");
  }

  const correctWord = words[Math.floor(Math.random() * words.length)];

  const wrongAnswers = shuffleArray(
    words
      .filter((item) => item.word !== correctWord.word)
      .map((item) => item.meaning)
  ).slice(0, 3);

  const options = shuffleArray([correctWord.meaning, ...wrongAnswers]);

  return {
    word: correctWord.word,
    correctAnswer: correctWord.meaning,
    options,
  };
}