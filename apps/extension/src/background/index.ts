import type { AnalyzeRequest, AnalysisResponse } from "@preflight/types";

const API_URL = "http://localhost:3001";

interface PendingRequest {
  resolve: (value: AnalysisResponse) => void;
  reject: (reason: Error) => void;
}

const pendingRequests = new Map<string, PendingRequest>();

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; id: string; data: unknown },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => {
    if (message.type === "ANALYZE_TRANSACTION") {
      analyzeTransaction(message.data as AnalyzeRequest)
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Analysis failed",
          });
        });

      return true;
    }

    if (message.type === "GET_API_URL") {
      chrome.storage.local.get("apiUrl", (data) => {
        sendResponse({ apiUrl: data.apiUrl || API_URL });
      });
      return true;
    }

    if (message.type === "SET_API_URL") {
      chrome.storage.local.set({ apiUrl: message.data });
      sendResponse({ success: true });
      return true;
    }
  }
);

async function analyzeTransaction(
  transaction: AnalyzeRequest
): Promise<AnalysisResponse> {
  const data = await chrome.storage.local.get("apiUrl");
  const apiUrl = data.apiUrl || API_URL;

  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Unknown error",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
chrome.action.setBadgeText({ text: "ON" });
