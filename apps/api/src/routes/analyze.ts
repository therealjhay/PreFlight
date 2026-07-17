import { FastifyInstance } from "fastify";
import { decodeTransaction } from "../services/decoder.js";
import { calculateRisk } from "../services/riskEngine.js";

export default async function analyzeRoute(app: FastifyInstance) {
  app.post("/analyze", async (request) => {
    const body: any = request.body;

    const decoded = decodeTransaction(body.data);

    const risk = calculateRisk(decoded);

    return {
      transaction: body,

      decoded,

      risk,
    };
  });
}
