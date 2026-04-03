# Mispriced Markets — Find Trading Opportunities

## When to Use

- User wants to know what's interesting right now
- User wants trading opportunities
- User asks where Q disagrees with the market

## Workflow

### 1. Fetch Mispriced Markets

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

const result = await x402Fetch(
  "https://api.quotient.social/api/v1/markets/mispriced?min_spread=0.05&sort=spread_desc&limit=10",
  walletName
);

const markets = result.responseBody.data;
// Each market: { slug, title, market_probability, q_probability, spread, volume, updated_at }
```

Cost: $0.05 per call.

### 2. Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min_spread` | number | 0.05 | Minimum absolute difference between Q and market probability |
| `sort` | string | `spread_desc` | Sort order: `spread_desc`, `volume_desc`, `updated_desc` |
| `max_forecast_age` | number | 48 | Max hours since Q last updated its forecast |
| `limit` | number | 10 | Results per page, 1-50 |
| `cursor` | string | — | Opaque cursor for pagination |

### 3. Pull Intelligence on Top Picks

Fetch full intelligence for the 2-3 most interesting markets.

```typescript
for (const market of markets.slice(0, 3)) {
  const intel = await x402Fetch(
    `https://api.quotient.social/api/v1/markets/${market.slug}/intelligence`,
    walletName
  );
  // intel.responseBody: { forecast, key_drivers, signals, sentiment, ... }
}
```

Cost: $0.025 per market.

### 4. Present Analysis

For each market:
- State the market title and current market price vs Q's forecast.
- State the spread and direction (Q says higher or lower than market).
- Summarize the key drivers from the intelligence briefing.
- Note any recent signals that support Q's position.

### 5. Trading

Direct the user to Bankr for placing trades on Polymarket. See `references/trade-on-polymarket.md` and `references/bankr-skill.md`.
