(() => {
  if (window.__PREFLIGHT_INJECTED__) return;
  window.__PREFLIGHT_INJECTED__ = true;

  const pendingRequests = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason: unknown) => void;
    }
  >();

  let requestId = 0;

  function generateId(): string {
    return `preflight_${++requestId}_${Date.now()}`;
  }

  function interceptRequest(
    method: string,
    params: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = generateId();

      pendingRequests.set(id, { resolve, reject });

      window.postMessage({
        type: "PREFLIGHT_INTERCEPT",
        method,
        params,
        id,
      });
    });
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data?.type === "PREFLIGHT_RESULT") {
      const { id, result, error, shouldBlock } = event.data;
      const pending = pendingRequests.get(id);

      if (!pending) return;

      pendingRequests.delete(id);

      if (error) {
        pending.reject(new Error(error));
      } else if (shouldBlock) {
        pending.reject(new Error("Transaction blocked by Preflight: " + result.risk.reasons.join(", ")));
      } else {
        pending.resolve(result);
      }
    }

    if (event.data?.type === "PREFLIGHT_FORWARD") {
      const { id, approved } = event.data;
      const pending = pendingRequests.get(id);

      if (!pending) return;

      pendingRequests.delete(id);
      pending.resolve(approved);
    }
  });

  const originalProvider = window.ethereum;

  if (originalProvider) {
    const proxyHandler: ProxyHandler<unknown> = {
      get(target: Record<string, unknown>, prop: string) {
        if (prop === "request") {
          return async (args: { method: string; params: unknown[] }) => {
            if (
              args.method === "eth_sendTransaction" ||
              args.method === "eth_signTypedData"
            ) {
              try {
                await interceptRequest(args.method, args.params);
              } catch (error) {
                throw error;
              }
            }

            return (target[prop] as Function).call(target, args);
          };
        }

        if (prop === "send" || prop === "sendAsync") {
          return (
            args: { method: string; params: unknown[] },
            callback: (error: Error | null, result?: unknown) => void
          ) => {
            if (
              args.method === "eth_sendTransaction" ||
              args.method === "eth_signTypedData"
            ) {
              interceptRequest(args.method, args.params)
                .then(() => {
                  return (target[prop] as Function).call(target, args, callback);
                })
                .catch((error) => {
                  callback(error);
                });
              return;
            }

            return (target[prop] as Function).call(target, args, callback);
          };
        }

        return Reflect.get(target, prop);
      },
    };

    window.ethereum = new Proxy(originalProvider, proxyHandler);
  }

  window.dispatchEvent(new Event("preflight-ready"));
})();

declare global {
  interface Window {
    __PREFLIGHT_INJECTED__?: boolean;
    ethereum?: Record<string, unknown>;
  }
}
