/**
 * Demo: full x402 payment flow using OWS
 *
 * Usage:
 *   npx tsx scripts/demo-mispriced.ts --create-wallet   # first run
 *   npx tsx scripts/demo-mispriced.ts                    # after funding
 */

import { createWallet, getWallet } from "@open-wallet-standard/core";
import { x402Fetch } from "../src/x402/client";

const WALLET_NAME = "demo-agent";
const ENDPOINT =
  "https://api.quotient.social/api/v1/markets/mispriced?limit=3";

async function main() {
  // --- wallet creation mode ---
  if (process.argv.includes("--create-wallet")) {
    const wallet = createWallet(WALLET_NAME);
    const address = wallet.accounts[0].address;
    console.log("Wallet created!\n");
    console.log(`  Name:    ${WALLET_NAME}`);
    console.log(`  Address: ${address}`);
    console.log(`  Chain:   Base (eip155:8453)\n`);
    console.log("Send USDC to this address on Base, then run:");
    console.log("  npx tsx scripts/demo-mispriced.ts");
    return;
  }

  // --- fetch mode ---
  console.log("Loading wallet...");
  const wallet = getWallet(WALLET_NAME);
  console.log(`Using wallet ${wallet.accounts[0].address}\n`);

  console.log(`Fetching mispriced markets from:\n  ${ENDPOINT}\n`);

  try {
    const result = await x402Fetch(ENDPOINT, WALLET_NAME);

    console.log("--- Mispriced Markets ---\n");
    const body = result.responseBody as any;
    const markets = body?.markets ?? body;
    if (Array.isArray(markets)) {
      for (const m of markets) {
        console.log(`  ${m.slug}`);
        console.log(`    Question    : ${m.question}`);
        console.log(`    Q odds      : ${m.quotient_odds}`);
        console.log(`    Market odds : ${m.market_odds}`);
        console.log(`    Spread      : ${m.spread}`);
        console.log(`    BLUF        : ${m.bluf}`);
        console.log();
      }
    } else {
      console.log(JSON.stringify(body, null, 2));
    }

    if (result.paymentResponse) {
      console.log("--- Payment Settlement ---");
      console.log(`  PAYMENT-RESPONSE: ${result.paymentResponse}`);
    }
  } catch (err: any) {
    if (err.status === 403) {
      console.error("Wallet not funded. Send USDC on Base to your address.");
      console.error("Run with --create-wallet to see the address.");
    } else if (err.status === 422) {
      console.error("Validation error:", err.message);
    } else if (err.message?.includes("insufficient") || err.code === "INSUFFICIENT_BALANCE") {
      console.error("Insufficient USDC balance. Top up your wallet on Base.");
    } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      console.error("Network error — could not reach the gateway:", err.message);
    } else {
      console.error("Unexpected error:", err.message ?? err);
    }
    process.exit(1);
  }
}

main();
