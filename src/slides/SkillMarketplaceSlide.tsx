import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { T, tr } from '../context/LanguageContext';
import superhumanAidevImage from '../assets/superhuman-aidev.png?url';

// Ported from dou-days-2026 #slide-13, second half only — the DIY/symlink
// pre-marketplace bullets were dropped; we keep just the four Anthropic-
// marketplace bullets and the Superhuman AI Dev screenshot on the right.
const BULLETS_UK: ReactNode[] = [
  <>Anthropic має <Emphasis color="green">marketplaces</Emphasis> — гіт репозиторії, які Claude Code регулярно завантажує і лінкує</>,
  <>створіть ОДИН центральний внутрішній <Emphasis color="orange">marketplace</Emphasis> у вашій організації</>,
  <>використовуйте плагіни для <Emphasis color="orange">неймспейсингу</Emphasis> — кожен користувач сам обирає, які плагіни встановити</>,
  <>якщо є можливість — використовуйте <Emphasis color="green">Claude Enterprise</Emphasis>, щоб примусово встановити marketplace і певні плагіни всім в організації</>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>Anthropic has <Emphasis color="green">marketplaces</Emphasis> — git repos that Claude Code pulls and links on a schedule</>,
  <>create ONE central internal <Emphasis color="orange">marketplace</Emphasis> for your organisation</>,
  <>use plugins for <Emphasis color="orange">namespacing</Emphasis> — every user picks which plugins to install</>,
  <>if you can — use <Emphasis color="green">Claude Enterprise</Emphasis> to force-install the marketplace and selected plugins for the whole organisation</>,
];

export const SkillMarketplaceSlide: SlideDefinition = {
  id: 'skill-marketplace',
  // 4 bullets across reveal stages 0..3.
  maxRevealStages: BULLETS_UK.length - 1,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="як шарити між" en="how to share between" /></span>{' '}
      <span className="text-orange"><T uk="агентами і людьми?" en="agents and humans?" /></span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => {
    const BULLETS = tr(lang, BULLETS_UK, BULLETS_EN);
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
            background: 'color-mix(in srgb, var(--terminal-bg) 55%, transparent)',
            border: '1px solid color-mix(in srgb, var(--terminal-pure-white) 12%, transparent)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow:
              '0 18px 48px color-mix(in srgb, var(--terminal-black) 60%, transparent), inset 0 1px 0 color-mix(in srgb, var(--terminal-pure-white) 6%, transparent)',
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
