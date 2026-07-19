interface DemoButtonsProps {
  onSelect: (demo: "approve" | "transfer" | "malicious") => void;
}

export function DemoButtons({ onSelect }: DemoButtonsProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Demo transactions">
      <button
        onClick={() => onSelect("approve")}
        className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono"
      >
        DEMO APPROVE
      </button>
      <button
        onClick={() => onSelect("transfer")}
        className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono"
      >
        DEMO TRANSFER
      </button>
    </div>
  );
}
