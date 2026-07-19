import type { SimulationResult } from "@preflight/types";
import { Card } from "../common/Card";

interface SimulationResultCardProps {
  simulation: SimulationResult;
}

export function SimulationResultCard({
  simulation,
}: SimulationResultCardProps) {
  return (
    <Card className="p-5">
      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
        SIMULATION
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-2 h-2 rounded-full ${
            simulation.success ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span className="text-sm text-white/70">
          {simulation.success
            ? "Execution simulation passed"
            : "Simulation failed"}
        </span>
      </div>
      {simulation.warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          {simulation.warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-400/60 mt-1">
              {w}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}
