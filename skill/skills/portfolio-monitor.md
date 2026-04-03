# Portfolio Monitor — Check Q's View on Your Positions

## When to Use

- User has Polymarket positions and wants Q's assessment
- User wants to know if any of their positions are at risk
- User provides a Polymarket address or asks to check their portfolio

## Workflow

### 1. Get the User's Address

Ask the user for their Polymarket/Ethereum address, or retrieve it from their wallet.

### 2. Fetch Positions from Polymarket

The Polymarket CLOB API is free, no auth required for public reads.

```typescript
const address = "0x..."; // user's address

// Get open positions
const response = await fetch(
  `https://clob.polymarket.com/positions?user=${address}`
);
const positions = await response.json();

// Extract market slugs/condition IDs from positions
const conditionIds = positions.map((p: any) => p.condition_id);
```

### 3. Batch Lookup via Quotient

Use the lookup endpoint to get Q's view on all positions at once (up to 10 per call).

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

// Batch lookup by condition ID ($0.005)
const ids = conditionIds.slice(0, 10).join(",");
const result = await x402Fetch(
  `https://api.quotient.social/api/v1/markets/lookup?condition_ids=${ids}`,
  walletName
);

const markets = result.responseBody.data;
// Each: { slug, title, market_probability, q_probability, spread, ... }
```

Cost: $0.005 per lookup call. If user has more than 10 positions, batch into multiple calls.

### 4. Compare Q vs Market

For each position:
- The user's side (YES or NO) and entry price
- Current market price
- Q's probability
- Whether Q agrees or disagrees with the user's position

Flag disagreements: positions where Q's forecast suggests the user is on the wrong side or where the spread is large.

### 5. Deep Dive on Flagged Positions

For positions where Q disagrees, fetch full intelligence.

```typescript
for (const market of flaggedMarkets) {
  const intel = await x402Fetch(
    `https://api.quotient.social/api/v1/markets/${market.slug}/intelligence`,
    walletName
  );
  // Present key drivers and recent signals
}
```

Cost: $0.025 per market.

### 6. Present Summary

For each position:
- Market title
- User's side and current P&L direction
- Q's probability vs market probability
- Agreement/disagreement flag
- For disagreements: key drivers from intelligence explaining why Q differs
