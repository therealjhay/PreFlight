import { describe, it, expect } from "vitest";
import { decodeTransaction } from "../services/decoder.js";

describe("decodeTransaction", () => {
  const ERC20_APPROVE =
    "0x095ea7b3000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0000000000000000000000000000000000000000000000000de0b6b3a7640000";

  const ERC20_TRANSFER =
    "0xa9059cbb000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0000000000000000000000000000000000000000000000000de0b6b3a7640000";

  it("decodes ERC20 approve", () => {
    const result = decodeTransaction(ERC20_APPROVE);

    expect(result.action).toBe("APPROVAL");
    expect(result.description).toBe("Token approval");
    expect(result.spender).toBe(
      "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa"
    );
    expect(result.amount).toBe("1000000000000000000");
  });

  it("decodes ERC20 transfer", () => {
    const result = decodeTransaction(ERC20_TRANSFER);

    expect(result.action).toBe("TRANSFER");
    expect(result.description).toBe("Token transfer");
    expect(result.recipient).toBeDefined();
    expect(result.amount).toBe("1000000000000000000");
  });

  it("returns UNKNOWN for unrecognized data", () => {
    const result = decodeTransaction("0xdeadbeef");

    expect(result.action).toBe("UNKNOWN");
    expect(result.description).toBe("Unrecognized transaction");
  });

  it("returns UNKNOWN for empty data", () => {
    const result = decodeTransaction("0x");

    expect(result.action).toBe("UNKNOWN");
  });
});
