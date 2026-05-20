import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';

// One reveal at a time. Stages 0..3 are two-column (text left, graph
// panel right). Stage 4 (final) is text-only, full width — that's the
// punchline question, so we want it to breathe.
type Conclusion = {
  key: string;
  text: ReactNode;
  hasGraph: boolean;
  /** Optional short caption shown inside the graph placeholder panel. */
  graphCaption?: string;
  /** Optional rendered chart that replaces the TBD placeholder. */
  chart?: ReactNode;
};

const COLOR_GREEN = '#7ee787';
const COLOR_ORANGE = '#f0883e';
const COLOR_DIM = 'rgba(226, 232, 240, 0.55)';
const COLOR_AXIS = 'rgba(226, 232, 240, 0.5)';
const COLOR_GRID = 'rgba(226, 232, 240, 0.08)';

/**
 * Two side-by-side line charts across percentiles (p50/p80/p90/p95), each
 * with its own Y-axis. Left: time-to-first-review on a log scale (the
 * distribution spans 0.16h → 124h, two-plus decades). Right: time-to-merge
 * on a linear scale (5h → 210h fits comfortably). Numbers from the MR
 * cohort with/without agent_hacker_mango comments.
 */
export function TimeShiftChart() {
  const X_TICKS = ['p50', 'p80', 'p90', 'p95'];

  // p50, p80, p90, p95 — hours
  const FIRST_REVIEW = {
    noAgent:   [1.43, 21.24, 68.71, 123.62],
    withAgent: [0.16,  0.37,  0.56,   2.04],
  };
  const MERGE = {
    noAgent:   [5.03, 56.57, 123.76, 198.28],
    withAgent: [9.73, 69.84, 138.97, 209.99],
  };

  const PLOT_TOP = 55;
  const PLOT_BOTTOM = 350;
  const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

  // Both panels share a log Y scale from 0.1h (≈6m, the visual "near-zero"
  // baseline log can give us) up to 256h (≈10d). Each panel still renders
  // its own Y-axis labels alongside its plot, so the two charts read as
  // independent.
  const LOG_MIN = Math.log10(0.1);
  const LOG_MAX = Math.log10(256);
  const LOG_SPAN = LOG_MAX - LOG_MIN;
  const yLog = (v: number) =>
    PLOT_BOTTOM - ((Math.log10(v) - LOG_MIN) / LOG_SPAN) * PLOT_H;
  const Y_TICKS = [0.1, 1, 10, 100];

  // Pick the most natural unit per Y-axis tick:
  //   < 1h → minutes,  1h–23h → hours,  ≥ 24h → days.
  const hourLabel = (h: number): string => {
    if (h < 1) return `${Math.round(h * 60)}m`;
    if (h < 24) return `${h}h`;
    return `~${Math.round(h / 24)}d`;
  };

  // Each panel has its own plot area; Y labels sit immediately to its left.
  const PANEL_LEFT  = { x0:  60, x1: 370, axisX: 50 };
  const PANEL_RIGHT = { x0: 460, x1: 770, axisX: 450 };

  const xOf = (panel: { x0: number; x1: number }, i: number) =>
    panel.x0 + (i / (X_TICKS.length - 1)) * (panel.x1 - panel.x0);

  const Line = ({
    panel, values, color, yMap,
  }: {
    panel: { x0: number; x1: number };
    values: number[];
    color: string;
    yMap: (v: number) => number;
  }) => {
    const d = values
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xOf(panel, i)} ${yMap(v)}`)
      .join(' ');
    return (
      <g>
        <path d={d} stroke={color} strokeWidth={2.5} fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle key={i} cx={xOf(panel, i)} cy={yMap(v)} r={4} fill={color} />
        ))}
      </g>
    );
  };

  const Legend = ({
    x, y, agentColor,
  }: { x: number; y: number; agentColor: string }) => (
    <g fontFamily="var(--font-mono)" fontSize="12">
      <circle cx={x} cy={y} r={4} fill={COLOR_DIM} />
      <text x={x + 10} y={y + 4} fill={COLOR_DIM} textAnchor="start">без агента</text>
      <circle cx={x} cy={y + 18} r={4} fill={agentColor} />
      <text x={x + 10} y={y + 22} fill={agentColor} textAnchor="start">з агентом</text>
    </g>
  );

  return (
    <svg
      viewBox="0 0 800 410"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Time to first review collapses with the agent across all percentiles; time to merge stays close, slightly higher with the agent."
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* === Left panel: time to first review (log Y) === */}
      <text x={(PANEL_LEFT.x0 + PANEL_LEFT.x1) / 2} y={28} fontSize="16"
            fontFamily="var(--font-mono)" fill={COLOR_GREEN}
            textAnchor="middle" fontWeight="600">
        час до першого рев'ю
      </text>

      {Y_TICKS.map((v) => (
        <g key={v}>
          <line x1={PANEL_LEFT.x0} x2={PANEL_LEFT.x1}
                y1={yLog(v)} y2={yLog(v)}
                stroke={COLOR_GRID} strokeDasharray="2 6" />
          <text x={PANEL_LEFT.axisX} y={yLog(v) + 4} fontSize="11"
                fontFamily="var(--font-mono)" fill={COLOR_AXIS} textAnchor="end">
            {hourLabel(v)}
          </text>
        </g>
      ))}

      <Line panel={PANEL_LEFT} values={FIRST_REVIEW.noAgent}
            color={COLOR_DIM}   yMap={yLog} />
      <Line panel={PANEL_LEFT} values={FIRST_REVIEW.withAgent}
            color={COLOR_GREEN} yMap={yLog} />
      <Legend x={PANEL_LEFT.x0 + 8} y={PLOT_TOP + 4} agentColor={COLOR_GREEN} />

      {X_TICKS.map((tick, i) => (
        <text key={tick} x={xOf(PANEL_LEFT, i)} y={PLOT_BOTTOM + 22}
              fontSize="12" fontFamily="var(--font-mono)"
              fill={COLOR_AXIS} textAnchor="middle">
          {tick}
        </text>
      ))}

      {/* === Right panel: time to merge (linear Y) === */}
      <text x={(PANEL_RIGHT.x0 + PANEL_RIGHT.x1) / 2} y={28} fontSize="16"
            fontFamily="var(--font-mono)" fill={COLOR_ORANGE}
            textAnchor="middle" fontWeight="600">
        час до мержу
      </text>

      {Y_TICKS.map((v) => (
        <g key={v}>
          <line x1={PANEL_RIGHT.x0} x2={PANEL_RIGHT.x1}
                y1={yLog(v)} y2={yLog(v)}
                stroke={COLOR_GRID} strokeDasharray="2 6" />
          <text x={PANEL_RIGHT.axisX} y={yLog(v) + 4} fontSize="11"
                fontFamily="var(--font-mono)" fill={COLOR_AXIS} textAnchor="end">
            {hourLabel(v)}
          </text>
        </g>
      ))}

      <Line panel={PANEL_RIGHT} values={MERGE.noAgent}
            color={COLOR_DIM}    yMap={yLog} />
      <Line panel={PANEL_RIGHT} values={MERGE.withAgent}
            color={COLOR_ORANGE} yMap={yLog} />
      <Legend x={PANEL_RIGHT.x0 + 8} y={PLOT_TOP + 4} agentColor={COLOR_ORANGE} />

      {X_TICKS.map((tick, i) => (
        <text key={tick} x={xOf(PANEL_RIGHT, i)} y={PLOT_BOTTOM + 22}
              fontSize="12" fontFamily="var(--font-mono)"
              fill={COLOR_AXIS} textAnchor="middle">
          {tick}
        </text>
      ))}
    </svg>
  );
}

/**
 * Sentiment-distribution infographic for an internal satisfaction poll on the
 * code-review agent. Big positive / neutral / negative percentages sit above
 * a single segmented bar; bar segment widths match each Likert bucket's
 * share. Counts overlay roomy segments; slivers get a leader line + label
 * below the bar.
 */
function SatisfactionChart() {
  // Spectrum from very-satisfied → very-dissatisfied. Bright accents bracket
  // the extremes; muted greens/oranges fill the inner satisfied/dissat
  // tiers; dim white for neutral.
  const SAT_BRIGHT  = '#7ee787';
  const SAT_MID     = '#56c267';
  const NEUTRAL_MID = 'rgba(226, 232, 240, 0.45)';
  const DISSAT_MID  = '#c47233';
  const DISSAT_BRT  = '#f0883e';

  const SEGMENTS = [
    { count:  86, pct: 27, color: SAT_BRIGHT  },
    { count: 153, pct: 48, color: SAT_MID     },
    { count:  64, pct: 20, color: NEUTRAL_MID },
    { count:  14, pct:  4, color: DISSAT_MID  },
    { count:   3, pct:  1, color: DISSAT_BRT  },
  ];

  const BAR_X0 = 40;
  const BAR_X1 = 760;
  const BAR_W  = BAR_X1 - BAR_X0;
  const BAR_Y  = 200;
  const BAR_H  = 56;

  // Pre-compute each segment's geometry so we can render fills, in-bar
  // counts, and out-of-bar leader labels independently.
  const layout = (() => {
    let cursor = BAR_X0;
    return SEGMENTS.map((seg) => {
      const w = (seg.pct / 100) * BAR_W;
      const x = cursor;
      cursor += w;
      return { ...seg, x, w };
    });
  })();

  return (
    <svg
      viewBox="0 0 800 340"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Satisfaction survey: 75% positive (86 very satisfied + 153 satisfied), 20% neutral (64), 5% negative (14 dissatisfied + 3 very dissatisfied)."
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        {/* Rounds the outer corners of the stacked bar without affecting
            the internal seams between segments. */}
        <clipPath id="sat-bar-clip">
          <rect x={BAR_X0} y={BAR_Y} width={BAR_W} height={BAR_H}
                rx={BAR_H / 3} />
        </clipPath>
      </defs>

      {/* === Big % callouts: positive | neutral | negative === */}
      <text x={40} y={120} fontSize="92" fontWeight="700"
            fontFamily="var(--font-mono)" fill={COLOR_GREEN}>
        75%
      </text>
      <text x={40} y={158} fontSize="22"
            fontFamily="var(--font-mono)" fill={COLOR_GREEN}>
        задоволені
      </text>

      <text x={400} y={120} fontSize="44" fontWeight="600" textAnchor="middle"
            fontFamily="var(--font-mono)" fill="rgba(226, 232, 240, 0.7)">
        20%
      </text>
      <text x={400} y={150} fontSize="18" textAnchor="middle"
            fontFamily="var(--font-mono)" fill="rgba(226, 232, 240, 0.6)">
        нейтрально
      </text>

      <text x={760} y={120} fontSize="60" fontWeight="700" textAnchor="end"
            fontFamily="var(--font-mono)" fill={COLOR_ORANGE}>
        5%
      </text>
      <text x={760} y={150} fontSize="20" textAnchor="end"
            fontFamily="var(--font-mono)" fill={COLOR_ORANGE}>
        незадоволені
      </text>

      {/* === Stacked segmented bar === */}
      <g clipPath="url(#sat-bar-clip)">
        {layout.map((seg, i) => (
          <rect key={i} x={seg.x} y={BAR_Y} width={seg.w} height={BAR_H}
                fill={seg.color} />
        ))}
      </g>

      {/* === Counts: inside roomy segments, leader line for slivers === */}
      {layout.map((seg, i) =>
        seg.w > 40 ? (
          <text key={i} x={seg.x + seg.w / 2} y={BAR_Y + BAR_H / 2 + 8}
                fontSize="22" fontWeight="700" textAnchor="middle"
                fontFamily="var(--font-mono)" fill="rgba(10, 14, 20, 0.82)">
            {seg.count}
          </text>
        ) : (
          <g key={i}>
            <line x1={seg.x + seg.w / 2} x2={seg.x + seg.w / 2}
                  y1={BAR_Y + BAR_H + 4} y2={BAR_Y + BAR_H + 16}
                  stroke={seg.color} strokeWidth={1.5} />
            <text x={seg.x + seg.w / 2} y={BAR_Y + BAR_H + 34}
                  fontSize="15" fontWeight="700" textAnchor="middle"
                  fontFamily="var(--font-mono)" fill={seg.color}>
              {seg.count}
            </text>
          </g>
        )
      )}
    </svg>
  );
}

/**
 * Cost-per-review infographic. Box-plot inspired: each tier is a filled pill
 * for its *typical* range, with an optional dashed whisker + endpoint dot
 * that calls out the long-tail outlier max. Communicates "majority of MRs
 * cost $5–$10, but a very large one can run up to $30" without a histogram.
 *   • Anthropic's official agent — $20–$25 (orange, no whisker)
 *   • our agent on a regular MR  — $5–$10 typical, up to $30 outlier
 *   • our follow-up review       — $2–$5 (bright green, no whisker)
 */
function CostsChart() {
  const ROWS = [
    {
      label: 'Anthropic',
      labelColor: COLOR_ORANGE,
      min: 20, max: 25,
      color: '#f0883e',
    },
    {
      label: "наш — звичайний MR",
      labelColor: COLOR_GREEN,
      min:  5, max: 10,
      tail: 30,
      color: '#56c267',
    },
    {
      label: 'наш — follow-up',
      labelColor: '#7ee787',
      min:  2, max:  5,
      color: '#7ee787',
    },
  ] as const;

  const X_MIN = 0;
  const X_MAX = 35;
  const PLOT_X0 = 280;
  const PLOT_X1 = 760;
  const PLOT_W  = PLOT_X1 - PLOT_X0;
  const xOf = (v: number) =>
    PLOT_X0 + ((v - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;

  const X_TICKS = [0, 5, 10, 15, 20, 25, 30, 35];

  const ROW_Y0  = 70;
  const ROW_GAP = 80;
  const BAR_H   = 38;
  const N_ROWS  = ROWS.length;
  const GRID_TOP    = ROW_Y0 - 20;
  const GRID_BOTTOM = ROW_Y0 + (N_ROWS - 1) * ROW_GAP + BAR_H + 14;

  return (
    <svg
      viewBox="0 0 800 340"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Cost per review: Anthropic agent $20–$25; our regular MR review typically $5–$10 with a long tail up to $30 on very large MRs; our follow-up review $2–$5."
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* === Vertical $-axis gridlines === */}
      {X_TICKS.map((v) => (
        <line
          key={v}
          x1={xOf(v)} x2={xOf(v)}
          y1={GRID_TOP} y2={GRID_BOTTOM}
          stroke={COLOR_GRID}
          strokeDasharray="2 6"
        />
      ))}

      {/* === X-axis $ labels (below all rows) === */}
      {X_TICKS.map((v) => (
        <text
          key={v}
          x={xOf(v)} y={GRID_BOTTOM + 22}
          fontSize="13" fontFamily="var(--font-mono)"
          fill={COLOR_AXIS} textAnchor="middle"
        >
          ${v}
        </text>
      ))}

      {/* === Range bars + optional outlier whiskers === */}
      {ROWS.map((row, i) => {
        const y    = ROW_Y0 + i * ROW_GAP;
        const x0   = xOf(row.min);
        const x1   = xOf(row.max);
        const w    = x1 - x0;
        const tail = 'tail' in row ? row.tail : undefined;
        const yMid = y + BAR_H / 2;
        return (
          <g key={row.label}>
            {/* Row label */}
            <text
              x={260} y={yMid + 6}
              fontSize="17" fontFamily="var(--font-mono)"
              fill={row.labelColor} textAnchor="end" fontWeight="600"
            >
              {row.label}
            </text>

            {/* Filled typical-range pill */}
            <rect
              x={x0} y={y} width={w} height={BAR_H}
              rx={BAR_H / 2} fill={row.color}
            />

            {/* Min $ marker — outside-left */}
            <text
              x={x0 - 8} y={yMid + 6}
              fontSize="14" fontFamily="var(--font-mono)"
              fill={row.color} textAnchor="end" fontWeight="600"
            >
              ${row.min}
            </text>

            {/* Max $ marker — outside-right of the pill when there's no
                outlier tail; otherwise we let the whisker handle the right
                side and place max as a small caption below the pill. */}
            {tail == null ? (
              <text
                x={x1 + 8} y={yMid + 6}
                fontSize="14" fontFamily="var(--font-mono)"
                fill={row.color} textAnchor="start" fontWeight="600"
              >
                ${row.max}
              </text>
            ) : (
              <text
                x={x1 - 2} y={y + BAR_H + 18}
                fontSize="12" fontFamily="var(--font-mono)"
                fill={row.color} textAnchor="end" opacity={0.85}
              >
                ${row.max}
              </text>
            )}

            {/* === Outlier whisker (only when tail is set) === */}
            {tail != null && (
              <g opacity={0.85}>
                <line
                  x1={x1 + 4} x2={xOf(tail)}
                  y1={yMid} y2={yMid}
                  stroke={row.color}
                  strokeWidth={2.5}
                  strokeDasharray="4 5"
                  opacity={0.7}
                />
                <circle
                  cx={xOf(tail)} cy={yMid}
                  r={6} fill={row.color}
                />
                <text
                  x={xOf(tail) + 12} y={yMid + 6}
                  fontSize="14" fontWeight="600"
                  fontFamily="var(--font-mono)" fill={row.color}
                >
                  ${tail}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const CONCLUSIONS: Conclusion[] = [
  {
    key: 'time-shift',
    text: (
      <>
        час на <Emphasis color="green">початок рев'ю</Emphasis>{' '}
        <Emphasis color="green">падає</Emphasis>,
        {' '}а на <Emphasis color="orange">завершення рев'ю</Emphasis>{' '}
        <Emphasis color="orange">росте</Emphasis>
      </>
    ),
    hasGraph: true,
    chart: <TimeShiftChart />,
  },
  {
    key: 'time-psychology',
    text: (
      <>
        <Emphasis color="green">психологія часу</Emphasis>:
        {' '}очікувати рев'ю 30 хвилин від людини і від агента відчувається по-різному
      </>
    ),
    hasGraph: true,
    chart: <TimeShiftChart />,
  },
  {
    key: 'vibes-metrics',
    text: (
      <>
        <Emphasis color="green">вайби</Emphasis>{' '}
        — <Emphasis color="orange">набагато кращі метрики</Emphasis>
        {' '}ніж будь які евал сети, але для цього потрібно миттєво реагувати на фідбек
      </>
    ),
    hasGraph: true,
    chart: <SatisfactionChart />,
  },
  {
    key: 'costs',
    text: (
      <>
        <Emphasis color="orange">рев'ю</Emphasis>{' '}
        — <Emphasis color="orange">це дорого</Emphasis>;
        {' '}рішення - оптимізації + запуск тільки по запиту
      </>
    ),
    hasGraph: true,
    chart: <CostsChart />,
  },
  {
    key: 'human-approver',
    text: (
      <>
        <Emphasis color="green">людина</Emphasis>{' '}
        залишається <Emphasis color="green">головним апрувером</Emphasis>{' '}
        якого або яку ми підсилюємо АІ агентом
      </>
    ),
    hasGraph: false,
  },
  {
    key: 'human-approver',
    text: (
      <>
        але, можливо, нам потрібен{' '}
        <Emphasis color="orange">абсолютно новий процес?</Emphasis>
      </>
    ),
    hasGraph: false,
  },
];

const STYLES = `
  @keyframes conclusionPanelIn {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes conclusionTextIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .conclusions-stage {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-md);
    width: 100%;
  }

  .conclusions-title {
    text-align: left;
    margin: 0;
  }

  /* Two-column row: text left, TBD-graph right. When hasGraph is false the
     text column expands to full width. */
  .conclusions-row {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 2rem;
  }

  .conclusions-row--solo .conclusions-text {
    flex: 1 1 100%;
    justify-content: center;
    text-align: center;
    font-size: var(--slide-text-large, 2.2rem);
    padding: 0 var(--space-xl);
  }

  .conclusions-text {
    flex: 0 0 40%;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: var(--slide-text-normal);
    animation: conclusionTextIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .conclusions-graph {
    flex: 1 1 60%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    overflow: hidden;
    border-radius: 14px;
    background:
      repeating-linear-gradient(
        45deg,
        rgba(126, 231, 135, 0.03) 0 8px,
        rgba(10, 14, 20, 0.6) 8px 16px
      );
    border: 1px dashed rgba(126, 231, 135, 0.45);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(126, 231, 135, 0.06);
    padding: var(--space-md);
    animation: conclusionPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .conclusions-graph__label {
    font-family: var(--font-mono);
    font-size: var(--slide-text-compact);
    color: var(--terminal-orange);
    letter-spacing: 0.08em;
    text-shadow: 0 0 8px rgba(240, 136, 62, 0.35);
  }

  .conclusions-graph__caption {
    font-family: var(--font-mono);
    font-size: var(--slide-text-dense);
    color: rgba(226, 232, 240, 0.5);
    text-align: center;
    max-width: 80%;
  }

  /* Once a real chart is attached, drop the diagonal TBD hatching so the
     SVG sits on a clean dark background, and let it consume vertical space. */
  .conclusions-graph--rendered {
    background: rgba(10, 14, 20, 0.6);
    border-style: solid;
    border-color: rgba(126, 231, 135, 0.35);
    justify-content: stretch;
    padding: var(--space-md);
  }
  .conclusions-graph__chart {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function ConclusionsContent({ revealStage }: { revealStage: number }) {
  const idx = Math.min(revealStage, CONCLUSIONS.length - 1);
  const c = CONCLUSIONS[idx];

  return (
    <>
      <style>{STYLES}</style>

      <div className="conclusions-stage">
        <h2 className="conclusions-title">
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">деякі</span>{' '}
          <span className="text-orange">висновки</span>
        </h2>

        <div
          className={`conclusions-row ${c.hasGraph ? '' : 'conclusions-row--solo'}`}
        >
          <div key={`text-${c.key}`} className="conclusions-text">
            <SlideItem>{c.text}</SlideItem>
          </div>

          {c.hasGraph && (
            <div
              key={`graph-${c.key}`}
              className={`conclusions-graph ${c.chart ? 'conclusions-graph--rendered' : ''}`}
            >
              {c.chart ? (
                <>
                  <div className="conclusions-graph__chart">{c.chart}</div>
                  {c.graphCaption && (
                    <div className="conclusions-graph__caption">
                      // {c.graphCaption}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="conclusions-graph__label">
                    <Code>TBD</Code> графік
                  </div>
                  {c.graphCaption && (
                    <div className="conclusions-graph__caption">
                      // {c.graphCaption}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const ConclusionsSlide: SlideDefinition = {
  id: 'conclusions',
  // 5 reveal stages (0..4) → maxRevealStages = 4
  maxRevealStages: CONCLUSIONS.length - 1,
  initialRevealStage: 0,
  content: ({ revealStage }: SlideContentProps) => (
    <ConclusionsContent revealStage={revealStage} />
  ),
  notes:
    'Висновки секції про код-рев\'ю агента. One-reveal-at-a-time: попередні булети ховаємо, щоб поточний дихав. Reveal 1: time-to-first-review падає, time-to-merge росте. 2: психологія часу — людина чекає боляче, агент ні. 3: вайби — найкраща метрика, ніяких 47 KPI. 4: кости — велика проблема, $ за MR ростуть з деку. 5 (фінальний, без графіка, повна ширина): людина — головний апрувер, але, можливо, потрібен абсолютно новий процес? Графіки на стейджах 1-4 — TBD placeholder з диагональними штрихами і dashed border, додати реальні дані пізніше.',
};
