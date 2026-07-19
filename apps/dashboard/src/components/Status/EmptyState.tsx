export function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-sm">
        <svg
          className="w-16 h-16 text-white/[0.07] mx-auto mb-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12l2 2 4-4" />
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
        <h2 className="text-lg font-semibold text-white/40 mb-2">
          Ready for Analysis
        </h2>
        <p className="text-sm text-white/20">
          Enter a transaction address and calldata, or select a demo scenario to
          see Preflight in action.
        </p>
      </div>
    </div>
  );
}
