import { useState, useRef, useEffect } from "react";
import { Preflight } from "@preflight/sdk";
import type { AnalysisResponse } from "@preflight/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const preflight = new Preflight({ apiUrl: API_URL });

function App() {
  const [mode, setMode] = useState<"analyze" | "reputation">("analyze");
  const [to, setTo] = useState("");
  const [data, setData] = useState("0x");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupAddr, setLookupAddr] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    flagged: boolean;
    score: number;
    reason?: string;
  } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await preflight.check({
        chainId: 10143,
        from: "0x0000000000000000000000000000000000000000",
        to,
        value: "0",
        data,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    setLookupLoading(true);
    setError(null);
    setLookupResult(null);

    try {
      const response = await preflight.check({
        chainId: 10143,
        from: "0x0000000000000000000000000000000000000000",
        to: lookupAddr,
        value: "0",
        data: "0x",
      });
      setLookupResult(response.reputation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  };

  const loadDemo = (demo: "approve" | "transfer") => {
    if (demo === "approve") {
      setTo("0x7a250d5630b4cf539739df2c5dacb4c659f2488d");
      setData(
        "0x095ea7b3000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
    } else {
      setTo("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      setData(
        "0xa9059cbb000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0000000000000000000000000000000000000000000000000de0b6b3a7640000"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="scanline" />

      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">PREFLIGHT</h1>
              <p className="text-[11px] text-emerald-400/80 tracking-widest uppercase font-medium">Transaction Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-emerald-400/60 font-mono">API READY</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8 mb-10">
          <button onClick={() => setMode("analyze")} className="relative">
            <span className={`text-sm font-medium transition-colors ${mode === "analyze" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
              ANALYZER
            </span>
            {mode === "analyze" && <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />}
          </button>
          <button onClick={() => setMode("reputation")} className="relative">
            <span className={`text-sm font-medium transition-colors ${mode === "reputation" ? "text-white" : "text-white/30 hover:text-white/60"}`}>
              REPUTATION
            </span>
            {mode === "reputation" && <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />}
          </button>
        </div>

        {mode === "analyze" ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-white/80 tracking-wide">TRANSACTION INPUT</h2>
                  <div className="flex gap-2">
                    <button onClick={() => loadDemo("approve")} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono">
                      DEMO APPROVE
                    </button>
                    <button onClick={() => loadDemo("transfer")} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono">
                      DEMO TRANSFER
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 tracking-wider font-medium">CONTRACT</label>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/40 mb-1.5 tracking-wider font-medium">CALLDATA</label>
                    <textarea
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      placeholder="0x..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !to}
                  className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-white/20 text-black font-semibold rounded-xl px-4 py-3 text-sm transition-all disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      RUNNING ANALYSIS
                    </span>
                  ) : (
                    "RUN ANALYSIS"
                  )}
                </button>
              </div>

              {error && (
                <div className="glass rounded-2xl p-4 border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-3" ref={resultRef}>
              {loading ? (
                <div className="glass rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <svg className="animate-spin w-8 h-8 text-emerald-400 mx-auto mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-white/40 font-mono">SIMULATING TRANSACTION...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4 slide-up">
                  <div className={`glass rounded-2xl p-6 ${result.risk.level === "HIGH" ? "glow-red" : result.risk.level === "MEDIUM" ? "glow-amber" : "glow-green"}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-[11px] text-white/40 tracking-wider font-medium mb-1">RISK ASSESSMENT</div>
                        <div className={`text-5xl font-black tracking-tight ${
                          result.risk.level === "HIGH" ? "text-red-400" : result.risk.level === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
                        }`}>
                          {result.risk.score}
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider ${
                        result.risk.level === "HIGH" ? "bg-red-500/20 text-red-300" : result.risk.level === "MEDIUM" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        {result.risk.level}
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
                      <div className={`h-full rounded-full transition-all duration-700 ${
                        result.risk.level === "HIGH" ? "bg-red-400" : result.risk.level === "MEDIUM" ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                        style={{ width: `${result.risk.score}%` }}
                      />
                    </div>

                    <p className="text-sm text-white/70">{result.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-2xl p-5">
                      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">DECODED ACTION</div>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-mono font-bold ${
                          result.decoded.action === "APPROVAL" ? "text-amber-400" : "text-emerald-400"
                        }`}>
                          {result.decoded.action}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mt-2">{result.decoded.description}</p>
                      {result.decoded.spender && (
                        <p className="text-xs font-mono text-white/30 mt-2 truncate">
                          Spender: {result.decoded.spender}
                        </p>
                      )}
                    </div>

                    <div className="glass rounded-2xl p-5">
                      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">CONTRACT REPUTATION</div>
                      {result.reputation.flagged ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
                          <span className="text-red-400 font-semibold text-sm">FLAGGED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-sm">CLEAN</span>
                        </div>
                      )}
                      {result.reputation.reason && (
                        <p className="text-xs text-white/40 mt-2">{result.reputation.reason}</p>
                      )}
                    </div>

                    <div className="glass rounded-2xl p-5 col-span-2">
                      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">SIMULATION</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${result.simulation.success ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="text-sm text-white/70">
                          {result.simulation.success ? "Execution simulation passed" : "Simulation failed"}
                        </span>
                      </div>
                      {result.simulation.approvals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <div className="text-xs text-white/40 mb-2">APPROVALS DETECTED</div>
                          {result.simulation.approvals.map((a, i) => (
                            <div key={i} className="text-xs font-mono text-white/50 mb-1">
                              {a.isUnlimited ? "∞ " : ""}{a.spender.slice(0, 10)}...
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {result.risk.reasons.length > 0 && (
                    <div className="glass rounded-2xl p-5">
                      <div className="text-[11px] text-white/40 tracking-wider font-medium mb-3">FINDINGS</div>
                      <div className="space-y-2">
                        {result.risk.reasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              reason.toLowerCase().includes("unlimited") || reason.toLowerCase().includes("malicious") || reason.toLowerCase().includes("flagged")
                                ? "bg-red-400"
                                : reason.toLowerCase().includes("approval")
                                  ? "bg-amber-400"
                                  : "bg-white/20"
                            }`} />
                            <span className="text-white/60">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                  <div className="text-center max-w-sm">
                    <svg className="w-12 h-12 text-white/10 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                    <p className="text-sm text-white/30 font-mono">ENTER A TRANSACTION TO ANALYZE</p>
                    <p className="text-xs text-white/15 mt-2">Or click DEMO to try with sample data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-xl">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white/80 tracking-wide mb-6">CONTRACT REPUTATION LOOKUP</h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={lookupAddr}
                  onChange={(e) => setLookupAddr(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-emerald-500/50 transition-all"
                />
                <button
                  onClick={handleLookup}
                  disabled={lookupLoading || !lookupAddr}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-white/20 text-black font-semibold rounded-xl px-6 py-3 text-sm transition-all disabled:cursor-not-allowed"
                >
                  {lookupLoading ? "SCANNING..." : "SCAN"}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 rounded-xl text-sm text-red-400">
                  {error}
                </div>
              )}

              {lookupResult && (
                <div className={`mt-6 glass rounded-2xl p-6 ${lookupResult.flagged ? "glow-red" : "glow-green"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      lookupResult.flagged ? "bg-red-500/20" : "bg-emerald-500/20"
                    }`}>
                      {lookupResult.flagged ? (
                        <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        {lookupResult.flagged ? "DANGEROUS" : "SAFE"}
                      </div>
                      <div className="text-sm text-white/50">
                        Risk Score: {lookupResult.score}/100
                      </div>
                    </div>
                    <div className={`ml-auto text-3xl font-black ${
                      lookupResult.flagged ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {lookupResult.score}
                    </div>
                  </div>
                  {lookupResult.reason && (
                    <div className="mt-4 pt-4 border-t border-white/5 text-sm text-white/50">
                      <span className="text-white/30 text-xs tracking-wider uppercase font-medium">Report: </span>
                      {lookupResult.reason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
