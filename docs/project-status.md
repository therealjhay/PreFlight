# PreFlight — Project Status

**Last updated:** 2026-07-17

---

## Overview

PreFlight is a transaction intelligence and safety layer that protects Web3 users before they sign blockchain transactions. It analyzes calldata, scores risk, queries on-chain reputation, and warns users about dangerous actions.

**Target chain:** Monad testnet (Chain ID: 10143)
**Contract address:** `0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA`

---

## Architecture

```
preflight/
├── apps/
│   ├── api/              ✅ Working (Fastify, port 3001)
│   ├── extension/        ⚠️ Scaffold only (default Vite template)
│   └── dashboard/        ❌ Empty directory
├── packages/
│   ├── sdk/              ❌ Empty directory
│   ├── shared/           ❌ Not created
│   └── types/            ❌ Not created
├── contracts/
│   └── PreflightRegistry ✅ Deployed to Monad testnet
└── docs/                 ❌ Empty
```

---

## Component Status

### Contracts — PreflightRegistry.sol

**Status:** Deployed and functional

| Capability | Status |
|---|---|
| Flag address with risk score (0-100) | Working |
| Query address reputation | Working |
| Remove flagged address | Working |
| Owner-only access control | Working |

**Missing:**
- Events for flag additions/removals
- Ownership transfer
- Multi-sig or role-based access
- Upgradeability (proxy pattern)
- Comprehensive tests (only 1 test covering happy path)
- Batch operations

**Deployed to:**
- Network: Monad testnet
- Address: `0xE5FbDc6b11F27f4F5bCe28E5a043BfEFBdF42daA`
- Deployer: `0x7ab210017c3ea0080ae1b70cec6eedb579023861`
- Block: 45,637,493

---

### API — Backend Analysis Engine

**Status:** Working, early prototype

| Endpoint | Status |
|---|---|
| `GET /` | Working (health check) |
| `POST /api/analyze` | Working (minimal) |

**What it does:**
1. Receives raw transaction calldata
2. Decodes ERC-20 `approve()` and `transfer()` calls
3. Scores risk based on decoded action (HIGH/MEDIUM/LOW)
4. Returns analysis response

**What's missing:**
- Input validation (body typed as `any`, no Zod)
- Reputation query (contract is deployed but API never calls it)
- Full `AnalysisResponse` shape (missing `reputation` field)
- Simulation engine (only TypeScript interfaces exist)
- Decoder coverage for ERC-721, ERC-1155, DEX swaps, unknown contracts
- Error handling middleware
- Structured logging
- Environment variable management (.env.example)

**Dependencies:** Fastify 5, ethers 6, Zod (unused), dotenv (unused)

---

### Extension — Browser Security Layer

**Status:** Default Vite+React scaffold, no extension functionality

| Requirement | Status |
|---|---|
| manifest.json | ❌ Missing |
| Background service worker | ❌ Missing |
| Content scripts | ❌ Missing |
| Popup page | ❌ Missing |
| Wallet interception | ❌ Missing |
| Extension icons | ❌ Missing |

This is an unmodified `create-vite` template. Needs complete rebuild as a Chrome Manifest V3 extension.

---

### Dashboard — Developer Dashboard

**Status:** Empty directory, not started.

---

### SDK — Developer Integration SDK

**Status:** Empty directory, not started.

**Planned interface:**
```ts
await preflight.check(transaction)
```

---

### Shared Packages

| Package | Status |
|---|---|
| `packages/shared/` | Not created |
| `packages/types/` | Not created |

---

## Frozen API Contracts

Defined in `architecture.md`:

### AnalyzeRequest
```ts
{
  chainId: number;
  from: string;
  to: string;
  value: string;
  data: string;
}
```

### AnalysisResponse
```ts
{
  transaction: { to, value, data }
  decoded: { action, description }
  risk: { score, level, reasons[], recommendation }
  reputation: { flagged, score, reason? }
}
```

**Current API does not return the `reputation` field.**

---

## Risk Pipeline

Architecture-defined flow:
```
Receive request → Validate input → Decode calldata → Query Monad Registry → Run risk rules → Generate explanation → Return response
```

Current implementation:
```
Receive request → Decode calldata → Run risk rules → Return response
```

**Missing steps:** Validate input, Query Monad Registry, Generate explanation

---

## Git History

| Commit | Description |
|---|---|
| `30843c0` | Project scaffold |
| `3dfc083` | Wrote preflight contract, script, and test files |
| `d6328ce` | Initialized deployment script |
| `2fa3f14` | Initialized frontend |
| `63bed99` | Built API foundation |
| `563d324` | Wrote decoder API and tested output |
| `ce1ffed` | Built risk engine and setup approval blocks |

---

## Completed Features

1. Monorepo structure with pnpm workspaces
2. Solidity contract for on-chain address reputation (flag/query/remove)
3. Contract deployed to Monad testnet
4. Fastify API server with health check
5. Transaction decoder for ERC-20 `approve` and `transfer`
6. Rule-based risk scoring engine
7. Architecture document with frozen API contracts

---

## Missing Features

### Critical (Phase 1)
- Shared type definitions (`packages/types/`)
- Shared utilities (`packages/shared/`)
- Input validation on API
- API returns full `AnalysisResponse` including reputation
- API queries deployed `PreflightRegistry` contract
- `.env.example` files
- Proper test coverage

### High Priority (Phase 2-5)
- Transaction simulation engine (`eth_call`)
- Extended decoder (ERC-721, DEX, unknown contracts)
- User intent verification
- Unlimited approval detection
- Browser extension with wallet interception

### Medium Priority (Phase 6-8)
- Dashboard UI
- Developer SDK
- Docker configuration
- CI/CD pipeline
- Monitoring and logging

---

## Recommended Next Milestone

**Phase 1: Repository Stabilization**

Objective: Harden the foundation before adding features.

| Task | Files |
|---|---|
| Create shared type definitions | `packages/types/` |
| Create shared utilities | `packages/shared/` |
| Add Zod validation to API | `apps/api/src/routes/analyze.ts` |
| Return full `AnalysisResponse` | `apps/api/src/routes/analyze.ts` |
| Wire API to `PreflightRegistry` | `apps/api/src/services/reputation.ts` (new) |
| Add `.env.example` files | `apps/api/`, `contracts/` |
| Add contract test coverage | `contracts/test/PreflightRegistry.t.sol` |
| Add API tests | `apps/api/src/__tests__/` (new) |
| Generate this document | `docs/project-status.md` |

**After stabilization, the project will be ready for Phase 2 (extended decoder and simulation engine).**

---

## Security Notes

- Hardcoded private key exists in `contracts/.env` (should be moved to a secrets manager for production)
- No secrets are committed to git (`.gitignore` in place)
- API runs with wide-open CORS (acceptable for dev, needs restriction for production)
