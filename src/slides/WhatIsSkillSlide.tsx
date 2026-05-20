import { SlideDefinition } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import spaceBg from '../assets/skill-space-bg.png?url';
import leftAstronaut from '../assets/skill-was-it-md.png?url';
import rightAstronaut from '../assets/skill-always-been.png?url';

// Slide-level backdrop: dim the nebula so the green/orange terminal copy
// retains contrast, then let the actual nebula bleed full-edge. Layered
// gradient sits ABOVE the image (CSS draws backgrounds top→bottom).
const SLIDE_BG = `
  linear-gradient(180deg,
    rgba(10, 14, 20, 0.62) 0%,
    rgba(10, 14, 20, 0.38) 45%,
    rgba(10, 14, 20, 0.62) 100%
  ),
  url(${spaceBg}) center/cover no-repeat
`;

export const WhatIsSkillSlide: SlideDefinition = {
  id: 'what-is-skill',
  background: SLIDE_BG,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">але головне, що має бути в маркетплейсі</span>{' '}—{' '}
      <span className="text-orange">скіли</span>
    </>
  ),
  content: ({ revealStage }) => {
    // Sliding window: keep only the last 3 revealed bullets on screen so the
    // newest point always has room. Older bullets have already been spoken;
    // dropping them protects font legibility on a 1920×1080 projector.
    const WINDOW = 3;
    const firstVisible = Math.max(0, revealStage - WINDOW + 1);
    const isVisible = (i: number) => revealStage >= i && i >= firstVisible;

    return (
      <>
        <style>{`
          @keyframes astronautFloat {
            0%, 100% { transform: translateY(0px)   rotate(-2deg); }
            50%       { transform: translateY(-14px) rotate(2deg); }
          }
          @keyframes astronautFloatReverse {
            0%, 100% { transform: translateY(0px)   rotate(2deg); }
            50%       { transform: translateY(-14px) rotate(-2deg); }
          }
          .what-is-skill__astro {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
            mix-blend-mode: screen;
            filter: drop-shadow(0 8px 28px rgba(0, 0, 0, 0.55));
            pointer-events: none;
          }
        `}</style>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '22% 1fr 22%',
            alignItems: 'center',
            height: 'calc(var(--vh-full) - 220px)',
            width: '100%',
            gap: 'var(--space-md)',
          }}
        >
          {/* Left astronaut — full vertical run, no inner frame clipping */}
          <div style={{ height: '100%', minHeight: 0 }}>
            <img
              src={leftAstronaut}
              alt="wait, it's all .md files?"
              loading="lazy"
              className="what-is-skill__astro"
              style={{ animation: 'astronautFloat 6s ease-in-out infinite' }}
            />
          </div>

          {/* HUD-style bullet card — floats in the nebula */}
          <div
            style={{
              maxWidth: '780px',
              justifySelf: 'center',
              alignSelf: 'center',
              textAlign: 'left',
              padding: 'var(--space-md) var(--space-lg)',
              background:
                'linear-gradient(135deg, rgba(10, 14, 20, 0.72) 0%, rgba(20, 12, 36, 0.62) 100%)',
              border: '1px solid rgba(126, 231, 135, 0.18)',
              borderRadius: '6px',
              backdropFilter: 'blur(8px) saturate(140%)',
              WebkitBackdropFilter: 'blur(8px) saturate(140%)',
              boxShadow:
                '0 24px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            }}
          >
            {isVisible(0) && (
              <SlideItem size="normal" delay={revealStage === 0 ? 0.05 : 0}>
                скіл — це просто <Emphasis color="green">SKILL.md</Emphasis>-файл з
                інструкціями, як щось робити
              </SlideItem>
            )}

            {isVisible(1) && (
              <SlideItem size="normal" delay={0}>
                на відміну від <Emphasis color="orange">MCP server</Emphasis>, не
                займає context window — завантажується лише тоді, коли це
                потрібно моделі
              </SlideItem>
            )}

            {isVisible(2) && (
              <SlideItem size="normal" delay={0}>
                на відміну від <Emphasis color="orange">slash command</Emphasis>,
                модель сама викликає його, коли це потрібно
              </SlideItem>
            )}

            {isVisible(3) && (
              <SlideItem size="normal" delay={0}>
                може бути цілою <Emphasis color="green">бібліотекою</Emphasis>{' '}
                md-файлів із посиланнями — модель сама навігує та завантажує їх
                за потреби
              </SlideItem>
            )}

            {isVisible(4) && (
              <SlideItem size="normal" delay={0}>
                може містити{' '}
                <Emphasis color="green">TypeScript / Python / bash</Emphasis>{' '}
                скрипти для детермінованої автоматизації
              </SlideItem>
            )}

            {isVisible(5) && (
              <SlideItem size="normal" delay={0}>
                скіли — <Emphasis color="green">будівельні блоки</Emphasis>,
                {' '}з яких кожен інженер (або агент) може побудувати свій власний воркфлоу
              </SlideItem>
            )}

            {isVisible(6) && (
              <SlideItem size="normal" delay={0}>
                люди не люблять читати і писати документацію,
                {' '}а <Emphasis color="orange">агенти це обожнюють</Emphasis>
                {' '}— конвертуйте всю документацію в скіли
              </SlideItem>
            )}

            {isVisible(7) && (
              <SlideItem size="normal" delay={0}>
                кожен інженер, який використовує скіл із{' '}
                <Emphasis color="orange">маркетплейсу</Emphasis>, додає покращення
                {' '}— і всі стають <Emphasis color="green">продуктивнішими</Emphasis>
              </SlideItem>
            )}
          </div>

          {/* Right astronaut — mirror of the left, slightly slower drift */}
          <div style={{ height: '100%', minHeight: 0 }}>
            <img
              src={rightAstronaut}
              alt="always have been."
              loading="lazy"
              className="what-is-skill__astro"
              style={{
                animation: 'astronautFloatReverse 7s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </>
    );
  },
  maxRevealStages: 7,
  notes:
    'Скіл — це просто markdown. Не займає контекст (на відміну від MCP), модель сама вирішує коли його завантажувати (на відміну від slash command), може бути бібліотекою md з посиланнями, може містити TypeScript/Python/bash скрипти для детермінованої автоматизації. Sliding-window pattern: only the last 3 revealed bullets stay on screen so newer points have room without shrinking the body font.',
};
