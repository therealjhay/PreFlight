import { FastifyInstance } from "fastify";
import { decodeTransaction } from "../services/decoder.js";

export default async function analyzeRoute(app: FastifyInstance) {
  app.post("/analyze", async (request) => {
    const body: any = request.body;

    const decoded = decodeTransaction(body.data);

    return {
      transaction: body,
      analysis: decoded,
    };
  });
}
