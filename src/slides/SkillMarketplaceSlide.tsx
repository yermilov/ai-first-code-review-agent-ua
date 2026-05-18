import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import superhumanAidevImage from '../assets/superhuman-aidev.png?url';

// Ported from dou-days-2026 #slide-13, second half only — the DIY/symlink
// pre-marketplace bullets were dropped; we keep just the four Anthropic-
// marketplace bullets and the Superhuman AI Dev screenshot on the right.
const BULLETS: ReactNode[] = [
  <>Anthropic має <Emphasis color="green">marketplaces</Emphasis> — гіт репозиторії які claude code викачує регулярно і лінкує</>,
  <>створіть ОДИН центральний внутрішній <Emphasis color="orange">marketplace</Emphasis> у вашій організації</>,
  <>використовуйте плагіни для <Emphasis color="orange">неймспейсингу</Emphasis> — кожен користувач сам обирає, які плагіни встановити</>,
  <>якщо є можливість — використовуйте <Emphasis color="green">Claude Enterprise</Emphasis>, щоб примусово встановити marketplace і певні плагіни всім в організації</>,
];

export const SkillMarketplaceSlide: SlideDefinition = {
  id: 'skill-marketplace',
  // 4 bullets across reveal stages 0..3.
  maxRevealStages: BULLETS.length - 1,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">як шарити між</span>{' '}
      <span className="text-orange">агентами і людьми?</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => {
    const visibleCount = revealStage + 1;

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '2rem',
          minHeight: 0,
          height: 'calc(var(--vh-full) - 220px)',
        }}
      >
        {/* Bullets — half-width column on the left */}
        <div
          style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            textAlign: 'left',
          }}
        >
          {BULLETS.slice(0, visibleCount).map((bullet, i) => (
            <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
          ))}
        </div>

        {/* Right — Superhuman AI Dev marketplace screenshot */}
        <div
          style={{
            flex: 1,
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10, 14, 20, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow:
              '0 18px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
          }}
        >
          <img
            src={superhumanAidevImage}
            alt="Superhuman AI Dev marketplace"
            loading="lazy"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  },
  notes:
    'Anthropic нативні marketplaces — створи один внутрішній marketplace, використовуй плагіни для неймспейсингу, Enterprise-контролі для примусового встановлення. Праворуч — скріншот нашого Superhuman AI Dev marketplace.',
};
