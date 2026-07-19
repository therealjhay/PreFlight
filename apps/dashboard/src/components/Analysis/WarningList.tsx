interface WarningListProps {
  reasons: string[];
}

const severityIcon = (reason: string) => {
  const lower = reason.toLowerCase();
  if (
    lower.includes("unlimited") ||
    lower.includes("malicious") ||
    lower.includes("flagged")
  )
    return "danger";
  if (lower.includes("approval")) return "warning";
  return "info";
};

export function WarningList({ reasons }: WarningListProps) {
  if (reasons.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
        DETECTED RISKS
      </div>
      <div className="space-y-2">
        {reasons.map((reason, i) => {
          const severity = severityIcon(reason);
          return (
            <div key={i} className="flex items-start gap-3 text-sm">
              {severity === "danger" ? (
                <span className="mt-0.5 text-red-400">⚠</span>
              ) : severity === "warning" ? (
                <span className="mt-0.5 text-amber-400">!</span>
              ) : (
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
              )}
              <span className="text-white/60">{reason}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
