# Ask Q — Structured Forecasting

## What This Is

A compressed version of Quotient's multi-agent forecasting pipeline. The full system uses multiple AI agents in distinct analytical roles — question analyst, researcher, base rate analyst, bull advocate, bear advocate, contrarian examiner, and synthesizer — modeled on IARPA's superforecasting research. The full pipeline achieves an 87.9% win rate across 270 resolved markets with a Brier score of 0.072. This compressed version won't match that, but it produces meaningfully better forecasts than unstructured prompting.

## When to Use

- User asks "will X happen?"
- User wants a probability estimate
- User wants structured reasoning about an uncertain outcome

## Enrichment with Quotient Data (Optional)

Before running the methodology, check if Quotient tracks a related market. Use the intelligence as an anchor.

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

// Search for a related market ($0.005)
const markets = await x402Fetch(
  "https://api.quotient.social/api/v1/markets?search=trump+tariffs",
  walletName
);

// If found, pull full intelligence as anchor ($0.025)
if (markets.success && markets.responseBody.data.length > 0) {
  const slug = markets.responseBody.data[0].slug;
  const intel = await x402Fetch(
    `https://api.quotient.social/api/v1/markets/${slug}/intelligence`,
    walletName
  );
  // Use intel.responseBody as starting anchor for your forecast
}
```

Cost: $0.005 to search, $0.025 for intelligence. Skip if no budget or question doesn't map to a tracked market.

## Methodology

Follow these 7 steps in order. Do not skip steps. Do not reorder.

### Step 1: Question Analysis

- Restate the question with explicit resolution criteria and time window.
- Define the minimum threshold for YES resolution.
- Map 2-4 distinct paths to YES and 2-4 distinct paths to NO.
- Identify 2-5 resolution pathways including at least one unconventional path most forecasters would miss.

### Step 2: Research

- Search for evidence. Every search must advance a specific argument — never search aimlessly.
- Never search for prediction market odds. They are not evidence.
- Prefer primary sources: government filings, earnings transcripts, official statements, published data.
- Reserve at least one search for disconfirming evidence against whatever direction the early evidence points.

### Step 3: Base Rate

- Identify 2-3 reference classes, moving from broad to narrow. Name specific historical examples in each class.
- Scale the base rate to the question's time window. A once-per-decade event in a 30-day window: `1 - (1 - 1/10)^(30/365) ≈ 0.8%`. Show the arithmetic.
- Weight toward the narrowest and most recent reference class.

### Step 4: Bull Case (Strongest Case for YES)

- Argue the strongest possible case for YES. No hedging. No qualifications.
- Anchor on the minimum threshold defined in Step 1. If the question is "will GDP exceed 3%?" and GDP is at 2.8%, argue why it crosses 3%, not why it reaches 5%.
- Argue trajectory, not current state. Where things are heading matters more than where they are.
- Causal specificity test: name the specific mechanism that produces YES. "Growing momentum" fails. "The Fed cuts rates in June, which historically produces a 2.1% equity rally within 30 days" passes.

### Step 5: Bear Case (Strongest Case for NO)

- Argue the strongest possible case for NO. No hedging. No qualifications.
- Name specific mechanical barriers that prevent YES, with historical precedent for each.
- Causal specificity test: same standard as Step 4. Name the specific mechanism that blocks YES.

### Step 6: Contrarian Examination

- State the current consensus view and approximate probability.
- Identify the single most fragile assumption the consensus depends on.
- Assess equilibrium stability: is the current state self-reinforcing or inherently unstable?

### Step 7: Synthesis

- Start from the base rate established in Step 3. This is your anchor.
- Every move away from the base rate requires named evidence from Steps 2, 4, or 5. No vibes-based adjustment.
- For each resolution pathway identified in Step 1, estimate its independent probability.
- Calculate: `P(YES) = 1 - product(P(each pathway fails))`.
- "X hasn't happened yet" is not an argument against it happening. Current absence does not equal permanent absence.
- Official denials are weak evidence. Weight them at 0.1x compared to structural evidence.

## Output Format

```
probability: 0.63
direction: yes
confidence: medium
bluf: [One sentence, max 30 words, stating the forecast and primary driver]
reasoning: [Prose paragraphs. No headers. No bullets. Active voice. Cite sources inline. Walk through the logic from base rate to final number.]
```

**Probability**: 0 to 1, use two decimal places (0.63, not "60-65%").

**Direction**: `yes` if probability > 0.6, `no` if probability < 0.4, `neutral` if 0.4-0.6.

**Confidence**: `low` (limited evidence, wide uncertainty), `medium` (decent evidence, some key unknowns), `high` (strong evidence, narrow uncertainty).

**BLUF**: Bottom Line Up Front. One sentence. Max 30 words. State the forecast and the single most important driver.

**Reasoning**: Prose paragraphs in active voice. No section headers within reasoning. No bullet points. Cite sources inline ("according to the BLS March jobs report..."). Walk the reader from base rate through each adjustment to the final number.

## Style Rules

- Do not use these words: pivotal, crucial, underscores, landscape.
- Do not write "we assess" or "we believe". State conclusions directly.
- Do not hedge-stack. "It seems likely that it could potentially" means nothing. Pick a position.
- Every factual claim needs a named source or cut it.
