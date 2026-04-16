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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          onClick={() => onAnswer(option)}
          disabled={disabled}
          className={[
            "group rounded-[20px] border px-4 py-4 text-left transition duration-300 sm:px-5",
            "border-white/10 bg-white/5 text-slate-100 shadow-lg",
            "hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-2xl",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-sm font-bold text-cyan-200">
              {String.fromCharCode(65 + index)}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
                選項
              </p>
              <p className="mt-1 break-words text-sm font-medium leading-6 text-white sm:text-base">
                {option}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}