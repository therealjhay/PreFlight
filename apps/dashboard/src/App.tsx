import { useState, useRef, useEffect } from "react";
import { Preflight } from "@preflight/sdk";
import type { AnalysisResponse } from "@preflight/types";
import { PageShell } from "./components/Layout/PageShell";
import { TransactionForm } from "./components/Input/TransactionForm";
import { AnalysisResult } from "./components/Analysis/AnalysisResult";
import { EmptyState } from "./components/Status/EmptyState";
import { LoadingState } from "./components/Status/LoadingState";
import { ErrorState } from "./components/Status/ErrorState";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const preflight = new Preflight({ apiUrl: API_URL });

function App() {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateKey, setStateKey] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleAnalyze = async (to: string, data: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStateKey((k) => k + 1);

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

  const renderRightPanel = () => {
    if (error) return <ErrorState message={error} />;

    if (loading) return <LoadingState key={stateKey} />;

    if (result) return <AnalysisResult key={stateKey} result={result} />;

    return <EmptyState />;
  };

  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2">
          <TransactionForm onSubmit={handleAnalyze} loading={loading} />
        </div>
        <div className="lg:col-span-3" ref={resultRef} aria-live="polite">
          {renderRightPanel()}
        </div>
      </div>
    </PageShell>
  );
}

export default App;
