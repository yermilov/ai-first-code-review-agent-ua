import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import claudeReviewImage from '../assets/ai-code-review-claude.png?url';
import copilotReviewImage from '../assets/ai-code-review-copilot.png?url';
import codexReviewImage from '../assets/ai-code-review-codex.png?url';

// Tool screenshots that fade in alongside the matching SECOND_SET bullet.
// Index 0 is the intro bullet (no image); 1..3 map to Claude, Copilot, Codex.
const TOOL_SCREENSHOTS: (string | null)[] = [
  null,
  claudeReviewImage,
  copilotReviewImage,
  codexReviewImage,
];

// Two-phase reveal (same idiom as SkillMarketplaceSlide / MetaSkillsSlide):
// FIRST_SET shows three bullets full-width as one column; once they're all
// out, SECOND_SET swaps to a half-width bullet + the in-house AI code review
// agent screenshot on the right.
const FIRST_SET: ReactNode[] = [
  <>
    завдяки <Emphasis color="green">AI асистентам</Emphasis> люди більше і впевненіше
    {' '}контриб'ютять навіть у <Emphasis color="orange">незнайомі кодбази</Emphasis>
  </>,
  <>
    рев'ювери відчувають <Emphasis color="green">несправедливість</Emphasis>
    {' '}через диспропорцію вкладеного часу 
    {' '}— людські рев'ю стають <Emphasis color="orange">штампами</Emphasis>,
    {' '}а AI агенти стигматизуються
  </>,
  <>
    AI-рев'ю <Emphasis color="green">дозволяє</Emphasis> людині зосередитися
    {' '}на складних питаннях (навіщо? як?), а агент набагато ретельніше
    {' '}перевірить саме код
  </>,
];

const SECOND_SET: ReactNode[] = [
  <>
    ми зробили <Emphasis color="green">власного код рев'ю агента</Emphasis>
    {' '}на базі Claude Code (плюс частково Codex) —
    {' '}<Emphasis color="orange">чому не взяли щось вже готове?</Emphasis>
  </>,
  <>
    <Emphasis color="green">Claude</Emphasis>
    {' '} — <Emphasis color="orange">дорого</Emphasis> (і його не існувало ще коли ми починали)
  </>,
  <>
    <Emphasis color="green">Copilot</Emphasis>
    {' '} — <Emphasis color="orange">погано</Emphasis>
  </>,
  <>
    <Emphasis color="green">Codex</Emphasis>, <Emphasis color="green">Code Rabbit</Emphasis>
    {' '} — не так погано, але працює тільки в <Emphasis color="orange">GitHub</Emphasis>
  </>,
];

export const AiCodeReviewSlide: SlideDefinition = {
  id: 'ai-code-review',
  // Stages 0..2 walk through FIRST_SET bullets one-by-one; stage 3 swaps to
  // the SECOND_SET single bullet alongside the in-house agent screenshot.
  maxRevealStages: FIRST_SET.length + SECOND_SET.length - 1,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">fight fire</span>{' '}
      <span className="text-orange">with fire</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => {
    const setIndex = revealStage < FIRST_SET.length ? 0 : 1;
    const currentSet = setIndex === 0 ? FIRST_SET : SECOND_SET;
    const visibleCount =
      setIndex === 0 ? revealStage + 1 : revealStage - FIRST_SET.length + 1;

    return (
      <div
        key={setIndex}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: setIndex === 0 ? 0 : '2rem',
          minHeight: 0,
          height: '100%',
        }}
      >
        {/* Bullets — full-width during phase 1, half-width once the
            in-house code-review screenshot enters the layout. */}
        <div
          style={{
            flex: setIndex === 0 ? 1 : '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            textAlign: 'left',
          }}
        >
          {currentSet.slice(0, visibleCount).map((bullet, i) => (
            <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
          ))}
        </div>

        {/* Right — per-tool review screenshots. Each one fades in as its
            matching bullet appears (Claude → Copilot → Codex), stacking
            vertically. Slots share remaining height equally via flex. */}
        {setIndex === 1 && (
          <div
            style={{
              flex: 1,
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              minHeight: 0,
            }}
          >
            <style>{`
              @keyframes ai-code-review-fade-in {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            {TOOL_SCREENSHOTS.map((src, i) => {
              // Bullet i is visible when (i + 1) <= visibleCount, i.e. when
              // revealStage >= FIRST_SET.length + i. Skip the intro slot.
              if (!src || i >= visibleCount) return null;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    animation: 'ai-code-review-fade-in 0.45s ease-out both',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
  notes:
    'AI code review. Stages 0–2 (full-width column): обсяг AI-змін → людські рев\'ю стають штампами → AI-рев\'ю дозволяє людині фокус на складних питаннях. Stage 3 (split layout): Anthropic code.claude.com + наш власний агент на Claude Code (+Codex), поряд із скріншотом нашого in-house рев\'ю-агента.',
};
