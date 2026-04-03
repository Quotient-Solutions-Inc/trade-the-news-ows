import TabbedExamples from "./tabbed-examples";

/* -------------------------------------------------------------------------- */
/*  Syntax-highlighting helper                                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Shared layout primitives                                                   */
/* -------------------------------------------------------------------------- */

function Section({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 max-w-[850px] mx-auto px-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs text-muted uppercase tracking-widest">
      {children}
    </span>
  );
}

function CodeBlock({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-sm text-code-text bg-code-bg p-3 rounded-[4px] mt-3 overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const HERO_JSON = `{
  "slug": "iran-nuclear-deal-2026",
  "quotient_odds": 0.21,
  "market_odds": 0.30,
  "spread": 0.09,
  "bluf": "Channels narrowed post-IAEA."
}`;

const ARCH_DIAGRAM = `Your Agent
    \u251C\u2500\u2500 Ask Q skill (runs locally, your LLM)
    \u251C\u2500\u2500 x402 payment (OWS wallet, USDC on Base)
    \u2502   \u2193
    \u2502   Quotient Gateway (api.quotient.social)
    \u2502       \u2193
    \u2502   Quotient API
    \u2502       \u2193
    \u2502   Neo4j (600+ markets, forecasts, signals)
    \u2514\u2500\u2500 Polymarket (positions, trading via Bankr)`;

const CAPABILITIES = [
  {
    skill: "Ask Q",
    endpoint: "Runs in your agent",
    cost: "Your LLM cost",
    desc: "Compressed forecasting methodology from Q\u2019s pipeline",
  },
  {
    skill: "Browse markets",
    endpoint: "GET /api/v1/markets",
    cost: "$0.005",
    desc: "Market catalog with signal/forecast counts",
  },
  {
    skill: "Find mispriced",
    endpoint: "GET /api/v1/markets/mispriced",
    cost: "$0.05",
    desc: "Where Q disagrees with the market",
  },
  {
    skill: "Deep dive",
    endpoint: "GET /api/v1/markets/{slug}/intelligence",
    cost: "$0.025",
    desc: "Forecast, key drivers, signals, sentiment",
  },
  {
    skill: "Signal feed",
    endpoint: "GET /api/v1/signals",
    cost: "$0.01",
    desc: "Latest analyst signals across all markets",
  },
  {
    skill: "Market signals",
    endpoint: "GET /api/v1/markets/{slug}/signals",
    cost: "$0.025",
    desc: "Paginated signals for one market",
  },
  {
    skill: "Batch lookup",
    endpoint: "GET /api/v1/markets/lookup",
    cost: "$0.005",
    desc: "Intelligence for up to 10 markets",
  },
  {
    skill: "Portfolio monitor",
    endpoint: "Polymarket API + Quotient",
    cost: "$0.005+",
    desc: "Q\u2019s view on your active positions",
  },
];

const STEPS: readonly {
  num: string;
  title: string;
  code?: string;
  lines?: readonly { text: string; color: string }[];
  caption: string;
}[] = [
  {
    num: "01",
    title: "Install",
    code: "npm install trade-the-news-ows @open-wallet-standard/core",
    caption: "x402 payment client and agent skills in one package.",
  },
  {
    num: "02",
    title: "Create an OWS wallet",
    code: 'const wallet = createWallet("my-agent")',
    caption: "Multi-chain wallet. Your Base address receives USDC.",
  },
  {
    num: "03",
    title: "Fund with USDC on Base",
    code: "\u2192 Send USDC to 0xAbc...123 on Base (eip155:8453)",
    caption:
      "From Coinbase, MetaMask, or any wallet. $5 covers dozens of calls.",
  },
  {
    num: "04",
    title: "Request intelligence",
    lines: [
      { text: "GET api.quotient.social/api/v1/markets/mispriced", color: "" },
      { text: "\u2190 402 Payment Required", color: "text-negative" },
    ],
    caption: "No key provided. Gateway returns a payment challenge.",
  },
  {
    num: "05",
    title: "Sign and pay",
    lines: [
      { text: 'signTypedData("my-agent", "evm", challenge)', color: "" },
      { text: "\u2192 Retry with PAYMENT-SIGNATURE header", color: "" },
    ],
    caption:
      "OWS wallet signs the x402 challenge. $0.05 in USDC. Settled on Base.",
  },
  {
    num: "06",
    title: "Get the data",
    lines: [{ text: "\u2190 200 OK", color: "text-positive" }],
    caption: "Intelligence delivered. No account. No key. No subscription.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page (server component)                                                    */
/* -------------------------------------------------------------------------- */

export default function Page() {
  return (
    <>
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
        <div className="max-w-[850px] mx-auto px-6 flex items-center justify-between h-14">
          <span className="font-brand font-semibold text-lg text-foreground">
            Quotient
          </span>
          <div className="flex items-center gap-5">
            <a
              href="/skill/SKILL.md"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="border border-border text-accent text-xs px-3 py-1 rounded-full">
              OWS Hackathon 2026
            </span>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ────────────────────────────────────────────────── */}
        <Section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent border border-accent/30 text-xs inline-block px-3 py-1 rounded-full mb-4">
                Pay-Per-Call API &middot; OWS Hackathon 2026
              </span>
              <h1 className="font-headline text-5xl text-foreground mb-4">
                Trade the news.
              </h1>
              <p className="text-muted text-lg max-w-[500px] mb-8">
                Plain news is noise. Prediction markets are signal. The real
                edge is knowing where the market is wrong, and why.
              </p>
              <a
                href="#get-started"
                className="inline-block border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground px-6 py-2.5 text-sm font-medium rounded-[4px] transition-colors"
              >
                Get started
              </a>
            </div>

            <div className="hidden md:block">
              <pre className="bg-code-bg border border-border rounded-[4px] p-5 font-mono text-sm text-code-text overflow-x-auto">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(HERO_JSON),
                  }}
                />
              </pre>
            </div>
          </div>
        </Section>

        {/* ── The Engine ──────────────────────────────────────────── */}
        <Section>
          <SectionLabel>THE ENGINE</SectionLabel>
          <h2 className="font-headline text-4xl text-foreground mt-3 mb-4">
            Multi-agent forecasting, modeled on IARPA&apos;s superforecasters.
          </h2>
          <p className="text-base text-foreground max-w-[650px] mb-10">
            Q&apos;s forecasting pipeline uses multiple AI agents in distinct
            analytical roles: question analyst, researcher, base rate analyst,
            bull advocate, bear advocate, contrarian examiner, synthesizer. Each
            agent debates, challenges assumptions, and contributes to a final
            calibrated probability. The methodology is modeled on IARPA&apos;s
            superforecasting research, the same program behind Tetlock&apos;s
            Good Judgment work. The system improves with every resolved market.
          </p>
          <div className="flex flex-wrap gap-8 items-baseline">
            <div>
              <span className="font-mono text-2xl text-foreground font-medium">
                87.9%
              </span>
              <span className="text-sm text-muted ml-2">
                win rate across 270 markets
              </span>
            </div>
            <span className="hidden sm:inline text-border">|</span>
            <div>
              <span className="font-mono text-2xl text-foreground font-medium">
                0.072
              </span>
              <span className="text-sm text-muted ml-2">
                Brier score (2x frontier AI on PredictionArena)
              </span>
            </div>
            <span className="hidden sm:inline text-border">|</span>
            <div>
              <span className="font-mono text-2xl text-foreground font-medium">
                600+
              </span>
              <span className="text-sm text-muted ml-2">markets tracked</span>
            </div>
          </div>
        </Section>

        {/* ── Value Stack ─────────────────────────────────────────── */}
        <Section>
          <SectionLabel>WHY THIS MATTERS</SectionLabel>
          <div className="grid md:grid-cols-3 gap-px bg-border mt-6 rounded-[4px] overflow-hidden">
            <div className="bg-background p-6">
              <span className="font-mono text-xs text-muted">NEWS</span>
              <p className="text-sm mt-2">
                1,600+ sources. Geopolitics, macro, regulation. Raw signal,
                filtered for what moves markets.
              </p>
            </div>
            <div className="bg-background p-6">
              <span className="font-mono text-xs text-accent">FORECASTS</span>
              <p className="text-sm mt-2">
                AI-generated probability estimates calibrated against resolved
                outcomes. Not vibes. Math.
              </p>
            </div>
            <div className="bg-background p-6">
              <span className="font-mono text-xs text-muted">EDGE</span>
              <p className="text-sm mt-2">
                Where our forecasts diverge from market odds. The spread is the
                opportunity.
              </p>
            </div>
          </div>
        </Section>

        {/* ── How It Works ────────────────────────────────────────── */}
        <Section>
          <SectionLabel>THE FLOW</SectionLabel>
          <h2 className="font-headline text-4xl text-foreground mt-3 mb-2">
            No API keys. No accounts.
          </h2>
          <p className="text-muted mb-8">
            Just a wallet and an HTTP request.
          </p>
          <div className="flex flex-col gap-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="border border-border rounded-[4px] p-6"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-accent text-background text-sm font-mono flex items-center justify-center shrink-0">
                    {step.num}
                  </span>
                  <span className="font-medium ml-3">{step.title}</span>
                </div>
                {step.code && <CodeBlock>{step.code}</CodeBlock>}
                {step.lines && (
                  <CodeBlock>
                    {step.lines.map((line, i) => (
                      <div key={i} className={line.color || ""}>
                        {line.text}
                      </div>
                    ))}
                  </CodeBlock>
                )}
                <p className="text-sm text-muted mt-2">{step.caption}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Capabilities ────────────────────────────────────────── */}
        <Section>
          <SectionLabel>CAPABILITIES</SectionLabel>
          <h2 className="font-headline text-4xl text-foreground mt-3 mb-8">
            Five skills. One wallet.
          </h2>
          <div className="border border-border rounded-[4px] overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface">
                <tr className="text-xs text-muted uppercase tracking-wider font-mono">
                  <th className="px-4 py-3 font-medium">Skill</th>
                  <th className="px-4 py-3 font-medium">Endpoint</th>
                  <th className="px-4 py-3 font-medium">Cost</th>
                  <th className="px-4 py-3 font-medium">What you get</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {CAPABILITIES.map((cap, i) => (
                  <tr
                    key={cap.skill}
                    className={i !== 0 ? "border-t border-border" : ""}
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {cap.skill}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">
                      {cap.endpoint}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {cap.cost}
                    </td>
                    <td className="px-4 py-3 text-muted">{cap.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Examples ────────────────────────────────────────────── */}
        <Section>
          <SectionLabel>EXAMPLES</SectionLabel>
          <div className="mt-6">
            <TabbedExamples />
          </div>
        </Section>

        {/* ── Architecture ────────────────────────────────────────── */}
        <Section>
          <SectionLabel>ARCHITECTURE</SectionLabel>
          <h2 className="font-headline text-4xl text-foreground mt-3 mb-8">
            What&apos;s behind this.
          </h2>
          <div className="border border-border rounded-[4px] p-6 bg-code-bg font-mono text-sm text-code-text overflow-x-auto whitespace-pre">
            {ARCH_DIAGRAM}
          </div>
          <p className="text-sm text-muted max-w-[650px] mt-6">
            The Ask Q skill runs in your agent&apos;s process using whatever
            model you already have. Quotient data endpoints are optional paid
            enrichment via x402 micropayments through the gateway. The gateway
            handles payment verification and proxies to the API, which queries a
            Neo4j graph of 600+ markets, AI-generated forecasts, and analyst
            signals sourced from 1,600+ publications. For trading, Bankr handles
            Polymarket execution. No part of this requires an account or API
            key. The wallet is the identity.
          </p>
        </Section>

        {/* ── Get Started ─────────────────────────────────────────── */}
        <Section id="get-started">
          <SectionLabel>GET STARTED</SectionLabel>
          <h2 className="font-headline text-4xl text-foreground mt-3 mb-2">
            One install. One wallet. Go.
          </h2>

          <div className="mt-8">
            <pre className="bg-code-bg border border-border rounded-[4px] p-4 font-mono text-sm text-code-text overflow-x-auto">
              npm install trade-the-news-ows @open-wallet-standard/core
            </pre>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <div className="border border-border rounded-[4px] p-6">
              <h3 className="font-medium mb-3">
                <span className="font-mono text-muted text-sm mr-2">1.</span>
                Create wallet and fund
              </h3>
              <pre className="bg-code-bg rounded-[4px] p-4 font-mono text-sm text-code-text overflow-x-auto">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(
`import { createWallet } from "@open-wallet-standard/core";
const wallet = createWallet("my-agent");
// Send USDC to wallet.accounts[0].address on Base`,
                    ),
                  }}
                />
              </pre>
            </div>

            <div className="border border-border rounded-[4px] p-6">
              <h3 className="font-medium mb-3">
                <span className="font-mono text-muted text-sm mr-2">2.</span>
                Fetch intelligence
              </h3>
              <pre className="bg-code-bg rounded-[4px] p-4 font-mono text-sm text-code-text overflow-x-auto">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(
`import { x402Fetch } from "trade-the-news-ows/x402";
const data = await x402Fetch(
  "https://api.quotient.social/api/v1/markets/mispriced",
  "my-agent"
);`,
                    ),
                  }}
                />
              </pre>
            </div>

            <div className="border border-border rounded-[4px] p-6">
              <h3 className="font-medium mb-3">
                <span className="font-mono text-muted text-sm mr-2">3.</span>
                Point your agent at the skill
              </h3>
              <pre className="bg-code-bg rounded-[4px] p-4 font-mono text-sm text-code-text overflow-x-auto">
                Read node_modules/trade-the-news-ows/skill/SKILL.md and follow
                it.
              </pre>
            </div>
          </div>

          <div className="flex gap-6 mt-8">
            <a
              href="/skill/SKILL.md"
              className="text-sm text-foreground hover:text-accent transition-colors"
            >
              Full skill docs &rarr;
            </a>
            <a
              href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows"
              className="text-sm text-foreground hover:text-accent transition-colors"
            >
              GitHub &rarr;
            </a>
          </div>
        </Section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-[850px] mx-auto px-6 py-6 flex flex-wrap justify-between items-center gap-4 text-sm text-muted">
          <span>&copy; 2026 Quotient</span>
          <div className="flex flex-wrap items-center gap-1">
            <a
              href="https://quotient.social"
              className="hover:text-foreground transition-colors"
            >
              quotient.social
            </a>
            <span>&middot;</span>
            <a
              href="https://github.com/Quotient-Solutions-Inc/trade-the-news-ows"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span>&middot;</span>
            <a
              href="https://openwallet.foundation"
              className="hover:text-foreground transition-colors"
            >
              OWS
            </a>
            <span>&middot;</span>
            <a
              href="https://www.x402.org"
              className="hover:text-foreground transition-colors"
            >
              x402 docs
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
