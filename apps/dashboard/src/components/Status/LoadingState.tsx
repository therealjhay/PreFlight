import { useEffect, useState } from "react";

const STEPS = [
  { id: "decode", label: "Decoding calldata" },
  { id: "simulate", label: "Simulating execution" },
  { id: "reputation", label: "Checking reputation" },
  { id: "risk", label: "Calculating risk score" },
];

export function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length) return;
    const delay = [600, 800, 700, 500][activeStep] || 600;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-sm">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <svg
            className="animate-spin w-16 h-16 text-emerald-400/30"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <p className="text-sm font-semibold text-white/60 mb-5">
          Analyzing Transaction
        </p>

        <div className="space-y-3 text-left">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                i <= activeStep
                  ? "opacity-100"
                  : "opacity-20"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < activeStep
                    ? "bg-emerald-500/20 text-emerald-400"
                    : i === activeStep
                      ? "bg-emerald-500/40 text-emerald-300"
                      : "bg-white/5 text-white/20"
                }`}
              >
                {i < activeStep ? "✓" : i === activeStep ? "→" : ""}
              </span>
              <span
                className={
                  i <= activeStep ? "text-white/70" : "text-white/20"
                }
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
