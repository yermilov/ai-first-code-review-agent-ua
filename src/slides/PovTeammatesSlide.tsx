import { useMemo } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';

import pov01 from '../assets/pov-screenshots/pov-01-gitlab-remote-claude-code-121.png?url';
import pov02 from '../assets/pov-screenshots/pov-02-gitlab-cicd-components-389.png?url';
import pov03 from '../assets/pov-screenshots/pov-03-gitlab-checkout-ui-575.png?url';
import pov04 from '../assets/pov-screenshots/pov-04-gitlab-cognitogram-kms-517.png?url';
import pov05 from '../assets/pov-screenshots/pov-05-superhuman-platform-tools-290.png?url';
import pov06 from '../assets/pov-screenshots/pov-06-superhuman-fewm-6510.png?url';
import pov07 from '../assets/pov-screenshots/pov-07-superhuman-platform-tools-224.png?url';
import pov08 from '../assets/pov-screenshots/pov-08-superhuman-fewm-6625.png?url';
import pov09 from '../assets/pov-screenshots/pov-09-superhuman-fewm-6482.png?url';
import pov10 from '../assets/pov-screenshots/pov-10-grammarly-synthia-1.png?url';
import pov11 from '../assets/pov-screenshots/pov-11-grammarly-superhuman-aidev-334.png?url';
import pov12 from '../assets/pov-screenshots/pov-12-grammarly-superhuman-aidev-317.png?url';

// 3 longest descriptions in clean columns (reveals 1-2)
// pov-10 synthia/1 (4194), pov-07 platform-tools/224 (3086), pov-03 checkout-ui/575 (2997)
const CLEAN = [pov10, pov07, pov03];
// Remaining 9 in chaos pile (reveal 3)
const CHAOS = [pov01, pov02, pov04, pov05, pov06, pov08, pov09, pov11, pov12];
const ALL_CARDS = [...CLEAN, ...CHAOS];

// Stage-3 layout (% of container)
const POSITIONS: { left: number; top: number; rot: number; delay: number }[] = [
  { left:  6, top:  4, rot:  0, delay:   0 },
  { left: 38, top:  4, rot:  0, delay: 120 },
  { left: 70, top:  4, rot:  0, delay: 240 },
  { left: 14, top: 12, rot:  -9, delay:   0 },
  { left: 56, top:  6, rot:   6, delay: 120 },
  { left: 32, top: 22, rot: -13, delay: 280 },
  { left: 70, top: 26, rot:  10, delay:  60 },
  { left: 18, top: 38, rot:   8, delay: 380 },
  { left: 48, top: 32, rot:  -7, delay: 180 },
  { left: 64, top: 48, rot:  12, delay: 340 },
  { left: 26, top: 54, rot: -11, delay: 200 },
  { left: 50, top: 58, rot:   5, delay: 440 },
];

// --- Solitaire cascade --------------------------------------------------------

type TrailPoint = { x: number; y: number };

const STAGE_W = 100;
const BADGE_W = 11;
const BADGE_H = 4.5;
const GROUND_Y = 95;

const GRAVITY = 0.45;
const DAMPING = 0.82;
const MIN_BOUNCE_VY = 0.7;

function simulateTrail(startX: number, startY: number, vx0: number, vy0: number): TrailPoint[] {
  const trail: TrailPoint[] = [];
  let x = startX;
  let y = startY;
  let vx = vx0;
  let vy = vy0;

  for (let i = 0; i < 320; i++) {
    vy += GRAVITY;
    x += vx;
    y += vy;

    if (y + BADGE_H >= GROUND_Y) {
      y = GROUND_Y - BADGE_H;
      if (Math.abs(vy) < MIN_BOUNCE_VY) {
        vy = 0;
        trail.push({ x, y });
        break;
      } else {
        vy = -vy * DAMPING;
      }
    }

    trail.push({ x, y });

    if (x > STAGE_W + 5 || x < -BADGE_W - 5) break;
  }

  return trail;
}

