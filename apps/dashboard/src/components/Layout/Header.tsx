import { StatusDot } from "../common/StatusDot";

export function Header() {
  return (
    <header className="border-b border-white/5 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              PREFLIGHT
            </h1>
            <p className="text-[11px] text-emerald-400/80 tracking-widest uppercase font-medium">
              Transaction Intelligence
            </p>
          </div>
        </div>
        <StatusDot color="green" label="API READY" animate />
      </div>
    </header>
  );
}
