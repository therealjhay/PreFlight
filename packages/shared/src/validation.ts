import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  chainId: z.number().int().positive(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid from address"),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid to address"),
  value: z.string(),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, "Invalid hex data"),
  userIntent: z.string().optional(),
});

export type ValidatedAnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
