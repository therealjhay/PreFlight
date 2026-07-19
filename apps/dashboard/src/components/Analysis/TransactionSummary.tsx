import type { DecodedTransaction, SimulationResult } from "@preflight/types";
import { Card } from "../common/Card";

interface TransactionSummaryProps {
  decoded: DecodedTransaction;
  simulation: SimulationResult;
}

export function TransactionSummary({
  decoded,
  simulation,
}: TransactionSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-5">
        <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
          ACTION
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-mono font-bold ${
              decoded.action === "APPROVAL" ||
              decoded.action === "SET_APPROVAL_FOR_ALL"
                ? "text-amber-400"
                : decoded.action === "TRANSFER" ||
                    decoded.action === "TRANSFER_FROM"
                  ? "text-emerald-400"
                  : "text-white/40"
            }`}
          >
            {decoded.action}
          </span>
        </div>
        <p className="text-sm text-white/60 mt-2">{decoded.description}</p>
      </Card>

      <Card className="p-5">
        <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
          CONTRACT
        </div>
        {simulation.success ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-semibold text-sm">
              REACHABLE
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-red-400 font-semibold text-sm">
              UNREACHABLE
            </span>
          </div>
        )}
        {simulation.warnings.length > 0 && (
          <p className="text-xs text-white/40 mt-2">
            {simulation.warnings[0]}
          </p>
        )}
      </Card>

      {simulation.approvals.length > 0 && (
        <Card className="p-5 col-span-2">
          <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
            PERMISSIONS
          </div>
          <div className="space-y-2">
            {simulation.approvals.map((approval, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    approval.isUnlimited ? "bg-red-400" : "bg-amber-400"
                  }`}
                />
                <div>
                  <span className="text-white/70">
                    {approval.isUnlimited ? "Unlimited " : ""}
                    Approval to {approval.spender.slice(0, 10)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(simulation.assetsSent.length > 0 ||
        simulation.assetsReceived.length > 0) && (
        <Card className="p-5 col-span-2">
          <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">
            ASSETS
          </div>
          <div className="grid grid-cols-2 gap-4">
            {simulation.assetsSent.length > 0 && (
              <div>
                <div className="text-xs text-red-400/60 mb-1">SENDING</div>
                {simulation.assetsSent.map((asset, i) => (
                  <div key={i} className="text-sm text-white/60 font-mono">
                    {asset.amount} {asset.symbol}
                  </div>
                ))}
              </div>
            )}
            {simulation.assetsReceived.length > 0 && (
              <div>
                <div className="text-xs text-emerald-400/60 mb-1">RECEIVING</div>
                {simulation.assetsReceived.map((asset, i) => (
                  <div key={i} className="text-sm text-white/60 font-mono">
                    {asset.amount} {asset.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
