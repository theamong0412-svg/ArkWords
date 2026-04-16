export type Word = {
  id: number;
  word: string;
  meaning: string;
};

export type Question = {
  word: string;
  correctAnswer: string;
  options: string[];
};