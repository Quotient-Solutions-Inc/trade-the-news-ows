# trade-the-news-ows

Prediction market intelligence via x402 micropayments. No API keys. No accounts. Just an OWS wallet and USDC.

Includes Ask Q, a compressed version of Quotient's multi-agent forecasting methodology (87.9% win rate, 0.072 Brier score) that guides any AI model through structured probabilistic forecasting.

## Install

```
npm install trade-the-news-ows @open-wallet-standard/core
```

## 60-second quickstart

### 1. Create a wallet

```typescript
import { createWallet } from "@open-wallet-standard/core";
const wallet = createWallet("my-agent");
console.log(wallet.accounts[0].address); // Your Base address
```

### 2. Fund it

Send USDC to that address on Base (eip155:8453). $5 covers dozens of calls.

### 3. Get mispriced markets

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

const data = await x402Fetch(
  "https://api.quotient.social/api/v1/markets/mispriced?limit=5",
  "my-agent"
);
console.log(data.responseBody);
```

### 4. Point your agent at the skills

Tell your agent:

```
Read node_modules/trade-the-news-ows/skill/SKILL.md and follow it.
```

Or if the site is live:

```
Read https://trade-the-news-ows.vercel.app/skill/SKILL.md and follow it.
```

## What's included

| What | Import / Path | Description |
|------|---------------|-------------|
| x402 client | `trade-the-news-ows/x402` | OWS wallet payment client. Handles 402 → sign → retry. |
| Ask Q | `skill/skills/ask-q.md` | Compressed forecasting methodology from Q's pipeline |
| Mispriced markets | `skill/skills/mispriced-markets.md` | Find trading opportunities |
| Signal feed | `skill/skills/signal-feed.md` | Monitor prediction market news |
| Portfolio monitor | `skill/skills/portfolio-monitor.md` | Track your Polymarket positions |
| Fund wallet guide | `skill/references/fund-your-wallet.md` | How to get USDC into your OWS wallet |
| Polymarket trading | `skill/references/trade-on-polymarket.md` | Execute trades via Bankr |
| Bankr reference | `skill/references/bankr-skill.md` | Bankr agent capabilities |
| x402 reference | `skill/references/x402-payment-flow.md` | Technical payment flow details |
| Endpoint reference | `skill/references/endpoints.md` | Full API docs with pricing |

## Endpoints and pricing

All paid via x402. No API keys.

| Endpoint | Cost | What you get |
|----------|------|--------------|
| GET /api/v1/markets | $0.005 | Browse tracked markets |
| GET /api/v1/markets/mispriced | $0.05 | Where Q disagrees with the market |
| GET /api/v1/markets/{slug}/intelligence | $0.025 | Full briefing on one market |
| GET /api/v1/markets/{slug}/signals | $0.025 | Analyst signals for one market |
| GET /api/v1/signals | $0.01 | Global signal feed |
| GET /api/v1/markets/lookup | $0.005 | Batch lookup, up to 10 markets |

## About Q's forecasting engine

Q's full pipeline uses multiple AI agents in distinct analytical roles modeled on IARPA's superforecasting research (the same program behind Tetlock's Good Judgment work). The Ask Q skill in this package is a compressed version of that methodology that guides any model through the same structured analytical process. The system improves with every resolved market.

- Win rate: 87.9% across 270 markets
- Brier Score: 0.072 (2x frontier AI models on PredictionArena)

## For Claude Code / AI agents

Point your agent at the master skill:

```
Read the file at node_modules/trade-the-news-ows/skill/SKILL.md and follow it.
```

Or if the site is live:

```
Read https://trade-the-news-ows.vercel.app/skill/SKILL.md and follow it.
```

## Environment variables

```
QUOTIENT_GATEWAY_URL=https://api.quotient.social  # default, optional
OWS_WALLET_NAME=my-agent                           # wallet name
OWS_VAULT_PATH=./.ows-vault                        # optional, defaults to ~/.ows
```

## Architecture

```
This repo (skills + x402 client + landing page)
    → Quotient Gateway at api.quotient.social (x402 payment verification)
    → Quotient API (intelligence queries)
    → Neo4j (600+ markets, forecasts, signals from 1,600+ sources)
```

The Ask Q skill runs locally in your agent. Quotient data is optional paid enrichment.
Gateway and API are deployed separately. This repo is the agent-facing interface.

## Run the landing page locally

```
npm run dev
```

## Run the demo

```bash
npx tsx scripts/demo-mispriced.ts --create-wallet
# Fund the printed Base address with USDC
npx tsx scripts/demo-mispriced.ts
```
