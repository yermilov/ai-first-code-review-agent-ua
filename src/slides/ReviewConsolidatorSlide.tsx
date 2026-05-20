import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';

// What the review-consolidator agent does after all the per-lens findings
// come back. Distilled from claude-code-plugins/review/agents/review-consolidator.md.
const BULLETS: ReactNode[] = [
  <>
    отримуємо коментарі від усіх <Emphasis color="green">спеціалізованих агентів</Emphasis>
    {' '}через <Code>TaskOutput</Code>
  </>,
  <>
    <Emphasis color="orange">дедуплікуємо</Emphasis> знахідки
    {' '}на однаковому <Code>file:line</Code> (±3 рядки)
  </>,
  <>
    кожен агент повертає <Emphasis color="green">впевненість і критичність</Emphasis> - використовуємо їх,
    {' '}щоб показувати тільки проблеми, в яких ми впевнені
  </>,
  <>
    за замовчуванням відписуємо тільки про CRITICAL, додаємо <Emphasis color="orange">HIGH</Emphasis> і <Emphasis color="orange">MEDIUM</Emphasis> тільки якщо є хоч один CRITICAL
  </>,
];

function ReviewConsolidatorContent({ revealStage }: { revealStage: number }) {
  const visibleCount = Math.min(revealStage + 1, BULLETS.length);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        textAlign: 'left',
        minHeight: 0,
        height: 'calc(var(--vh-full) - 220px)',
      }}
    >
      {BULLETS.slice(0, visibleCount).map((bullet, i) => (
        <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
      ))}
    </div>
  );
}

export const ReviewConsolidatorSlide: SlideDefinition = {
  id: 'review-consolidator',
  maxRevealStages: BULLETS.length - 1,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">а потім</span>{' '}
      <span className="text-orange">consolidator скіл</span>{' '}
      <span className="text-green">збирає все докупи</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <ReviewConsolidatorContent revealStage={revealStage} />,
  notes:
    'Як review-consolidator зводить усі знахідки докупи: TaskOutput → дедуп по file:line (±3) → boost confidence при збігу (+10% / +20%) → severity-сорт (CRITICAL → HIGH → MEDIUM → LOW) → тайм-аути не блокують, публікуємо те, що встигли за 20 хвилин.',
};
