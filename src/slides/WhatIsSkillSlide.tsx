import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { SlideItem, Emphasis, revealWindow } from '../components/SlideElements';
import { tr } from '../context/LanguageContext';
import spaceBg from '../assets/skill-space-bg.png?url';
import leftAstronaut from '../assets/skill-was-it-md.png?url';
import rightAstronaut from '../assets/skill-always-been.png?url';

// Slide-level backdrop: dim the nebula so the green/orange terminal copy
// retains contrast, then let the actual nebula bleed full-edge. Layered
// gradient sits ABOVE the image (CSS draws backgrounds top→bottom).
const SLIDE_BG = `
  linear-gradient(180deg,
    color-mix(in srgb, var(--terminal-bg) 62%, transparent) 0%,
    color-mix(in srgb, var(--terminal-bg) 38%, transparent) 45%,
    color-mix(in srgb, var(--terminal-bg) 62%, transparent) 100%
  ),
  url(${spaceBg}) center/cover no-repeat
`;

const BULLETS_UK: ReactNode[] = [
  <>скіл — це просто <Emphasis color="green">SKILL.md</Emphasis>-файл з інструкціями, як щось робити</>,
  <>на відміну від <Emphasis color="orange">MCP server</Emphasis>, не займає context window — завантажується лише тоді, коли це потрібно моделі</>,
  <>на відміну від <Emphasis color="orange">slash command</Emphasis>, модель сама викликає його, коли це потрібно</>,
  <>може бути цілою <Emphasis color="green">бібліотекою</Emphasis>{' '}md-файлів із посиланнями — модель сама навігує та завантажує їх за потреби</>,
  <>може містити{' '}<Emphasis color="green">TypeScript / Python / bash</Emphasis>{' '}скрипти для детермінованої автоматизації</>,
  <>скіли — <Emphasis color="green">будівельні блоки</Emphasis>,{' '}з яких кожен інженер (або агент) може побудувати свій власний воркфлоу</>,
  <>люди не люблять читати і писати документацію,{' '}а <Emphasis color="orange">агенти це обожнюють</Emphasis>{' '}— конвертуйте всю документацію в скіли</>,
  <>кожен інженер, який використовує скіл із{' '}<Emphasis color="orange">маркетплейсу</Emphasis>, додає покращення{' '}— і всі стають <Emphasis color="green">продуктивнішими</Emphasis></>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>a skill is just a <Emphasis color="green">SKILL.md</Emphasis> file with instructions for how to do something</>,
  <>unlike an <Emphasis color="orange">MCP server</Emphasis>, it doesn't sit in the context window — it loads only when the model needs it</>,
  <>unlike a <Emphasis color="orange">slash command</Emphasis>, the model invokes it on its own, when it needs it</>,
  <>it can be a whole <Emphasis color="green">library</Emphasis> of linked md files — the model navigates and loads them as needed</>,
  <>it can ship{' '}<Emphasis color="green">TypeScript / Python / bash</Emphasis>{' '}scripts for deterministic automation</>,
  <>skills are <Emphasis color="green">building blocks</Emphasis> every engineer (or agent) can assemble their own workflow from</>,
  <>people hate reading and writing docs,{' '}but <Emphasis color="orange">agents love it</Emphasis>{' '}— turn all your docs into skills</>,
  <>every engineer who uses a skill from the <Emphasis color="orange">marketplace</Emphasis> adds an improvement{' '}— and everyone gets <Emphasis color="green">more productive</Emphasis></>,
];

export const WhatIsSkillSlide: SlideDefinition = {
  id: 'what-is-skill',
  background: SLIDE_BG,
  title: ({ lang }) => tr(lang,
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">але головне, що має бути в маркетплейсі</span>{' '}—{' '}
      <span className="text-orange">скіли</span>
    </>,
    // EN: own translation
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">but what the marketplace really needs is</span>{' '}
      <span className="text-orange">skills</span>
    </>,
  ),
  content: ({ revealStage, lang }) => {
    // Sliding window: keep only the last 3 revealed bullets on screen so the
    // newest point always has room. Older bullets have already been spoken;
    // dropping them protects font legibility on a 1920×1080 projector.
    // Before the window fills, not-yet-revealed bullets keep their slot
    // hidden, so each one appears where it stays.
    const WINDOW = 3;
    const bullets = tr(lang, BULLETS_UK, BULLETS_EN);

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
            filter: drop-shadow(0 8px 28px color-mix(in srgb, var(--terminal-black) 55%, transparent));
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
                'linear-gradient(135deg, color-mix(in srgb, var(--terminal-bg) 72%, transparent) 0%, color-mix(in srgb, color-mix(in srgb, var(--terminal-purple) 10%, var(--terminal-black)) 62%, transparent) 100%)',
              border: '1px solid color-mix(in srgb, var(--terminal-green) 18%, transparent)',
              borderRadius: '6px',
              backdropFilter: 'blur(8px) saturate(140%)',
              WebkitBackdropFilter: 'blur(8px) saturate(140%)',
              boxShadow:
                '0 24px 64px color-mix(in srgb, var(--terminal-black) 55%, transparent), inset 0 1px 0 color-mix(in srgb, var(--terminal-pure-white) 6%, transparent)',
            }}
          >
            {revealWindow(bullets, revealStage + 1, WINDOW).map(({ item, index, hidden }) => (
              <SlideItem key={index} size="normal" hidden={hidden} delay={index === 0 && revealStage === 0 ? 0.05 : 0}>
                {item}
              </SlideItem>
            ))}
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
  maxRevealStages: BULLETS_UK.length - 1,
  notes:
    'Скіл — це просто markdown. Не займає контекст (на відміну від MCP), модель сама вирішує коли його завантажувати (на відміну від slash command), може бути бібліотекою md з посиланнями, може містити TypeScript/Python/bash скрипти для детермінованої автоматизації. Sliding-window pattern: only the last 3 revealed bullets stay on screen so newer points have room without shrinking the body font.',
};
