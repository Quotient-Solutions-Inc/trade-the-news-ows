# Endpoint Reference

Base URL: `https://api.quotient.social`

All endpoints use GET. All require x402 payment (no API keys). Pagination uses opaque cursors.

---

## GET /api/v1/markets

Browse tracked prediction markets.

**Price**: $0.005 (5 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `search` | string | — | Full-text search on market titles |
| `sort` | string | `updated_desc` | `updated_desc`, `volume_desc`, `created_desc` |
| `limit` | number | 20 | Results per page, 1-50 |
| `cursor` | string | — | Opaque cursor from previous response |

**Response**:

```json
{
  "data": [
    {
      "slug": "trump-tariffs-april",
      "title": "Will Trump impose new tariffs in April 2025?",
      "market_probability": 0.72,
      "q_probability": 0.85,
      "volume": 1250000,
      "updated_at": "2025-04-01T12:00:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6MTIzfQ",
  "has_more": true
}
```

---

## GET /api/v1/markets/mispriced

Markets where Q's forecast diverges from market odds.

**Price**: $0.05 (50 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `min_spread` | number | 0.05 | Minimum absolute spread between Q and market |
| `sort` | string | `spread_desc` | `spread_desc`, `volume_desc`, `updated_desc` |
| `max_forecast_age` | number | 48 | Max hours since Q last updated its forecast |
| `limit` | number | 10 | Results per page, 1-50 |
| `cursor` | string | — | Opaque cursor from previous response |

**Response**:

```json
{
  "data": [
    {
      "slug": "fed-rate-cut-june",
      "title": "Will the Fed cut rates in June 2025?",
      "market_probability": 0.45,
      "q_probability": 0.62,
      "spread": 0.17,
      "volume": 890000,
      "updated_at": "2025-04-01T08:30:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6NDU2fQ",
  "has_more": false
}
```

---

## GET /api/v1/markets/lookup

Batch lookup markets by slug or condition ID. Up to 10 per call.

**Price**: $0.005 (5 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `slugs` | string | — | Comma-separated slugs (up to 10) |
| `condition_ids` | string | — | Comma-separated Polymarket condition IDs (up to 10) |

Provide `slugs` or `condition_ids`, not both.

**Response**:

```json
{
  "data": [
    {
      "slug": "trump-tariffs-april",
      "title": "Will Trump impose new tariffs in April 2025?",
      "condition_id": "0xabc123...",
      "market_probability": 0.72,
      "q_probability": 0.85,
      "spread": 0.13,
      "volume": 1250000,
      "updated_at": "2025-04-01T12:00:00Z"
    }
  ]
}
```

---

## GET /api/v1/markets/{slug}/intelligence

Full intelligence briefing for a single market.

**Price**: $0.025 (25 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `slug` | path | — | Market slug (required) |

**Response**:

```json
{
  "slug": "trump-tariffs-april",
  "title": "Will Trump impose new tariffs in April 2025?",
  "market_probability": 0.72,
  "q_probability": 0.85,
  "forecast": {
    "probability": 0.85,
    "direction": "yes",
    "confidence": "high",
    "updated_at": "2025-04-01T12:00:00Z"
  },
  "key_drivers": [
    "Trade Representative filed Section 301 petition on March 15",
    "Executive order draft circulating per Reuters sources"
  ],
  "signals": [
    {
      "title": "USTR filing confirms April timeline",
      "direction": "yes",
      "analyst": "policy_tracker",
      "created_at": "2025-03-28T14:00:00Z"
    }
  ],
  "sentiment": {
    "overall": "bullish",
    "signal_ratio": { "yes": 8, "no": 2 }
  }
}
```

---

## GET /api/v1/markets/{slug}/signals

Paginated analyst signals for a single market.

**Price**: $0.025 (25 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `slug` | path | — | Market slug (required) |
| `direction` | string | — | Filter: `yes` or `no` |
| `limit` | number | 20 | Results per page, 1-50 |
| `cursor` | string | — | Opaque cursor from previous response |

**Response**:

```json
{
  "data": [
    {
      "title": "USTR filing confirms April timeline",
      "comment": "Section 301 petition names specific product categories...",
      "direction": "yes",
      "analyst": "policy_tracker",
      "market_slug": "trump-tariffs-april",
      "created_at": "2025-03-28T14:00:00Z"
    }
  ],
  "next_cursor": "eyJpZCI6Nzg5fQ",
  "has_more": true
}
```

---

## GET /api/v1/signals

Global signal feed across all markets.

**Price**: $0.01 (10 credits)

**Parameters**:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `market` | string | — | Filter to a specific market slug |
| `direction` | string | — | Filter: `yes` or `no` |
| `limit` | number | 20 | Results per page, 1-50 |
| `cursor` | string | — | Opaque cursor from previous response |

**Response**: Same shape as `/api/v1/markets/{slug}/signals`.

---

## Payment Example: Full 402 Flow

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

// x402Fetch handles the 402 → sign → retry cycle automatically
const result = await x402Fetch(
  "https://api.quotient.social/api/v1/markets?search=tariffs&limit=5",
  "my-wallet"
);

if (result.success) {
  const markets = result.responseBody.data;
  // process markets
} else {
  // Check result.responseBody for error details
  // Common: 403 (insufficient funds), 404 (not found), 422 (bad params), 429 (rate limited)
}
```

## Pagination

All list endpoints support cursor-based pagination. If `has_more` is `true`, pass the `next_cursor` value as the `cursor` parameter in your next request.

```typescript
let cursor: string | undefined;
do {
  const url = new URL("https://api.quotient.social/api/v1/signals");
  url.searchParams.set("limit", "50");
  if (cursor) url.searchParams.set("cursor", cursor);

  const result = await x402Fetch(url.toString(), walletName);
  const { data, next_cursor, has_more } = result.responseBody;

  // process data

  cursor = has_more ? next_cursor : undefined;
} while (cursor);
```
