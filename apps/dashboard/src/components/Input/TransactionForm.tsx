import { useState } from "react";
import { DemoButtons } from "./DemoButtons";

interface TransactionFormProps {
  onSubmit: (to: string, data: string) => void;
  loading: boolean;
}

export function TransactionForm({ onSubmit, loading }: TransactionFormProps) {
  const [to, setTo] = useState("");
  const [data, setData] = useState("0x");

  const loadDemo = (demo: "approve" | "transfer" | "malicious") => {
    if (demo === "approve") {
      setTo("0x7a250d5630b4cf539739df2c5dacb4c659f2488d");
      setData(
        "0x095ea7b3000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
    } else if (demo === "transfer") {
      setTo("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      setData(
        "0xa9059cbb000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0000000000000000000000000000000000000000000000000de0b6b3a7640000"
      );
    } else {
      setTo("0x1234567890abcdef1234567890abcdef12345678");
      setData(
        "0x095ea7b3000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (to) onSubmit(to, data);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-white/80 tracking-wide">
          TRANSACTION INPUT
        </h2>
        <DemoButtons onSelect={loadDemo} />
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="contract-input"
            className="block text-[11px] text-white/40 mb-1.5 tracking-wider font-medium"
          >
            CONTRACT
          </label>
          <input
            id="contract-input"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
            aria-label="Contract address"
          />
        </div>

        <div>
          <label
            htmlFor="calldata-input"
            className="block text-[11px] text-white/40 mb-1.5 tracking-wider font-medium"
          >
            CALLDATA
          </label>
          <textarea
            id="calldata-input"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none"
            aria-label="Transaction calldata"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !to}
        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-white/20 text-black font-semibold rounded-xl px-4 py-3 text-sm transition-all disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
        aria-label="Analyze transaction"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            ANALYZING
          </span>
        ) : (
          "ANALYZE TRANSACTION"
        )}
      </button>
    </form>
  );
}
