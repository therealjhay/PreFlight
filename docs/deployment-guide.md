# Preflight — Deployment & Demo Guide

## Architecture

```
Browser (Dashboard / Extension)
        │
        ▼  POST /api/analyze
  ┌──────────────┐
  │  Fastify API  │─── eth_call ──▶ Monad Testnet RPC
  │  (port 3001)  │─── query ─────▶ PreflightRegistry (0xE5FbDc6b1...)
  └──────────────┘
```

## Quick Start (Local Demo)

### 1. Start the API

```bash
cd apps/api
cp .env.example .env    # Already configured
pnpm dev
```

Confirm it's running:

```bash
curl http://localhost:3001
# → {"name":"Preflight API","version":"0.1.0","status":"running"}
```

### 2. Start the Dashboard

```bash
cd apps/dashboard
pnpm dev
# → http://localhost:3002
```

### 3. Open the Dashboard

Navigate to **http://localhost:3002** in your browser.

---

## Demo Walkthrough

### DEMO SAFE (Transfer)
Click **DEMO SAFE** → then **ANALYZE TRANSACTION**

Expected result:
- Risk: LOW (green, ~35/100)
- Action: TRANSFER
- Reputation: CLEAN
- Recommendation: "Transaction appears safe"

### DEMO APPROVAL
Click **DEMO APPROVAL** → **ANALYZE TRANSACTION**

Expected result:
- Risk: MEDIUM (amber, ~60/100)
- Action: APPROVAL
- Reputation: CLEAN
- Findings: Token approval detected, unknown contract

### DEMO MALICIOUS
Click **DEMO MALICIOUS** → **ANALYZE TRANSACTION**

Expected result:
- Risk: HIGH (red, ~80-90/100)
- Action: APPROVAL (unlimited)
- Reputation: CLEAN (or FLAGGED if in registry)
- Findings: Unlimited token approval detected, unknown contract

---

## Analysis Response

Each demo calls the API and returns:

```json
{
  "decoded":     { "action": "APPROVAL", "description": "..." },
  "simulation":  { "success": true, "approvals": [...] },
  "reputation":  { "flagged": false, "score": 0 },
  "risk":        { "score": 60, "level": "MEDIUM", "reasons": [...] },
  "recommendation": "Review carefully before proceeding"
}
```

---

## Smart Contract (Already Deployed)

| Detail | Value |
|---|---|
| Contract | PreflightRegistry |
| Network | Monad Testnet |
| Address | `0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA` |
| Explorer | [Monad Explorer](https://testnet.monadexplorer.com/address/0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA) |
| RPC | `https://testnet-rpc.monad.xyz` |

---

## Extension (Optional)

Build the Chrome extension:

```bash
cd apps/extension
pnpm build
```

Then in Chrome:
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/extension/dist/`

---

## Docker Deployment

```bash
docker compose up -d
# API available at http://localhost:3001
```

Set environment variables in a `.env` file:

```env
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
REGISTRY_ADDRESS=0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA
```

---

## Key Files

| File | Purpose |
|---|---|
| `apps/api/.env` | API config (RPC, contract address) |
| `contracts/.env` | Contract deployment keys |
| `apps/dashboard/.env` | Frontend API URL |
| `docker-compose.yml` | Production deployment |
