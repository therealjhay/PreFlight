import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { validateAnalyzeRequest } from "@preflight/shared";
import { decodeTransaction } from "../services/decoder.js";
import { calculateRisk } from "../services/riskEngine.js";
import { queryReputation } from "../services/reputation.js";
import { simulateTransaction } from "../services/simulation.js";

export default async function analyzeRoute(app: FastifyInstance) {
  app.post(
    "/analyze",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const validated = validateAnalyzeRequest(request.body);

        const decoded = decodeTransaction(validated.data);

        const [reputation, simulation] = await Promise.all([
          queryReputation(validated.to),
          simulateTransaction(
            validated.chainId,
            validated.from,
            validated.to,
            validated.value,
            validated.data
          ),
        ]);

        const risk = calculateRisk(decoded, reputation);

        const recommendation =
          risk.level === "HIGH"
            ? "Reject this transaction"
            : risk.level === "MEDIUM"
              ? "Review carefully before proceeding"
              : "Transaction appears safe";

        return {
          transaction: {
            chainId: validated.chainId,
            from: validated.from,
            to: validated.to,
            value: validated.value,
            data: validated.data,
          },
          decoded,
          simulation,
          reputation,
          risk,
          recommendation,
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes("Invalid")) {
          return reply.status(400).send({
            error: "Validation failed",
            message: error.message,
          });
        }

        console.error("Analysis error:", error);
        return reply.status(500).send({
          error: "Internal server error",
          message: "Failed to analyze transaction",
        });
      }
    }
  );
}
