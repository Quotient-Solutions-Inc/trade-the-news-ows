# Signal Feed — Market-Impact News Briefing

## When to Use

- User wants a news briefing filtered through market impact
- User asks what's moving in prediction markets
- User wants to see recent analyst signals

## Workflow

### 1. Fetch Signals

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

const result = await x402Fetch(
  "https://api.quotient.social/api/v1/signals?limit=20",
  walletName
);

const signals = result.responseBody.data;
// Each signal: { title, comment, direction, market_slug, market_title, analyst, created_at }
```

Cost: $0.01 per call.

### 2. Filters

| Parameter | Type | Description |
|-----------|------|-------------|
| `market` | string | Filter to a specific market slug |
| `direction` | string | `yes` or `no` — filter by signal direction |
| `limit` | number | Results per page, 1-50 |
| `cursor` | string | Opaque cursor for pagination |

Filter by market:
```typescript
const result = await x402Fetch(
  "https://api.quotient.social/api/v1/signals?market=trump-tariffs-april&direction=yes",
  walletName
);
```

### 3. Group and Analyze

Group signals by `market_slug`. For markets with multiple recent signals or conflicting directions, consider pulling full intelligence.

```typescript
// Group signals by market
const byMarket = new Map<string, typeof signals>();
for (const signal of signals) {
  const group = byMarket.get(signal.market_slug) ?? [];
  group.push(signal);
  byMarket.set(signal.market_slug, group);
}

// Pull intelligence for markets with high activity ($0.025 each)
for (const [slug, marketSignals] of byMarket) {
  if (marketSignals.length >= 3) {
    const intel = await x402Fetch(
      `https://api.quotient.social/api/v1/markets/${slug}/intelligence`,
      walletName
    );
  }
}
```

### 4. Present as Briefing

For each market group:
- Market title
- Number and direction of recent signals
- Key signal titles and analyst comments
- If intelligence was fetched: Q's current forecast and key drivers
- Whether signals align with or contradict Q's overall forecast
