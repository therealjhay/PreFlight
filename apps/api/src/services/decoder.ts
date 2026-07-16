import { Interface } from "ethers";

const ERC20_ABI = [
  "function approve(address spender,uint256 amount)",
  "function transfer(address to,uint256 amount)",
];

const iface = new Interface(ERC20_ABI);

export function decodeTransaction(data: string) {
  try {
    const decoded = iface.parseTransaction({
      data,
    });

    if (!decoded) {
      return {
        action: "UNKNOWN",
        risk: "LOW",
      };
    }

    switch (decoded.name) {
      case "approve":
        return {
          action: "APPROVAL",
          spender: decoded.args[0],
          amount: decoded.args[1].toString(),
          risk: "HIGH",
          description: "Token approval detected",
        };

      case "transfer":
        return {
          action: "TRANSFER",
          recipient: decoded.args[0],
          amount: decoded.args[1].toString(),
          risk: "MEDIUM",
          description: "Token transfer detected",
        };

      default:
        return {
          action: "UNKNOWN",
          risk: "LOW",
        };
    }
  } catch {
    return {
      action: "UNKNOWN",
      risk: "LOW",
    };
  }
}
