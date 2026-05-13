import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2.5rem 1fr',
        alignItems: 'baseline',
        gap: '0.5rem',
        fontSize: '1.5rem',
        opacity: s.opacity,
        marginBottom: '0.5rem',
        lineHeight: 1.3,
      }}
    >
      <span style={{ color: s.prefixColor, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {s.prefix}
      </span>
      <span style={{ color: 'var(--terminal-white)' }}>{children}</span>
    </div>
  );
}

const BIO_ITEMS: { level: Level; content: ReactNode }[] = [
  { level: 'low',    content: <>починав як Java backend-інженер</> },
  { level: 'medium', content: <>потім: техлідив продуктові фічі</> },
  { level: 'medium', content: <>потім: техлід платформної організації</> },
  { level: 'high',   content: <>зараз: AI-first розробка</> },
];

export const BioSlide: SlideDefinition = {
  id: 'bio',
  title: (
    <>
      <span className="text-dim">&gt;</span> хто я
    </>
  ),
  maxRevealStages: BIO_ITEMS.length - 1,
  content: ({ revealStage }) => (
    <div className="bio-slide">
      <div className="bio-slide-content">
        <p
          style={{
            color: 'var(--terminal-orange)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            lineHeight: 1.15,
            fontSize: '1.5rem',
            margin: '0 0 1.75rem 0',
            textShadow: '0 0 16px rgba(240, 136, 62, 0.35)',
          }}
        >
          9 років у компанії Superhuman (раніше відомої як Grammarly)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {BIO_ITEMS.map((item, i) =>
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
