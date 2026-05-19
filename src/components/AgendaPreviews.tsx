import pov01 from '../assets/pov-screenshots/pov-01-gitlab-remote-claude-code-121.png?url';
import pov03 from '../assets/pov-screenshots/pov-03-gitlab-checkout-ui-575.png?url';
import pov05 from '../assets/pov-screenshots/pov-05-superhuman-platform-tools-290.png?url';
import pov08 from '../assets/pov-screenshots/pov-08-superhuman-fewm-6625.png?url';
import pov10 from '../assets/pov-screenshots/pov-10-grammarly-synthia-1.png?url';
import spaceBg from '../assets/skill-space-bg.png?url';
import leftAstronaut from '../assets/skill-was-it-md.png?url';
import rightAstronaut from '../assets/skill-always-been.png?url';

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
      <style>{`
        .pov-preview {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #0a0e14;
          border-radius: 4px;
          border: 1px solid var(--terminal-border);
        }
        .pov-preview__card {
          position: absolute;
          width: 32%;
          aspect-ratio: 4 / 3;
          background: #fff;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 3px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.55);
          overflow: hidden;
          animation: pov-preview-drift 5s ease-in-out infinite;
        }
        .pov-preview__card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top left;
          display: block;
        }
        @keyframes pov-preview-drift {
          0%, 100% { transform: translate(0, 0)         rotate(var(--rot)) scale(1); }
          50%      { transform: translate(2%, -3%)      rotate(calc(var(--rot) + 2deg)) scale(1.02); }
        }
      `}</style>
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
      <style>{`
        .astro-preview {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #0a0e14;
          background-image: url(${spaceBg});
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 4px;
          border: 1px solid var(--terminal-border);
        }
        .astro-preview::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(10, 14, 20, 0.45) 0%,
            rgba(10, 14, 20, 0.25) 50%,
            rgba(10, 14, 20, 0.55) 100%);
          pointer-events: none;
        }
        .astro-preview__astro {
          position: absolute;
          top: 50%;
          height: 86%;
          width: auto;
          object-fit: contain;
          mix-blend-mode: screen;
          filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.55));
          pointer-events: none;
        }
        .astro-preview__astro--left {
          left: 4%;
          animation: astro-preview-float 6s ease-in-out infinite;
        }
        .astro-preview__astro--right {
          right: 4%;
          animation: astro-preview-float-rev 7s ease-in-out infinite;
        }
        @keyframes astro-preview-float {
          0%, 100% { transform: translateY(-50%)       rotate(-2deg); }
          50%      { transform: translateY(calc(-50% - 6px)) rotate(2deg); }
        }
        @keyframes astro-preview-float-rev {
          0%, 100% { transform: translateY(-50%)       rotate(2deg); }
          50%      { transform: translateY(calc(-50% - 6px)) rotate(-2deg); }
        }
      `}</style>
      <img className="astro-preview__astro astro-preview__astro--left"  src={leftAstronaut}  alt="" loading="lazy" />
      <img className="astro-preview__astro astro-preview__astro--right" src={rightAstronaut} alt="" loading="lazy" />
    </div>
  );
}
