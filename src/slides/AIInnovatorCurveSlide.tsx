import { SlideDefinition, SlideContentProps } from '../types/slides';

// DOU palette — JS constants are the design-system-sanctioned exception
// for SVG fill/stroke. Mirror --dou-magenta/--dou-mint/--dou-cyan/--dou-violet
// in src/styles/theme.css.
const DOU_MAGENTA = '#FF16B1';
const DOU_MINT = '#02FEB9';
const DOU_CYAN = '#02D6FE';
const DOU_VIOLET = '#7626FF';

type Zone = {
  key: string;
  color: string;
  label: string;
  sub?: string;
  bullets: string[];
  /** Mystery zone shows a glowing "????" placeholder in lieu of bullets. */
  mystery?: boolean;
};

// Left → right, in narrative order. Stage 0 is the "majority" (rightmost);
// each reveal sweeps left, finishing at the "Anthropic всередині / ????"
// mystery zone.
const ZONES: Zone[] = [
  {
    key: 'anthropic-inside',
    color: DOU_MAGENTA,
    label: 'Anthropic',
    sub: 'всередині',
    bullets: [],
    mystery: true,
  },
  {
    key: 'ai-first-teams',
    color: DOU_MINT,
    label: 'AI-first',
    sub: 'команди',
    bullets: ['активатор скілів', 'збереження сесій'],
  },
  {
    key: 'anthropic-public',
    color: DOU_CYAN,
    label: 'Anthropic',
    sub: 'публічно',
    bullets: [
      'маркетплейс плагінів',
      'мета-скіли',
      'автопідтвердження',
      'AI код-ревʼю',
    ],
  },
  {
    key: 'majority',
    color: DOU_VIOLET,
    label: 'більшість',
    bullets: [],
  },
];

// Bell curve sampled across the SVG width. The peak sits at ~75% of the
// canvas (the right side of the "Anthropic публічно" zone, leading into
// "більшість") — matches the narrative that mass adoption is the rightmost
// section.
const CURVE_W = 1000;
const CURVE_H = 200;
const CURVE_MU = CURVE_W * 0.75;
const CURVE_SIGMA = CURVE_W * 0.18;

function bellPoints(): { x: number; y: number }[] {
  const steps = 240;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * CURVE_W;
    const norm = Math.exp(-0.5 * ((x - CURVE_MU) / CURVE_SIGMA) ** 2);
    // Reserve 6px at the top so the stroke glow doesn't clip the viewBox.
    const y = 6 + (CURVE_H - 6) * (1 - norm);
    pts.push({ x, y });
  }
  return pts;
}

