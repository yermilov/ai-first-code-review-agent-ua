import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';
import { tr, type Lang } from '../context/LanguageContext';

// What the review-consolidator agent does after all the per-lens findings
// come back. Distilled from claude-code-plugins/review/agents/review-consolidator.md.
const BULLETS_UK: ReactNode[] = [
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
    за замовчуванням відписуємо тільки щодо CRITICAL, додаємо <Emphasis color="orange">HIGH</Emphasis> і <Emphasis color="orange">MEDIUM</Emphasis> тільки, якщо є хоч один CRITICAL
  </>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>
    we collect comments from all the <Emphasis color="green">specialised agents</Emphasis>
    {' '}via <Code>TaskOutput</Code>
  </>,
  <>
    <Emphasis color="orange">deduplicate</Emphasis> findings
    {' '}on the same <Code>file:line</Code> (±3 lines)
  </>,
  <>
    each agent returns <Emphasis color="green">confidence and severity</Emphasis> — we use them
    {' '}to show only the issues we're sure about
  </>,
  <>
    by default we only post CRITICAL; <Emphasis color="orange">HIGH</Emphasis> and <Emphasis color="orange">MEDIUM</Emphasis> get added only if there's at least one CRITICAL
  </>,
];

function ReviewConsolidatorContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const BULLETS = tr(lang, BULLETS_UK, BULLETS_EN);
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
        height: '100%',
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
  maxRevealStages: BULLETS_UK.length - 1,
  title: ({ lang }: SlideContentProps) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">{tr(lang, 'а потім', 'and then')}</span>{' '}
      <span className="text-orange">{tr(lang, 'consolidator скіл', 'a consolidator skill')}</span>{' '}
      <span className="text-green">{tr(lang, 'збирає все докупи', 'pulls it all together')}</span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <ReviewConsolidatorContent revealStage={revealStage} lang={lang} />,
  notes:
    'Як review-consolidator зводить усі знахідки докупи: TaskOutput → дедуп по file:line (±3) → boost confidence при збігу (+10% / +20%) → severity-сорт (CRITICAL → HIGH → MEDIUM → LOW) → тайм-аути не блокують, публікуємо те, що встигли за 20 хвилин.',
};
