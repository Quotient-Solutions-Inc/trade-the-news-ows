# Trade on Polymarket

## How Polymarket Pricing Works

- Markets have YES and NO shares.
- Prices range from $0.01 to $0.99. A YES share at $0.35 means the market implies a 35% probability.
- If you buy YES at $0.35 and the event happens, you receive $1.00 per share. Profit: $0.65 per share.
- If the event does not happen, your shares are worth $0.00.
- YES price + NO price = $1.00. Buying NO at $0.65 is the inverse of buying YES at $0.35.

## Placing Bets via Bankr

Bankr provides AI-agent-compatible Polymarket trading. See `bankr-skill.md` for setup.

```
Buy 10 YES shares of "trump-tariffs-april" at market price
```

Bankr handles order routing, USDC approval, and settlement on Polygon.

## Viewing Positions

Query the Polymarket CLOB API (free, no auth):

```typescript
const positions = await fetch(
  `https://clob.polymarket.com/positions?user=${address}`
).then(r => r.json());
```

## Redeeming Winning Positions

After a market resolves, redeem winning shares for $1.00 each through Bankr or the Polymarket UI. Losing shares expire worthless.

## Auto-Bridging

Bankr can auto-bridge USDC from Base to Polygon for Polymarket trades. You do not need to manually bridge.

## Risk Warnings

- Prediction markets are speculative. You can lose your entire position.
- Market prices can move against you before resolution.
- Liquidity varies. Large orders may experience slippage.
- Resolution criteria are defined by the market creator. Read them before trading.
- Q's forecasts are probabilistic assessments, not guarantees. An 87.9% win rate means 12.1% of forecasts are wrong.
