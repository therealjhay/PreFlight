import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = Fastify({
  logger: {
    level: "info",
  },
});

await app.register(cors);

await app.register(analyzeRoute, {
  prefix: "/api",
});

app.get("/", async () => {
  return {
    name: "Preflight API",
    version: "0.1.0",
    status: "running",
  };
});

app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
  app.log.error(error);
  reply.status(500).send({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : error.message,
  });
});

const port = parseInt(process.env.PORT || "3001", 10);

await app.listen({
  port,
  host: "0.0.0.0",
});

console.log(`Preflight API running on port ${port}`);
