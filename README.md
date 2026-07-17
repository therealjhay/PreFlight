# Preflight

Transaction intelligence and safety layer for Web3. Analyzes blockchain transactions before users sign them, explains what will happen in human-readable language, and prevents irreversible mistakes.

## What Preflight Does

Before you sign any transaction, Preflight:

- **Decodes** what the transaction actually does
- **Simulates** execution to detect failures
- **Checks** contract reputation against on-chain registry
- **Detects** risky behavior (unlimited approvals, malicious contracts)
- **Verifies** user intent matches the transaction
- **Warns** you with clear, human-readable explanations

## Architecture

```
preflight/
├── apps/
│   ├── api/              Backend analysis engine
│   ├── extension/        Chrome browser extension
│   └── dashboard/        Developer dashboard
├── packages/
│   ├── sdk/              Developer SDK
│   ├── shared/           Shared utilities
│   └── types/            TypeScript definitions
├── contracts/            Monad smart contracts
├── docker/               Docker configuration
└── docs/                 Documentation
```

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Fastify, TypeScript, Ethers.js
- **Blockchain:** Monad, Solidity, Foundry, OpenZeppelin
- **Extension:** Chrome Manifest V3, React
- **Infrastructure:** Docker, GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- Foundry (for contracts)

### Installation

```bash
git clone https://github.com/your-org/preflight.git
cd preflight
pnpm install
```

### Development

```bash
# Start API server
cd apps/api
cp .env.example .env
pnpm dev

# Start dashboard
cd apps/dashboard
pnpm dev

# Build extension
cd apps/extension
pnpm build
```

### Run Tests

```bash
# API tests
cd apps/api
pnpm test

# Contract tests
cd contracts
forge test
```

## API Usage

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 10143,
    "from": "0x7ab210017c3ea0080ae1b70cec6eedb579023861",
    "to": "0x1234567890abcdef1234567890abcdef12345678",
    "value": "0",
    "data": "0x095ea7b3000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa115792089237316195423570985008687907853269984665640564039457584007913129639935"
  }'
```

Response:

```json
{
  "transaction": { "chainId": 10143, "from": "...", "to": "...", "value": "0", "data": "0x..." },
  "decoded": { "action": "APPROVAL", "description": "Unlimited token approval", "spender": "0x...", "amount": "..." },
  "simulation": { "success": true, "assetsSent": [], "assetsReceived": [], "approvals": [...], "warnings": [] },
  "reputation": { "flagged": false, "score": 0 },
  "risk": { "score": 80, "level": "HIGH", "reasons": ["Unlimited token approval detected"], "recommendation": "Reject this transaction" },
  "recommendation": "Reject this transaction"
}
```

## SDK Usage

```typescript
import { Preflight } from "@preflight/sdk";

const preflight = new Preflight({ apiUrl: "http://localhost:3001" });

const result = await preflight.check({
  chainId: 10143,
  from: "0x...",
  to: "0x...",
  value: "0",
  data: "0x...",
});

if (result.risk.level === "HIGH") {
  console.error("Dangerous transaction:", result.risk.reasons);
}
```

## Smart Contracts

Deployed to Monad testnet:

- **PreflightRegistry:** `0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA`

Features:
- Flag addresses with risk scores
- Query contract reputation
- Batch operations
- Event emission

## Docker

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MONAD_RPC_URL` | Monad RPC endpoint | `https://testnet-rpc.monad.xyz` |
| `REGISTRY_ADDRESS` | Deployed registry contract | - |
| `PORT` | API server port | `3001` |

## License

MIT
