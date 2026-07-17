import type { AnalyzeRequest, AnalysisResponse } from "@preflight/types";

export interface PreflightConfig {
  apiUrl: string;
  timeout?: number;
}

export class Preflight {
  private apiUrl: string;
  private timeout: number;

  constructor(config: PreflightConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, "");
    this.timeout = config.timeout || 30000;
  }

  async check(
    transaction: AnalyzeRequest
  ): Promise<AnalysisResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.apiUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Unknown error",
        }));
        throw new PreflightError(
          error.message || `HTTP ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof PreflightError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new PreflightError("Request timed out", 408);
      }

      throw new PreflightError(
        error instanceof Error ? error.message : "Network error",
        0
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async isSafe(transaction: AnalyzeRequest): Promise<boolean> {
    const result = await this.check(transaction);
    return result.risk.level === "LOW";
  }

  async getRiskLevel(
    transaction: AnalyzeRequest
  ): Promise<"LOW" | "MEDIUM" | "HIGH"> {
    const result = await this.check(transaction);
    return result.risk.level;
  }
}

export class PreflightError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "PreflightError";
    this.statusCode = statusCode;
  }
}

export function createPreflight(config: PreflightConfig): Preflight {
  return new Preflight(config);
}