function rand(seed: number) {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function buildTrails(): TrailPoint[][] {
  return POSITIONS.map((pos, idx) => {
    const startX = pos.left + 6;
    const startY = pos.top + 13;
    const goRight = rand(idx + 0.1) > 0.5;
    const vx = (goRight ? 1 : -1) * (0.7 + rand(idx + 0.3) * 0.7);
    const vy = -(2.6 + rand(idx + 0.7) * 1.6);
    return simulateTrail(startX, startY, vx, vy);
  });
}

const TRAILS = buildTrails();

const CARD_STAGGER_MS = 150;
const STEP_MS = 18;
const FADE_MS = 1;

// ----------------------------------------------------------------------------

const STYLES = `
@keyframes pov-fade-in {
  from { opacity: 0; transform: translateY(-12px) rotate(var(--base-rot)) scale(0.92); }
  to   { opacity: 1; transform: translateY(0)     rotate(var(--base-rot)) scale(1); }
}

@keyframes pov-chaos-drop {
  0%   { opacity: 0; transform: rotate(var(--base-rot)) scale(0.5) translateY(-40vh); }
  60%  { opacity: 1; transform: rotate(var(--base-rot)) scale(1.05) translateY(12px); }
  100% { opacity: 1; transform: rotate(var(--base-rot)) scale(1)    translateY(0); }
}

@keyframes pov-ghost-pop {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Clean-card vertical scroll — image scaled up so it overflows the
   portrait-shaped frame; gentle ping-pong reveals more content over time. */
@keyframes pov-scroll-down {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

/* ── Chaos card (used in stage 3+ for the 9 non-scrolling screenshots) ── */
.pov-card {
  position: absolute;
  width: 26%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.35);
  background: #fff;
  user-select: none;
  will-change: transform, opacity;
}

.pov-card-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 5px;
}

.pov-card-chaos { animation: pov-chaos-drop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* ── Clean card with scroll (used in reveals 1-2 for the 3 longest descriptions) ── */
.pov-card-scroll {
  position: absolute;
  width: 24%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.35);
  background: #fff;
  user-select: none;
  animation: pov-fade-in 0.55s ease-out both;
}

.pov-card-scroll-img {
  display: block;
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  animation: pov-scroll-down 18s ease-in-out infinite alternate;
}

/* ── Solitaire ghost (stage 4) ── */
.pov-ghost {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: #ffffff;
  color: #1f2328;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 0.7rem;
  line-height: 1.2;
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  user-select: none;
  pointer-events: none;
  opacity: 0;
  animation: pov-ghost-pop ${FADE_MS}ms linear forwards;
}

.pov-ghost-link {
  color: #0969da;
  text-decoration: underline;
}
`;

function PovTeammatesContent({ revealStage }: { revealStage: number }) {
  const showFirst        = revealStage >= 1;
  const showAllThree     = revealStage >= 2;
  const showChaos        = revealStage >= 3;
  const animateSolitaire = revealStage >= 4;

  const ghosts = useMemo(() => {
    return TRAILS.flatMap((trail, cardIdx) =>
      trail.map((point, stepIdx) => ({
        key: `${cardIdx}-${stepIdx}`,
        x: point.x,
        y: point.y,
        delay: cardIdx * CARD_STAGGER_MS + stepIdx * STEP_MS,
        z: 200 + cardIdx * 200 + stepIdx,
      })),
    );
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(var(--vh-full) - 220px)',
          overflow: 'hidden',
        }}
      >
        {/* Clean scroll-cards (3 longest descriptions, reveals 1-2) */}
        {CLEAN.map((src, idx) => {
          const visible = (idx === 0 && showFirst) || (idx > 0 && showAllThree);
          if (!visible) return null;

          const pos = POSITIONS[idx];
          const fadeDelay = idx * 140;
          // Stagger scroll start so the 3 cards aren't perfectly synchronized
          const scrollDelay = idx * -4000;

          return (
            <div
              key={`clean-${idx}`}
              className="pov-card-scroll"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                zIndex: 5 - idx,
                animationDelay: `${fadeDelay}ms`,
              }}
            >
              <img
                className="pov-card-scroll-img"
                src={src}
                alt=""
                loading="lazy"
                style={{ animationDelay: `${scrollDelay}ms` }}
              />
            </div>
          );
        })}

        {/* Chaos cards (9 remaining, reveal 3+) */}
        {showChaos && CHAOS.map((src, i) => {
          const idx = i + 3; // POSITIONS index
          const pos = POSITIONS[idx];

          return (
            <div
              key={`chaos-${idx}`}
              className="pov-card pov-card-chaos"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                zIndex: 10 + idx,
                animationDelay: `${pos.delay}ms`,
                ['--base-rot' as never]: `${pos.rot}deg`,
              } as React.CSSProperties}
            >
              <img className="pov-card-img" src={src} alt="" loading="lazy" />
            </div>
          );
        })}

        {/* Stage 4: solitaire badge cascade */}
        {animateSolitaire && ghosts.map(g => (
          <div
            key={`ghost-${g.key}`}
            className="pov-ghost"
            style={{
              left: `${g.x}%`,
              top: `${g.y}%`,
              zIndex: g.z,
              animationDelay: `${g.delay}ms`,
            }}
          >
            <span aria-hidden>🤖</span>
            <span>Generated with</span>
            <span className="pov-ghost-link">Claude Code</span>
          </div>
        ))}
      </div>
    </>
  );
}

export const PovTeammatesSlide: SlideDefinition = {
  id: 'pov-teammates',
  maxRevealStages: 4,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-orange">пов</span>
      <span className="text-dim">:</span>{' '}
      <span className="text-green">ваші тім-мейти успішно адоптять claude code</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <PovTeammatesContent revealStage={revealStage} />,
  notes:
    'Stage 0: title only. Stage 1: first scroll-card in column 1 (longest description). Stage 2: two more scroll-cards in columns 2 and 3 (next 2 longest). Each clean card has a slow vertical scroll animation revealing the full description content over time. Stage 3: remaining 9 chaos cards drop in with random rotations. Stage 4: classic Windows 3.x Solitaire cascade — each "🤖 Generated with Claude Code" badge launches from its source card and bounces across the stage, leaving the iconic persistent trail.',
};
