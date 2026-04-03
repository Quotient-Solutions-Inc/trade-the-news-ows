# Fund Your Wallet

## Steps

1. **Create an OWS wallet.** Use `@open-wallet-standard/core` or any OWS-compatible wallet provider.

2. **Note your EVM address.** The wallet's EVM address is where you send USDC. It starts with `0x`.

3. **Send USDC on Base.** Transfer USDC to your wallet address on Base (chain ID 8453, `eip155:8453`). USDC contract on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`.

4. **If your USDC is on another chain** (Ethereum, Arbitrum, Polygon, etc.), bridge it to Base first. Options:
   - [Base Bridge](https://bridge.base.org)
   - [Across Protocol](https://across.to)
   - Bankr's auto-bridging (see `bankr-skill.md`)

5. **Verify on BaseScan.** Check your balance at `https://basescan.org/address/<your-address>`. Look for the USDC token balance.

## How Much

- $5-10 covers dozens of API calls.
- Most calls cost $0.005-$0.05. See the endpoint table in `SKILL.md`.
- Credit cost formula: `Math.round(x402Amount * 1000)`.

## Notes

- Only USDC on Base is supported. Other tokens or chains will not work for x402 payments.
- The wallet must have enough USDC to cover the request cost at the time of signing.
- If you get a 403 error, your wallet balance is insufficient. Top up and retry.
