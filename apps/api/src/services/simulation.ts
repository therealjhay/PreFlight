import { ethers } from "ethers";
import dotenv from "dotenv";
import type {
  SimulationResult,
  AssetMovement,
  ApprovalGrant,
} from "@preflight/types";

dotenv.config();

const RPC_URL = process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

const KNOWN_TOKENS: Record<string, { symbol: string; decimals: number }> = {};

function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

async function getTokenInfo(
  provider: ethers.JsonRpcProvider,
  tokenAddress: string
): Promise<{ symbol: string; decimals: number }> {
  if (KNOWN_TOKENS[tokenAddress]) {
    return KNOWN_TOKENS[tokenAddress];
  }

  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const [symbol, decimals] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
    ]);
    const info = { symbol, decimals: Number(decimals) };
    KNOWN_TOKENS[tokenAddress] = info;
    return info;
  } catch {
    return { symbol: "UNKNOWN", decimals: 18 };
  }
}

async function detectAssetMovements(
  provider: ethers.JsonRpcProvider,
  from: string,
  to: string,
  value: string
): Promise<{ sent: AssetMovement[]; received: AssetMovement[] }> {
  const sent: AssetMovement[] = [];
  const received: AssetMovement[] = [];

  if (value !== "0" && value !== "0x0") {
    sent.push({
      token: "native",
      symbol: "MON",
      amount: value,
      from,
      to,
    });
  }

  return { sent, received };
}

export async function simulateTransaction(
  chainId: number,
  from: string,
  to: string,
  value: string,
  data: string
): Promise<SimulationResult> {
  const provider = getProvider();

  try {
    const txRequest = {
      from,
      to,
      value: BigInt(value || "0"),
      data: data || "0x",
    };

    const result = await provider.call(txRequest);

    const warnings: string[] = [];

    const hasReturnValue = result !== "0x" && result.length > 10;

    const { sent, received } = await detectAssetMovements(
      provider,
      from,
      to,
      value
    );

    const approvals: ApprovalGrant[] = [];

    if (data && data.length >= 10) {
      const selector = data.slice(0, 10);

      if (
        selector === "0x095ea7b3" ||
        selector === "0xa22cb465"
      ) {
        try {
          const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
            ["address", "uint256"],
            "0x" + data.slice(10)
          );
          const spender = decoded[0];
          const amount = decoded[1].toString();

          approvals.push({
            token: to,
            spender,
            amount,
            isUnlimited:
              amount ===
              "115792089237316195423570985008687907853269984665640564039457584007913129639935",
          });
        } catch {}
      }

      if (selector === "0xsetApprovalForAll") {
        try {
          const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
            ["address", "bool"],
            "0x" + data.slice(10)
          );
          approvals.push({
            token: to,
            spender: decoded[0],
            amount: "MAX",
            isUnlimited: true,
          });
        } catch {}
      }
    }

    if (hasReturnValue) {
      warnings.push("Transaction returns data - may have side effects");
    }

    return {
      success: true,
      assetsSent: sent,
      assetsReceived: received,
      approvals,
      warnings,
    };
  } catch (error) {
    const revertReason =
      error instanceof Error ? error.message : "Unknown error";

    const isRevert = revertReason.includes("revert");

    return {
      success: false,
      assetsSent: [],
      assetsReceived: [],
      approvals: [],
      warnings: [
        isRevert
          ? `Transaction will revert: ${revertReason}`
          : "Transaction simulation failed",
      ],
      revertReason: isRevert ? revertReason : undefined,
    };
  }
}
