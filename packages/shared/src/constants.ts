export const MONAD_TESTNET = {
  chainId: 10143,
  name: "Monad Testnet",
  rpcUrl: "https://testnet-rpc.monad.xyz",
  explorerUrl: "https://testnet.monadexplorer.com",
  currency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
} as const;

export const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const RISK_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

export const RISK_SCORES = {
  UNLIMITED_APPROVAL: 50,
  APPROVAL: 30,
  UNKNOWN_CONTRACT: 30,
  MALICIOUS_REGISTRY: 90,
  LARGE_TRANSFER: 40,
  TRANSFER: 15,
  UNKNOWN_ACTION: 10,
} as const;
