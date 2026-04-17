export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#120d09_0%,_#1a1410_38%,_#221914_72%,_#0e0b09_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,122,32,0.12),_transparent_24%),radial-gradient(circle_at_82%_18%,_rgba(121,53,21,0.14),_transparent_22%),radial-gradient(circle_at_18%_82%,_rgba(84,92,52,0.09),_transparent_24%)]" />

      <div className="absolute left-[-140px] top-[-100px] h-80 w-80 rounded-full bg-orange-700/10 blur-3xl" />
      <div className="absolute right-[-120px] top-[8%] h-96 w-96 rounded-full bg-red-900/10 blur-3xl" />
      <div className="absolute bottom-[-140px] left-[8%] h-[28rem] w-[28rem] rounded-full bg-amber-700/10 blur-3xl" />
      <div className="absolute bottom-[12%] right-[10%] h-80 w-80 rounded-full bg-lime-900/10 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,239,219,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,239,219,0.12)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(rgba(255,223,183,0.34)_0.7px,transparent_0.7px)] bg-[size:24px_24px]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.3)_100%)]" />

      <div className="absolute inset-0 opacity-[0.08] mix-blend-soft-light bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.9%22/></svg>')]" />
    </div>
  );
}