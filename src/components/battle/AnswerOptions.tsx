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
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
      {options.map((option, index) => (
        <button
          key={`${option}-${index}`}
          onClick={() => onAnswer(option)}
          disabled={disabled}
          className={[
            "group relative overflow-hidden rounded-[18px] border px-3 py-3 text-left transition duration-300 sm:rounded-[20px] sm:px-4 sm:py-3.5",
            "border-[#624c3b] bg-[linear-gradient(180deg,rgba(26,19,15,0.96),rgba(18,13,10,0.98))] text-[#f3e4cb] shadow-[0_12px_24px_rgba(0,0,0,0.22)]",
            "hover:-translate-y-0.5 hover:border-[#b67f4b] hover:bg-[linear-gradient(180deg,rgba(34,24,18,0.98),rgba(22,15,12,0.98))] hover:shadow-[0_16px_28px_rgba(0,0,0,0.3)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
          ].join(" ")}
        >
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(135deg,rgba(255,236,214,0.24),transparent_40%)]" />
          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-[#d89149] to-[#7b431c]/40 opacity-80" />

          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-[#a87849]/35 bg-[#2a1c14] text-xs font-black text-[#e6bb85] sm:h-8 sm:w-8 sm:text-sm">
              {String.fromCharCode(65 + index)}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a68866] sm:text-[11px]">
                選項
              </p>
              <p className="mt-1 break-words text-sm font-medium leading-5 text-[#fff1d8] sm:text-[15px] sm:leading-6">
                {option}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}