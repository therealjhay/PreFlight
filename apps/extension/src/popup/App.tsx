import { useState, useEffect } from "react";
import type { AnalysisResponse } from "@preflight/types";

function App() {
  const [apiUrl, setApiUrl] = useState("http://localhost:3001");
  const [isConnected, setIsConnected] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResponse | null>(
    null
  );

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_API_URL" }, (response) => {
      if (response?.apiUrl) {
        setApiUrl(response.apiUrl);
      }
    });
  }, []);

  const handleSaveUrl = () => {
    chrome.runtime.sendMessage({ type: "SET_API_URL", data: apiUrl });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-red-500/10 border-red-500/30";
      case "MEDIUM":
        return "bg-amber-500/10 border-amber-500/30";
      default:
        return "bg-emerald-500/10 border-emerald-500/30";
    }
  };

  return (
    <div className="w-80 min-h-[400px] bg-gray-950 text-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <h1 className="text-lg font-semibold">Preflight</h1>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">API URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleSaveUrl}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <h2 className="text-sm font-medium text-gray-400 mb-2">
          How it works
        </h2>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>1. Connect your wallet (MetaMask, Rabby)</li>
          <li>2. Click to send a transaction</li>
          <li>3. Preflight analyzes it automatically</li>
          <li>4. Review the safety assessment</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-xs text-gray-400">
          Preflight intercepts wallet transactions and analyzes them before you
          sign. Protected by{" "}
          <span className="text-emerald-400">Monad Registry</span>.
        </p>
      </div>
    </div>
  );
}

export default App;
