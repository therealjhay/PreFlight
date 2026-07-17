export interface SimulationInput {
  chainId: number;
  from: string;
  to: string;
  value: string;
  data: string;
}

export interface SimulationResult {
  success: boolean;
  action: string;
  warnings: string[];
}