const PTS = bellPoints();
const outlinePath = PTS.map(
  ({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`,
).join(' ');
const filledPath = `${outlinePath} L${CURVE_W},${CURVE_H} L0,${CURVE_H} Z`;

const STYLES = `
  @keyframes mysterGlow {
    0%, 100% { opacity: 0.78; text-shadow: 0 0 12px ${DOU_MAGENTA}, 0 0 24px ${DOU_MAGENTA}; }
    50%       { opacity: 1;   text-shadow: 0 0 22px ${DOU_MAGENTA}, 0 0 44px ${DOU_MAGENTA}, 0 0 64px rgba(255,22,177,0.4); }
  }

  @keyframes curveZoneIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: var(--zone-target-opacity, 1); transform: translateY(0); }
  }

  /* ── Stage container ────────────────────────────────────────────────── */
  /* Explicit height (not min-height) so the corridor below can reliably
     resolve percentage-based heights and the SVG overlay never overflows. */
  .ainnovator-curve-stage {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-md);
    width: 100%;
  }

  .ainnovator-curve-title {
    text-align: left;
    margin: 0;
  }

  /* ── Corridor: 4 equal-width zones + bell-curve overlay ─────────────── */
  .ainnovator-curve-corridor {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto 1fr auto;
    column-gap: 0;
    row-gap: var(--space-sm);
  }

  /* Bell curve sits in row 2, spanning all 4 columns. Drawn behind the
     zone content via z-index. */
  .ainnovator-curve-corridor__arc {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  /* Each zone occupies one column across all 3 rows. */
  .ainnovator-curve-zone {
    display: contents;  /* let cap / chart / bullets be direct grid children */
  }

  .ainnovator-curve-zone__cap,
  .ainnovator-curve-zone__bullets {
    position: relative;
    z-index: 1;
    padding: 0 var(--space-sm);
    text-align: center;
    transition: opacity 0.45s ease;
  }

  /* Top row — labels with a subtle color stripe */
  .ainnovator-curve-zone__cap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding-top: var(--space-xs);
    border-top: 2px solid color-mix(in srgb, var(--zone-color) 60%, transparent);
    font-family: var(--font-mono);
  }

  .ainnovator-curve-zone__label {
    color: var(--zone-color);
    font-weight: 600;
    font-size: var(--slide-text-normal);
    letter-spacing: 0.02em;
  }

  .ainnovator-curve-zone__sub {
    color: var(--zone-color);
    font-weight: 500;
    font-size: var(--slide-text-dense);
    opacity: 0.9;
  }

  /* Bottom row — bullets stack from the curve baseline downward */
  .ainnovator-curve-zone__bullets {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    align-items: center;
    padding-bottom: var(--space-xs);
    font-family: var(--font-mono);
    min-height: 0;
  }

  .ainnovator-curve-zone__bullet {
    color: var(--zone-color);
    /* Sized so 4 bullets fit in a quarter-width column without forcing the
       longest one to wrap, and without overflowing past the slide bottom. */
    font-size: clamp(0.85rem, 1.05vw, 1.3rem);
    line-height: 1.15;
  }

  .ainnovator-curve-zone__mystery {
    color: ${DOU_MAGENTA};
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: var(--slide-text-h3, var(--font-size-h3));
    letter-spacing: 0.2em;
    animation: mysterGlow 2.4s ease-in-out infinite;
  }

  /* ── Active-state spotlight ──────────────────────────────────────────── */
  /* Inactive zones dim to a deliberate non-zero so the audience still
     senses the full corridor; active zone reads at full intensity with a
     soft radial halo. */
  .ainnovator-curve-zone--inactive .ainnovator-curve-zone__cap,
  .ainnovator-curve-zone--inactive .ainnovator-curve-zone__bullets,
  .ainnovator-curve-zone--inactive .ainnovator-curve-zone__mystery {
    opacity: 0.22;
  }

  .ainnovator-curve-zone--active .ainnovator-curve-zone__cap,
  .ainnovator-curve-zone--active .ainnovator-curve-zone__bullets {
    opacity: 1;
  }

  /* Behind-content radial glow for the active zone — pulled out so it
     occupies the chart row exclusively without bleeding into cap/bullets. */
  .ainnovator-curve-corridor__spotlight {
    grid-row: 2;
    position: relative;
    pointer-events: none;
    transition: opacity 0.45s ease;
  }

  .ainnovator-curve-corridor__spotlight::after {
    content: '';
    position: absolute;
    inset: -10% -20%;
    background: radial-gradient(
      ellipse at center,
      color-mix(in srgb, var(--zone-color) 22%, transparent) 0%,
      transparent 70%
    );
    z-index: 0;
  }

  .ainnovator-curve-corridor__spotlight--inactive { opacity: 0; }
  .ainnovator-curve-corridor__spotlight--active   { opacity: 1; }

  /* Vertical hairline dividers between zones */
  .ainnovator-curve-corridor__divider {
    grid-row: 1 / -1;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.12) 12%,
      rgba(255, 255, 255, 0.12) 88%,
      transparent
    );
    justify-self: end;
    pointer-events: none;
    z-index: 0;
  }
