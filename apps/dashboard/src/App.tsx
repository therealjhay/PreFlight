import { useState } from "react";
import { Preflight } from "@preflight/sdk";
import type { AnalyzeRequest, AnalysisResponse } from "@preflight/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const preflight = new Preflight({ apiUrl: API_URL });

function App() {
  const [activeTab, setActiveTab] = useState<"analyze" | "reputation">(
    "analyze"
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Preflight Dashboard</h1>
            <p className="text-sm text-gray-400">Transaction Intelligence</p>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-800 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "analyze"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Analyze Transaction
          </button>
          <button
            onClick={() => setActiveTab("reputation")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "reputation"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Contract Reputation
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === "analyze" && <AnalyzeTab />}
        {activeTab === "reputation" && <ReputationTab />}
      </main>
    </div>
  );
}

function AnalyzeTab() {
  const [to, setTo] = useState("");
  const [data, setData] = useState("0x");
  const [value, setValue] = useState("0");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await preflight.check({
        chainId: 10143,
        from: "0x0000000000000000000000000000000000000000",
        to,
        value,
        data,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Input Transaction</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Contract Address
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Calldata
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x..."
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Value (wei)
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !to}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium"
        >
          {loading ? "Analyzing..." : "Analyze Transaction"}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Analysis Result</h2>

        {result ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                result.risk.level === "HIGH"
                  ? "bg-red-500/10 border-red-500/30"
                  : result.risk.level === "MEDIUM"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-emerald-500/10 border-emerald-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Level</span>
                <span
                  className={`text-lg font-bold ${
                    result.risk.level === "HIGH"
                      ? "text-red-400"
                      : result.risk.level === "MEDIUM"
                        ? "text-amber-400"
                        : "text-emerald-400"
                  }`}
                >
                  {result.risk.level}
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">{result.risk.score}</div>
              <div className="text-sm text-gray-400">
                {result.recommendation}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h3 className="text-sm font-medium mb-2">Decoded Action</h3>
              <div className="text-sm">
                <span className="text-emerald-400 font-mono">
                  {result.decoded.action}
                </span>
                <p className="text-gray-400 mt-1">
                  {result.decoded.description}
                </p>
              </div>
            </div>

            {result.risk.reasons.length > 0 && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <h3 className="text-sm font-medium mb-2">Risk Reasons</h3>
                <ul className="text-sm space-y-1">
                  {result.risk.reasons.map((reason, i) => (
                    <li key={i} className="text-gray-400">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h3 className="text-sm font-medium mb-2">Reputation</h3>
              <div className="text-sm">
                {result.reputation.flagged ? (
                  <span className="text-red-400">
                    Flagged (Score: {result.reputation.score})
                  </span>
                ) : (
                  <span className="text-emerald-400">Not flagged</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Enter a transaction to analyze
          </div>
        )}
      </div>
    </div>
  );
}

function ReputationTab() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<{
    flagged: boolean;
    score: number;
    reason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await preflight.check({
        chainId: 10143,
        from: "0x0000000000000000000000000000000000000000",
        to: address,
        value: "0",
        data: "0x",
      });
      setResult(response.reputation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-medium mb-4">Lookup Contract Reputation</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Contract address (0x...)"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
        />
        <button
          onClick={handleLookup}
          disabled={loading || !address}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium"
        >
          {loading ? "Checking..." : "Lookup"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                result.flagged ? "bg-red-500/20" : "bg-emerald-500/20"
              }`}
            >
              {result.flagged ? (
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div>
              <div className="text-lg font-medium">
                {result.flagged ? "Flagged Contract" : "Clean Contract"}
              </div>
              <div className="text-sm text-gray-400">
                Risk Score: {result.score}
              </div>
            </div>
          </div>

          {result.reason && (
            <div className="text-sm text-gray-400">
              <span className="text-gray-500">Reason:</span> {result.reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
