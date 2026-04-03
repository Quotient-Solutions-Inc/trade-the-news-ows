import TabbedExamples from "./tabbed-examples";

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

const HERO_JSON = `{
  "slug": "fed-rate-cut-june-2026",
  "question": "Will the Fed cut rates by June 2026?",
  "quotient_odds": 0.34,
  "market_odds": 0.46,
  "spread": 0.12,
  "bluf": "Persistent inflation data makes a June cut unlikely."
}`;

const BRIER_SCORES = [
  { name: "Q", score: "0.072", bold: true },
  { name: "Superforecasters (ForecastBench)", score: "0.086", bold: false },
  { name: "Polymarket odds at time of forecast", score: "0.077", bold: false },
  { name: "Best LLMs (ForecastBench)", score: "0.103", bold: false },
  { name: "Public median forecast (ForecastBench)", score: "0.123", bold: false },
  { name: "Always predict 50%", score: "0.250", bold: false },
];

const ENDPOINTS = [
  {
    endpoint: "GET /api/v1/markets/mispriced",
    cost: "$0.05",
    desc: "Markets where Q disagrees with the market",
  },
  {
    endpoint: "GET /api/v1/markets/{slug}/intelligence",
    cost: "$0.025",
    desc: "Forecast, key drivers, signals, sentiment for one market",
  },
  {
    endpoint: "GET /api/v1/markets",
    cost: "$0.005",
    desc: "Browse tracked markets with signal and forecast counts",
  },
  {
    endpoint: "GET /api/v1/signals",
    cost: "$0.01",
    desc: "Latest analyst signals across all markets",
  },
  {
    endpoint: "GET /api/v1/markets/{slug}/signals",
    cost: "$0.025",
    desc: "Paginated signals for one market",
  },
];

