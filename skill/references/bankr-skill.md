# Bankr — Crypto Wallet Infrastructure for AI Agents

## What Bankr Is

Bankr is crypto wallet infrastructure built for AI agents. It provides wallet management, transaction execution, and DeFi integrations through an API that LLMs can call directly.

## Capabilities

- **Multi-chain wallets**: Ethereum, Base, Polygon, Arbitrum, Optimism, Solana
- **Token swaps**: DEX aggregation across chains
- **Bridging**: Cross-chain asset transfers (auto-bridge between chains)
- **Polymarket**: Place bets, view positions, redeem winnings
- **LLM gateway**: OpenAI-compatible endpoint for tool-calling agents

## Getting a Key

1. Go to [bankr.bot](https://bankr.bot)
2. Create an account and generate an API key
3. Fund your Bankr wallet with USDC

## Using the LLM Gateway

Bankr exposes an OpenAI-compatible endpoint that includes crypto tools. Point any OpenAI-compatible client at it.

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://llm.bankr.bot",
  apiKey: "your-bankr-api-key",
});

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "user", content: "Buy 20 YES shares of trump-tariffs-april on Polymarket" }
  ],
});
```

The gateway injects crypto tools (swap, bridge, polymarket_buy, polymarket_sell, balance) into the model's tool set. The model calls them; Bankr executes them.

## Polymarket Integration

### Buy shares
```
Buy 50 YES shares of "will-bitcoin-hit-100k-2025" at limit price 0.45
```

### Sell shares
```
Sell all NO shares of "fed-rate-cut-june"
```

### View positions
```
Show my Polymarket positions
```

### Redeem resolved markets
```
Redeem my winning shares
```

## Combining with Quotient

1. Use Quotient to find mispriced markets (see `skills/mispriced-markets.md`).
2. Review Q's intelligence and forecast.
3. Use Bankr to place the trade on Polymarket.
