import { SlideDefinition, SlideContentProps } from '../types/slides';
import { tr, type Lang } from '../context/LanguageContext';

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
  labelEn?: string;
  sub?: string;
  subEn?: string;
  bullets: string[];
  /** Same length and order as `bullets`. */
  bulletsEn: string[];
  /** Mystery zone shows a glowing "????" placeholder in lieu of bullets. */
  mystery?: boolean;
};

// Left → right, in narrative order. Stage 0 is the "majority" (rightmost);
// each reveal sweeps left, finishing at the "Anthropic всередині / ????"
// mystery zone.
// EN: own translation (labelEn / subEn / bulletsEn)
const ZONES: Zone[] = [
  {
    key: 'anthropic-inside',
    color: DOU_MAGENTA,
    label: 'Anthropic',
    sub: 'всередині',
    subEn: 'internally',
    bullets: [],
    bulletsEn: [],
    mystery: true,
  },
  {
    key: 'ai-first-teams',
    color: DOU_MINT,
    label: 'AI-first',
    sub: 'команди',
    subEn: 'teams',
    bullets: ['активатор скілів', 'збереження сесій'],
    bulletsEn: ['skills activator', 'saving sessions'],
  },
  {
    key: 'anthropic-public',
    color: DOU_CYAN,
    label: 'Anthropic',
    sub: 'публічно',
    subEn: 'publicly',
    bullets: [
      'маркетплейс плагінів',
      'мета-скіли',
      'автопідтвердження',
      'AI код-ревʼю',
    ],
    bulletsEn: [
      'plugin marketplace',
      'meta-skills',
      'auto-approval',
      'AI code review',
    ],
  },
  {
    key: 'majority',
    color: DOU_VIOLET,
    label: 'більшість',
    labelEn: 'the majority',
    bullets: [],
    bulletsEn: [],
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

function AIInnovatorCurveContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  // Reveal sweeps right → left: stage 0 = majority (rightmost), stage 3 =
  // mystery (leftmost).
  const activeIdx = ZONES.length - 1 - revealStage;

  return (
    <div className="ainnovator-curve-stage">
      <h2 className="ainnovator-curve-title">
        <span className="text-dim">&gt;</span>{' '}
        <span className="text-green">{tr(lang, 'знайдіть своє', 'find your')}</span>{' '}
        <span className="text-orange">{tr(lang, 'місце', 'place')}</span>
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
            stroke="color-mix(in srgb, var(--terminal-pure-white) 78%, transparent)"
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
            stroke="color-mix(in srgb, var(--terminal-pure-white) 16%, transparent)"
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
                <div className="ainnovator-curve-zone__label">{tr(lang, zone.label, zone.labelEn ?? zone.label)}</div>
                {zone.sub && (
                  <div className="ainnovator-curve-zone__sub">{tr(lang, zone.sub, zone.subEn ?? zone.sub)}</div>
                )}
              </div>

              <div
                className="ainnovator-curve-zone__bullets"
                style={{ ...colorVar, gridColumn: i + 1, gridRow: 3 }}
              >
                {zone.mystery && (
                  <div className="ainnovator-curve-zone__mystery">????</div>
                )}
                {tr(lang, zone.bullets, zone.bulletsEn).map((b) => (
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
  content: ({ revealStage, lang }: SlideContentProps) => (
    <AIInnovatorCurveContent revealStage={revealStage} lang={lang} />
  ),
  notes:
    'Крива адопції Роджерса, прикладена до AI. Корідор із 4 зон зліва направо: Anthropic всередині (????), AI-first команди, Anthropic публічно, більшість. Кожна зона має лейбл згори, кольорову заливку під кривою посередині, булети знизу. Reveal-зчитування справа наліво (stage 0 → більшість, stage 3 → ????). Активна зона світиться у повну непрозорість + soft radial halo; неактивні дімаються до 0.22.',
};
