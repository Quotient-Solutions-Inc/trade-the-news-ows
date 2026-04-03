"use client";

import { useState } from "react";

function highlightJson(json: string): string {
  return json
    .replace(
      /("(?:\\.|[^"\\])*")(\s*:)/g,
      '<span class="syntax-key">$1</span>$2',
    )
    .replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      (match, str) =>
        match.replace(str, `<span class="syntax-string">${str}</span>`),
    )
    .replace(
      /:\s*(\d+(?:\.\d+)?)/g,
      (match, num) =>
        match.replace(num, `<span class="syntax-number">${num}</span>`),
    )
    .replace(
      /:\s*(true|false|null)/g,
      (match, val) =>
        match.replace(val, `<span class="syntax-bool">${val}</span>`),
    )
    .replace(
      /([{}[\],])/g,
      '<span class="syntax-punctuation">$1</span>',
    );
}

const MISPRICED_JSON = `{
  "markets": [
    {
      "slug": "fed-rate-cut-june-2026",
      "question": "Will the Fed cut rates by June 2026?",
      "quotient_odds": 0.34,
      "market_odds": 0.46,
      "spread": 0.12,
      "spread_direction": "q_lower",
      "bluf": "Persistent inflation data makes a June cut unlikely.",
      "signal_count": 5
    }
  ],
  "has_more": true
}`;

const SIGNALS_JSON = `{
  "signals": [
    {
      "title": "March CPI Report Shows Re-acceleration",
      "comment": "CPI re-acceleration suggests rate cuts unlikely near-term.",
      "direction": "no",
      "market_slug": "fed-rate-cut-june-2026"
    }
  ],
  "has_more": false,
  "total": 1
}`;

const tabs = [
  { label: "/markets/mispriced", json: MISPRICED_JSON },
  { label: "/signals", json: SIGNALS_JSON },
] as const;

export default function TabbedExamples() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-6 border-b border-border mb-0">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`pb-2 font-mono text-sm transition-colors border-b -mb-px ${
              active === i
                ? "border-foreground text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="bg-code-bg border border-border border-t-0 rounded-b-[2px] p-5 font-mono text-sm text-code-text overflow-x-auto">
        <code
          dangerouslySetInnerHTML={{
            __html: highlightJson(tabs[active].json),
          }}
        />
      </pre>
    </div>
  );
}
