interface DemoButtonsProps {
  onSelect: (demo: "approve" | "transfer" | "malicious") => void;
}

export function DemoButtons({ onSelect }: DemoButtonsProps) {
  return (
    <div className="flex gap-1.5" role="group" aria-label="Demo transactions">
      <button
        onClick={() => onSelect("transfer")}
        className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors font-mono"
        aria-label="Load safe transfer demo"
      >
        DEMO SAFE
      </button>
      <button
        onClick={() => onSelect("approve")}
        className="text-[11px] px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/20 transition-colors font-mono"
        aria-label="Load approval demo"
      >
        DEMO APPROVAL
      </button>
      <button
        onClick={() => onSelect("malicious")}
        className="text-[11px] px-2.5 py-1 rounded-md bg-red-500/10 text-red-400/70 hover:text-red-300 hover:bg-red-500/20 transition-colors font-mono"
        aria-label="Load malicious demo"
      >
        DEMO MALICIOUS
      </button>
    </div>
  );
}
