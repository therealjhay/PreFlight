import { StatusDot } from "../common/StatusDot";

export function Header() {
  return (
    <header className="border-b border-white/5 px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              PREFLIGHT
            </h1>
            <p className="hidden sm:block text-[11px] text-emerald-400/80 tracking-widest uppercase font-medium">
              Transaction Intelligence
            </p>
          </div>
        </div>
        <StatusDot color="green" label="API READY" animate />
      </div>
    </header>
  );
}
