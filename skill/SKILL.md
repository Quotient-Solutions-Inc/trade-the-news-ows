# Quotient — Prediction Market Intelligence

## What is Quotient

Quotient forecasts prediction markets using multiple AI agents in distinct analytical roles — question analyst, researcher, base rate analyst, bull advocate, bear advocate, contrarian examiner, and synthesizer — modeled on IARPA's superforecasting research. 87.9% win rate across 270 resolved markets, Brier score 0.072, 2x frontier AI models on PredictionArena. All intelligence is served from `api.quotient.social` and paid per-request via x402 micropayments.

## Install

```bash
npm install trade-the-news-ows @open-wallet-standard/core
```

## How Payment Works

No API keys. No accounts. No subscriptions.

1. Create an OWS wallet.
2. Fund it with USDC on Base (`eip155:8453`).
3. Make requests to `api.quotient.social`. The gateway returns HTTP `402` with a `PAYMENT-REQUIRED` header containing a typed-data challenge.
4. Sign the challenge with your OWS wallet via `signTypedData`.
5. Retry the request with the signed payload in the `PAYMENT-SIGNATURE` header.
6. The response arrives with a `PAYMENT-RESPONSE` header confirming settlement.

The `x402Fetch` helper handles steps 3-6 automatically:

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

const result = await x402Fetch(
  "https://api.quotient.social/api/v1/markets",
  "your-wallet-name"
);
```

## Available Skills

| Skill | File | Description |
|-------|------|-------------|
| Ask Q | `skills/ask-q.md` | Structured forecasting methodology — compressed version of Q's multi-agent pipeline |
| Mispriced Markets | `skills/mispriced-markets.md` | Find markets where Q disagrees with market odds |
| Signal Feed | `skills/signal-feed.md` | Monitor analyst signals across prediction markets |
| Portfolio Monitor | `skills/portfolio-monitor.md` | Check Q's view on your active Polymarket positions |

## Endpoint Reference

| Endpoint | Method | x402 Price | Credit Cost | Description |
|----------|--------|-----------|-------------|-------------|
| `/api/v1/markets` | GET | $0.005 | 5 | Browse tracked markets |
| `/api/v1/markets/mispriced` | GET | $0.05 | 50 | Markets where Q diverges from market odds |
| `/api/v1/markets/lookup` | GET | $0.005 | 5 | Batch lookup by slug or condition ID (up to 10) |
| `/api/v1/markets/{slug}/intelligence` | GET | $0.025 | 25 | Full briefing: forecast, key drivers, signals, sentiment |
| `/api/v1/markets/{slug}/signals` | GET | $0.025 | 25 | Paginated analyst signals for one market |
| `/api/v1/signals` | GET | $0.01 | 10 | Global signal feed across all markets |

Credit cost formula: `Math.round(x402Amount * 1000)`

## Funding

Send USDC to your OWS wallet's EVM address on Base (chain ID 8453). $5 covers dozens of calls. See `references/fund-your-wallet.md` for step-by-step instructions.

## Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 402 | Payment required | Sign the challenge and retry (x402Fetch handles this) |
| 403 | Insufficient USDC | Fund your wallet with more USDC on Base |
| 404 | Market not found | Check the slug or condition ID |
| 422 | Invalid parameters | Check query params and cursor values |
| 429 | Rate limited | Wait for the duration in `retry_after` before retrying |