`;

function AIInnovatorCurveContent({ revealStage }: { revealStage: number }) {
  // Reveal sweeps right → left: stage 0 = majority (rightmost), stage 3 =
  // mystery (leftmost).
  const activeIdx = ZONES.length - 1 - revealStage;

  return (
    <div className="ainnovator-curve-stage">
      <style>{STYLES}</style>

      <h2 className="ainnovator-curve-title">
        <span className="text-dim">&gt;</span>{' '}
        <span className="text-green">знайдіть своє</span>{' '}
        <span className="text-orange">місце</span>
      </h2>

      <div className="ainnovator-curve-corridor">
        {/* Spotlight haloes behind chart row, one per zone */}
        {ZONES.map((zone, i) => (
          <div
            key={`spot-${zone.key}`}
            className={`ainnovator-curve-corridor__spotlight ainnovator-curve-corridor__spotlight--${i === activeIdx ? 'active' : 'inactive'}`}
            style={
              {
                gridColumn: i + 1,
                ['--zone-color' as string]: zone.color,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Bell curve overlay — spans all 4 columns in the chart row */}
        <svg
          className="ainnovator-curve-corridor__arc"
          viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {ZONES.map((_, i) => {
              const x1 = (i / ZONES.length) * CURVE_W;
              const x2 = ((i + 1) / ZONES.length) * CURVE_W;
              return (
                <clipPath key={`clip-${i}`} id={`ain-clip-${i}`}>
                  <rect x={x1} y={0} width={x2 - x1} height={CURVE_H} />
                </clipPath>
              );
            })}
            {ZONES.map((zone, i) => (
              <linearGradient
                key={`grad-${i}`}
                id={`ain-grad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={zone.color} stopOpacity={0} />
                <stop offset="55%" stopColor={zone.color} stopOpacity={0.16} />
                <stop offset="100%" stopColor={zone.color} stopOpacity={0.34} />
              </linearGradient>
            ))}
            <filter id="ain-curve-glow" x="-5%" y="-30%" width="110%" height="160%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Section-coloured fills, dim when inactive */}
          {ZONES.map((_, i) => (
            <path
              key={`fill-${i}`}
              d={filledPath}
              fill={`url(#ain-grad-${i})`}
              clipPath={`url(#ain-clip-${i})`}
              opacity={i === activeIdx ? 1 : 0.22}
              style={{ transition: 'opacity 0.45s ease' }}
              preserveAspectRatio="none"
            />
          ))}

          {/* Glow underlay */}
          <path
            d={outlinePath}
            fill="none"
            stroke={DOU_MINT}
            strokeOpacity={0.32}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#ain-curve-glow)"
            vectorEffect="non-scaling-stroke"
          />
          {/* Curve outline */}
          <path
            d={outlinePath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.78)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Baseline rule */}
          <line
            x1={0}
            y1={CURVE_H}
            x2={CURVE_W}
            y2={CURVE_H}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Hairline dividers between columns 1↔2, 2↔3, 3↔4 */}
        {[1, 2, 3].map((col) => (
          <div
            key={`divider-${col}`}
            className="ainnovator-curve-corridor__divider"
            style={{ gridColumn: col }}
          />
        ))}

        {/* Zone caps (row 1) + bullets (row 3) for each column */}
        {ZONES.map((zone, i) => {
          const isActive = i === activeIdx;
          const stateClass = isActive
            ? 'ainnovator-curve-zone--active'
            : 'ainnovator-curve-zone--inactive';
          const colorVar = { ['--zone-color' as string]: zone.color } as React.CSSProperties;

          return (
            <div key={zone.key} className={`ainnovator-curve-zone ${stateClass}`}>
              <div
                className="ainnovator-curve-zone__cap"
                style={{ ...colorVar, gridColumn: i + 1, gridRow: 1 }}
              >
                <div className="ainnovator-curve-zone__label">{zone.label}</div>
                {zone.sub && (
                  <div className="ainnovator-curve-zone__sub">{zone.sub}</div>
                )}
              </div>

              <div
                className="ainnovator-curve-zone__bullets"
                style={{ ...colorVar, gridColumn: i + 1, gridRow: 3 }}
              >
                {zone.mystery && (
                  <div className="ainnovator-curve-zone__mystery">????</div>
                )}
                {zone.bullets.map((b) => (
                  <div key={b} className="ainnovator-curve-zone__bullet">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const AIInnovatorCurveSlide: SlideDefinition = {
  id: 'ai-innovator-curve',
  maxRevealStages: 3,
  content: ({ revealStage }: SlideContentProps) => (
    <AIInnovatorCurveContent revealStage={revealStage} />
  ),
  notes:
    'Крива адопції Роджерса, прикладена до AI. Корідор із 4 зон зліва направо: Anthropic всередині (????), AI-first команди, Anthropic публічно, більшість. Кожна зона має лейбл згори, кольорову заливку під кривою посередині, булети знизу. Reveal-зчитування справа наліво (stage 0 → більшість, stage 3 → ????). Активна зона світиться у повну непрозорість + soft radial halo; неактивні дімаються до 0.22.',
};
