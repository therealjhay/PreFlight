import { Interface } from "ethers";
import type { DecodedTransaction, TransactionAction } from "@preflight/types";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount)",
  "function transfer(address to, uint256 amount)",
  "function transferFrom(address from, address to, uint256 amount)",
];

const ERC721_ABI = [
  "function setApprovalForAll(address operator, bool approved)",
];

const erc20Iface = new Interface(ERC20_ABI);
const erc721Iface = new Interface(ERC721_ABI);

const UNLIMITED_THRESHOLD = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

function decodeERC20(data: string): DecodedTransaction | null {
  try {
    const decoded = erc20Iface.parseTransaction({ data });
    if (!decoded) return null;

    switch (decoded.name) {
      case "approve": {
        const amount = decoded.args[1].toString();
        const isUnlimited = BigInt(amount) >= UNLIMITED_THRESHOLD;
        return {
          action: "APPROVAL",
          description: isUnlimited
            ? "Unlimited token approval"
            : "Token approval",
          spender: decoded.args[0],
          amount,
        };
      }

      case "transfer":
        return {
          action: "TRANSFER",
          description: "Token transfer",
          recipient: decoded.args[0],
          amount: decoded.args[1].toString(),
        };

      case "transferFrom":
        return {
          action: "TRANSFER_FROM",
          description: "TransferFrom call",
          recipient: decoded.args[1],
          amount: decoded.args[2].toString(),
        };

      default:
        return null;
    }
  } catch {
    return null;
  }
}

function decodeERC721(data: string): DecodedTransaction | null {
  try {
    const decoded = erc721Iface.parseTransaction({ data });
    if (!decoded) return null;

    switch (decoded.name) {
      case "setApprovalForAll":
        return {
          action: "SET_APPROVAL_FOR_ALL",
          description: decoded.args[1]
            ? "Granting full NFT collection control"
            : "Revoking NFT collection control",
          spender: decoded.args[0],
        };

      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function decodeTransaction(data: string): DecodedTransaction {
  const erc20Result = decodeERC20(data);
  if (erc20Result) return erc20Result;

  const erc721Result = decodeERC721(data);
  if (erc721Result) return erc721Result;

  return {
    action: "UNKNOWN",
    description: "Unrecognized transaction",
    functionSignature: data.slice(0, 10),
  };
}