export default function Page() {
  return (
    <>
      <nav className="border-b border-border">
        <div className="max-w-[720px] mx-auto px-6 flex items-center justify-between h-14">
          <span className="font-brand font-semibold text-foreground">
            Quotient
          </span>
          <div className="flex items-center gap-5 text-sm text-muted">
            <a href="/skill/SKILL.md" className="hover:text-foreground transition-colors">Docs</a>
            <a href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="max-w-[720px] mx-auto px-6">

        {/* ── Hero ── */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-foreground leading-tight">
            Find what the market is missing.
          </h1>
          <p className="text-muted mt-4 text-lg max-w-[560px] leading-relaxed">
            Quotient generates independent probability forecasts for prediction
            markets, compares them to live odds, and surfaces where it disagrees.
            You get the forecast, the reasoning, and the spread.
          </p>
        </section>

        {/* ── Example response ── */}
        <section className="pb-12 md:pb-16">
          <pre className="bg-code-bg border border-border rounded-[2px] p-5 font-mono text-sm text-code-text overflow-x-auto">
            <code dangerouslySetInnerHTML={{ __html: highlightJson(HERO_JSON) }} />
          </pre>
        </section>

        {/* ── How Q works ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            How it works
          </p>
          <p className="text-foreground leading-relaxed max-w-[620px]">
            Q runs a multi-agent forecasting pipeline modeled on the methodology
            behind IARPA&apos;s superforecasting tournaments. Seven AI agents play
            distinct analytical roles — question analyst, researcher, base rate
            analyst, bull advocate, bear advocate, contrarian examiner, and
            synthesizer. They debate, challenge assumptions, and produce a
            calibrated probability estimate.
          </p>
          <p className="text-foreground leading-relaxed max-w-[620px] mt-4">
            Q has generated forecasts across 279 prediction markets, drawing
            on 1,600+ global sources. It compares its odds to live market prices
            and flags where it disagrees.
          </p>
        </section>

        {/* ── Brier score table ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-3">
            Accuracy
          </p>
          <p className="text-muted text-sm mb-8 max-w-[620px] leading-relaxed">
            Brier scores measure how close probability estimates land to what
            actually happens. Zero is perfect. 0.25 is a coin flip. Scores
            are from the Forecasting Research Institute&apos;s ForecastBench
            leaderboard.
          </p>
          <div className="border-t border-border">
            <div className="grid grid-cols-[1fr_auto] py-3 border-b border-border text-sm">
              <span className="font-medium">Forecaster</span>
              <span className="font-medium">Brier Score</span>
            </div>
            {BRIER_SCORES.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[1fr_auto] py-3 border-b border-border text-sm"
              >
                <span className={row.bold ? "font-medium text-foreground" : "text-muted"}>
                  {row.name}
                </span>
                <span className={row.bold ? "font-mono font-medium text-foreground" : "font-mono text-muted"}>
                  {row.score}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payment flow ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            Payment
          </p>
          <p className="text-foreground leading-relaxed max-w-[620px]">
            Requests are paid per-call with USDC on Base via the x402 protocol.
            Create an OWS wallet, fund it with USDC, and make requests. The
            gateway returns a 402 with a payment challenge. Your wallet signs
            it, retries the request, and gets data back.
          </p>

          <div className="mt-8 space-y-3">
            <div className="bg-code-bg border border-border rounded-[2px] p-4 font-mono text-sm text-code-text">
              <div>npm install trade-the-news-ows @open-wallet-standard/core</div>
            </div>
            <div className="bg-code-bg border border-border rounded-[2px] p-4 font-mono text-sm text-code-text">
              <div className="text-muted">{`// create a wallet`}</div>
              <div>{`import { createWallet } from "@open-wallet-standard/core";`}</div>
              <div>{`const wallet = createWallet("my-agent");`}</div>
              <div className="text-muted mt-2">{`// fund wallet.accounts[0].address with USDC on Base`}</div>
            </div>
            <div className="bg-code-bg border border-border rounded-[2px] p-4 font-mono text-sm text-code-text">
              <div className="text-muted">{`// fetch mispriced markets`}</div>
              <div>{`import { x402Fetch } from "trade-the-news-ows/x402";`}</div>
              <div className="mt-2">{`const data = await x402Fetch(`}</div>
              <div>{`  "https://api.quotient.social/api/v1/markets/mispriced",`}</div>
              <div>{`  "my-agent"`}</div>
              <div>{`);`}</div>
            </div>
          </div>

          <p className="text-sm text-muted mt-4 max-w-[620px]">
            The x402Fetch helper handles the full flow: initial request, 402
            challenge parsing, wallet signing, and retry with payment header.
          </p>
        </section>

        {/* ── Endpoints ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            Endpoints
          </p>
          <div className="border-t border-border">
            <div className="grid grid-cols-[1fr_auto] gap-4 py-3 border-b border-border text-sm">
              <span className="font-medium">Endpoint</span>
              <span className="font-medium">Cost</span>
            </div>
            {ENDPOINTS.map((row) => (
              <div
                key={row.endpoint}
                className="grid grid-cols-[1fr_auto] gap-4 py-3 border-b border-border"
              >
                <div>
                  <span className="font-mono text-sm">{row.endpoint}</span>
                  <p className="text-muted text-sm mt-0.5">{row.desc}</p>
                </div>
                <span className="font-mono text-sm text-muted whitespace-nowrap">
                  {row.cost}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Examples ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            Example responses
          </p>
          <TabbedExamples />
        </section>

        {/* ── Agent skills ── */}
        <section className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            Agent skills
          </p>
          <p className="text-foreground leading-relaxed max-w-[620px]">
            The npm package includes markdown skill files that any AI agent can
            read and follow. Point your agent at the master skill:
          </p>
          <div className="bg-code-bg border border-border rounded-[2px] p-4 font-mono text-sm text-code-text mt-4">
            Read node_modules/trade-the-news-ows/skill/SKILL.md and follow it.
          </div>
          <p className="text-muted text-sm mt-4 leading-relaxed max-w-[620px]">
            Skills included: Ask Q (structured forecasting methodology that runs
            locally in your agent), mispriced markets, signal feed, and portfolio
            monitor. Reference docs cover wallet funding, x402 payment flow,
            Polymarket trading via Bankr, and full endpoint documentation.
          </p>
        </section>

        {/* ── Get started ── */}
        <section id="get-started" className="py-12 md:py-16 border-t border-border">
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">
            Get started
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <span className="font-mono text-muted shrink-0">1.</span>
              <span>Install: <code className="font-mono text-code-text">npm install trade-the-news-ows @open-wallet-standard/core</code></span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-muted shrink-0">2.</span>
              <span>Create an OWS wallet and fund the EVM address with USDC on Base.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-muted shrink-0">3.</span>
              <span>Use <code className="font-mono text-code-text">x402Fetch</code> to make paid requests to <code className="font-mono text-code-text">api.quotient.social</code>.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-muted shrink-0">4.</span>
              <span>Or point your AI agent at <a href="/skill/SKILL.md" className="underline underline-offset-2 hover:text-foreground transition-colors">SKILL.md</a> and let it handle everything.</span>
            </div>
          </div>
          <div className="flex gap-6 mt-8 text-sm">
            <a href="/skill/SKILL.md" className="text-foreground underline underline-offset-2 hover:text-muted transition-colors">
              Full docs
            </a>
            <a href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows" className="text-foreground underline underline-offset-2 hover:text-muted transition-colors">
              GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[720px] mx-auto px-6 py-6 flex justify-between text-sm text-muted">
          <span>&copy; 2026 Quotient</span>
          <div className="flex items-center gap-3">
            <a href="https://quotient.social" className="hover:text-foreground transition-colors">quotient.social</a>
            <a href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
