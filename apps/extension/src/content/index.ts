import type { AnalyzeRequest } from "@preflight/types";

const INTERCEPTED_METHODS = ["eth_sendTransaction", "eth_signTypedData"];

function injectProviderInterceptor() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("provider.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

function setupMessageListener() {
  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;
    if (event.data?.type !== "PREFLIGHT_INTERCEPT") return;

    const { method, params, id } = event.data;

    if (!INTERCEPTED_METHODS.includes(method)) {
      window.postMessage({
        type: "PREFLIGHT_FORWARD",
        id,
        approved: true,
      });
      return;
    }

    try {
      const transaction = extractTransaction(method, params);

      const response = await chrome.runtime.sendMessage({
        type: "ANALYZE_TRANSACTION",
        id,
        data: transaction,
      });

      if (response?.success) {
        const result = response.data;

        window.postMessage({
          type: "PREFLIGHT_RESULT",
          id,
          result,
          shouldBlock: result.risk.level === "HIGH",
        });
      } else {
        window.postMessage({
          type: "PREFLIGHT_RESULT",
          id,
          result: null,
          error: response?.error || "Analysis failed",
          shouldBlock: false,
        });
      }
    } catch (error) {
      window.postMessage({
        type: "PREFLIGHT_RESULT",
        id,
        result: null,
        error: error instanceof Error ? error.message : "Unknown error",
        shouldBlock: false,
      });
    }
  });
}

function extractTransaction(
  method: string,
  params: unknown[]
): AnalyzeRequest {
  if (method === "eth_sendTransaction" && params[0]) {
    const tx = params[0] as Record<string, string>;
    return {
      chainId: 10143,
      from: tx.from || "",
      to: tx.to || "",
      value: tx.value || "0",
      data: tx.data || "0x",
    };
  }

  if (method === "eth_signTypedData" && params[1]) {
    const data = params[1] as Record<string, unknown>;
    return {
      chainId: 10143,
      from: params[0] as string,
      to: "",
      value: "0",
      data: JSON.stringify(data),
    };
  }

  return {
    chainId: 10143,
    from: "",
    to: "",
    value: "0",
    data: "0x",
  };
}

injectProviderInterceptor();
setupMessageListener();
