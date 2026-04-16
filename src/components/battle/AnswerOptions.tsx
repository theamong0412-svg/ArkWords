"use client";

type AnswerOptionsProps = {
  options: string[];
  onAnswer: (option: string) => void;
  disabled: boolean;
};

export default function AnswerOptions({
  options,
  onAnswer,
  disabled,
}: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onAnswer(option)}
          disabled={disabled}
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-slate-400 text-sm md:text-base font-medium"
        >
          {option}
        </button>
      ))}
    </div>
  );
}