# @preflight/sdk

TypeScript SDK for Preflight — transaction intelligence and safety layer for Web3.

## Installation

```bash
npm install @preflight/sdk
# or
pnpm add @preflight/sdk
```

## Usage

```typescript
import { Preflight } from "@preflight/sdk";

const preflight = new Preflight({
  apiUrl: "http://localhost:3001",
});

// Analyze a transaction
const result = await preflight.check({
  chainId: 10143,
  from: "0x7ab210017c3ea0080ae1b70cec6eedb579023861",
  to: "0x1234567890abcdef1234567890abcdef12345678",
  value: "0",
  data: "0x095ea7b3000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
});

console.log(result.risk.level); // "HIGH"
console.log(result.risk.reasons); // ["Unlimited token approval detected"]
console.log(result.recommendation); // "Reject this transaction"
```

## Quick Checks

```typescript
// Check if transaction is safe
const isSafe = await preflight.isSafe(transaction);

// Get risk level only
const level = await preflight.getRiskLevel(transaction);
```

## Configuration

```typescript
const preflight = new Preflight({
  apiUrl: "https://api.preflight.dev", // Required
  timeout: 10000, // Optional, default 30000ms
});
```

## Error Handling

```typescript
import { Preflight, PreflightError } from "@preflight/sdk";

try {
  await preflight.check(transaction);
} catch (error) {
  if (error instanceof PreflightError) {
    console.log(error.statusCode); // 400, 408, 500
    console.log(error.message);
  }
}
```

## License

MIT
