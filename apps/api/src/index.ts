import Fastify from "fastify";
import cors from "@fastify/cors";
import analyzeRoute from "./routes/analyze.js";

const app = Fastify();

await app.register(cors);

await app.register(analyzeRoute, {
  prefix: "/api",
});

app.get("/", async () => {
  return {
    name: "Preflight API",
    status: "running",
  };
});

await app.listen({
  port: 3001,
  host: "0.0.0.0",
});

console.log("Preflight API running on port 3001");
