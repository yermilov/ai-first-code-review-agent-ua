import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { Emphasis, SlideItem } from '../components/SlideElements';
import { PacManCanvas } from '../components/pacman/PacManCanvas';

const BULLETS: ReactNode[] = [
  <>
    Claude Code збільшує <Emphasis>об&apos;єм</Emphasis> роботи, не{' '}
    <Emphasis color="orange">швидкість</Emphasis>
  </>,
  <>
    самостійно ви напишете код або <Emphasis color="orange">краще</Emphasis>,
    або <Emphasis color="orange">швидше</Emphasis>
  </>,
  <>
    дивитися, як Клод працює в терміналі —{' '}
    <Emphasis color="orange">втрата продуктивності і грошей</Emphasis>
  </>,
  <>
    знайдіть 2–3 завдання, які можна довірити Клоду із мінімальним наглядом, а{' '}
    <Emphasis color="orange">самі переключіться на те завдання, де необхідна вся ваша увага</Emphasis>
  </>,
  <>
    ну або запустіть Клода і <Emphasis>відпочиньте</Emphasis>
  </>,
];

export const ImportantSlide: SlideDefinition = {
  id: 'important',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">ще одна</span>{' '}
      <span className="text-orange">порада</span>
    </>
  ),
  content: ({ revealStage }) => {
    const idx = Math.min(revealStage, BULLETS.length - 1);
    return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-xl)',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Left column — one bullet at a time, swapped on reveal */}
      <div
        style={{
          flex: '1 1 60%',
          maxWidth: '900px',
          textAlign: 'left',
        }}
      >
        <SlideItem key={idx} delay={0.05}>
          {BULLETS[idx]}
        </SlideItem>
      </div>

      {/* Right column — Pac-Man animation. Drive size from parent height so
       * the 4:3 canvas always fits inside the title-band layout instead of
       * overflowing and getting clipped by the row's overflow: hidden. */}
      <div
        style={{
          flex: '0 0 auto',
          height: '100%',
          aspectRatio: '320 / 240',
        }}
      >
        <PacManCanvas revealStage={revealStage} />
      </div>
    </div>
    );
  },
  maxRevealStages: 4,
  notes:
    "Перевірка реальності з 8-bit Pac-Man анімацією. 5 reveal-стадій: 0 — Claude дає об'єм, не швидкість; 1 — самостійно ефективніше; 2 — дивитися = втрата продуктивності; 3 — делегуйте 2-3, фокусуйтесь на одній; 4 — запустіть і йдіть відпочити.",
};
