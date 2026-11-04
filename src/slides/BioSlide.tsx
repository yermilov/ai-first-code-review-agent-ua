import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { tr } from '../context/LanguageContext';
import yarikBadges from '../assets/yarik-badges.jpg?url';

type Level = 'high' | 'medium' | 'low';

const levelStyles: Record<Level, { prefix: string; prefixColor: string; opacity: number }> = {
  high: {
    prefix: '>>',
    prefixColor: 'var(--terminal-orange)',
    opacity: 1,
  },
  medium: {
    prefix: '> ',
    prefixColor: 'var(--terminal-blue)',
    opacity: 1,
  },
  low: {
    prefix: '--',
    prefixColor: 'var(--terminal-white-dim)',
    opacity: 0.85,
  },
};

function BioItem({ level, children }: { level: Level; children: React.ReactNode }) {
  const s = levelStyles[level];

  return (
    <div className="bio-item" style={{ opacity: s.opacity }}>
      <span className="bio-item__prefix" style={{ color: s.prefixColor }}>
        {s.prefix}
      </span>
      <span style={{ color: 'var(--terminal-white)' }}>{children}</span>
    </div>
  );
}

const BIO_ITEMS_UK: { level: Level; content: ReactNode }[] = [
  { level: 'low',    content: <>починав як Java backend-інженер</> },
  { level: 'medium', content: <>потім: техлідив продуктові фічі</> },
  { level: 'medium', content: <>потім: техлід платформної організації</> },
  { level: 'high',   content: <>зараз: AI-first розробка</> },
];

// EN: own translation
const BIO_ITEMS_EN: { level: Level; content: ReactNode }[] = [
  { level: 'low',    content: <>started as a Java backend engineer</> },
  { level: 'medium', content: <>then: tech lead on product features</> },
  { level: 'medium', content: <>then: tech lead of a platform org</> },
  { level: 'high',   content: <>now: AI-first development</> },
];

export const BioSlide: SlideDefinition = {
  id: 'bio',
  title: ({ lang }) => (
    <>
      <span className="text-dim">&gt;</span> {tr(lang, 'хто я', 'whoami')}
    </>
  ),
  maxRevealStages: BIO_ITEMS_UK.length - 1,
  content: ({ revealStage, lang }) => (
    <div className="bio-slide">
      <div className="bio-slide-content">
        <p className="bio-subtitle">
          {tr(
            lang,
            '9 років у компанії Superhuman (раніше відомої як Grammarly)',
            // EN: own translation
            '9 years at Superhuman (formerly known as Grammarly)',
          )}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tr(lang, BIO_ITEMS_UK, BIO_ITEMS_EN).map((item, i) =>
            revealStage >= i ? (
              <BioItem key={i} level={item.level}>{item.content}</BioItem>
            ) : null,
          )}
        </div>
      </div>
      <img
        src={yarikBadges}
        alt="Grammarly badges"
        className="bio-slide-image"
        style={{ maxWidth: '480px' }}
        loading="lazy"
      />
    </div>
  ),
};
