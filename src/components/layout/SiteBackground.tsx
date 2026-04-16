export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(217,70,239,0.16),_transparent_24%),radial-gradient(circle_at_20%_80%,_rgba(34,211,238,0.12),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />

      <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-[-100px] top-[10%] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[10%] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[10%] right-[12%] h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.18]" />

      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" />
    </div>
  );
}