import pov01 from '../assets/pov-screenshots/pov-01-gitlab-remote-claude-code-121.png?url';
import pov03 from '../assets/pov-screenshots/pov-03-gitlab-checkout-ui-575.png?url';
import pov05 from '../assets/pov-screenshots/pov-05-superhuman-platform-tools-290.png?url';
import pov08 from '../assets/pov-screenshots/pov-08-superhuman-fewm-6625.png?url';
import pov10 from '../assets/pov-screenshots/pov-10-grammarly-synthia-1.png?url';
import leftAstronaut from '../assets/skill-was-it-md.png?url';
import rightAstronaut from '../assets/skill-always-been.png?url';
import { TimeShiftChart } from '../slides/ConclusionsSlide';

/**
 * Miniature continuously-shuffling pile of screenshots — the agenda preview
 * for the PovTeammates "solitaire cascade" subsection. Cards drift in place
 * with a slow infinite loop so the card feels alive without screaming.
 */
const POV_PREVIEW_CARDS = [
  { src: pov01, left: '6%',  top: '10%', rot: '-9deg', delay: '0s'   },
  { src: pov03, left: '34%', top: '6%',  rot: '5deg',  delay: '0.5s' },
  { src: pov05, left: '60%', top: '14%', rot: '-4deg', delay: '1s'   },
  { src: pov08, left: '18%', top: '44%', rot: '7deg',  delay: '1.5s' },
  { src: pov10, left: '48%', top: '46%', rot: '-7deg', delay: '2s'   },
];

export function PovSolitairePreview() {
  return (
    <div className="pov-preview" aria-hidden>
      {POV_PREVIEW_CARDS.map((card, i) => (
        <div
          key={i}
          className="pov-preview__card"
          style={{
            left: card.left,
            top: card.top,
            zIndex: 10 + i,
            animationDelay: card.delay,
            ['--rot' as never]: card.rot,
            transform: `rotate(${card.rot})`,
          } as React.CSSProperties}
        >
          <img src={card.src} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

/**
 * Miniature floating-astronauts preview — the agenda preview for the
 * WhatIsSkill subsection. Reuses the same float keyframes the full slide
 * uses, slightly scaled down for a card-sized stage.
 */
export function SkillAstronautsPreview() {
  return (
    <div className="astro-preview" aria-hidden>
      <img className="astro-preview__astro astro-preview__astro--left"  src={leftAstronaut}  alt="" loading="lazy" />
      <img className="astro-preview__astro astro-preview__astro--right" src={rightAstronaut} alt="" loading="lazy" />
    </div>
  );
}

/**
 * Mini TimeShift preview for the AgentTraces subsection — the same two
 * percentile-line charts (time-to-first-review vs. time-to-merge) the
 * Conclusions slide renders, scaled into the agenda card as a teaser.
 */
export function TimeShiftPreview() {
  return (
    <div className="time-shift-preview" aria-hidden>
      <TimeShiftChart />
    </div>
  );
}
