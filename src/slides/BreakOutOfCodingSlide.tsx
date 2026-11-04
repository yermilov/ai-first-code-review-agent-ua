import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { tr } from '../context/LanguageContext';

function Prompt({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        color: 'var(--terminal-orange)',
        fontStyle: 'italic',
      }}
    >
      '{children}'
    </span>
  );
}

const LEFT_BULLETS_UK: ReactNode[] = [
  <>AI-агент, який генерує код — це дуже дорогий <Emphasis color="orange">автокомпліт</Emphasis></>,
  <>поставте собі ціль: робити <Emphasis color="green">все</Emphasis> за допомогою Claude Code</>,
  <>пріоритизуйте <Emphasis color="green">feedback loops</Emphasis></>,
  <>встановіть <Emphasis color="green">CLI</Emphasis> (не MCP!) для всього, чим користуєтеся</>,
  <>використовуйте <Emphasis color="green">Claude Chrome extension</Emphasis>, коли CLI немає</>,
];

// EN: own translation
const LEFT_BULLETS_EN: ReactNode[] = [
  <>an AI agent that only writes code is a very expensive <Emphasis color="orange">autocomplete</Emphasis></>,
  <>set yourself a goal: do <Emphasis color="green">everything</Emphasis> with Claude Code</>,
  <>prioritise <Emphasis color="green">feedback loops</Emphasis></>,
  <>install a <Emphasis color="green">CLI</Emphasis> (not MCP!) for every tool you use</>,
  <>use the <Emphasis color="green">Claude Chrome extension</Emphasis> when there's no CLI</>,
];

const PROMPTS: ReactNode[] = [
  <Prompt>hey claude, open github in chrome and generate ssh key for me</Prompt>,
  <Prompt>hey claude, configure dev environment for me</Prompt>,
  <Prompt>hey claude, here is a bug report I've received mycompany.slack.com/archives/p1778239</Prompt>,
];

export const BreakOutOfCodingSlide: SlideDefinition = {
  id: 'break-out-of-coding',
  title: ({ lang }) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">{tr(lang, 'не тільки', 'not just')}</span>{' '}
      <span className="text-orange">{tr(lang, 'кодинг', 'coding')}</span>
    </>
  ),
  content: ({ revealStage, lang }) => (
    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
      {/* Left column: Ukrainian conceptual bullets */}
      <div
        style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          textAlign: 'left',
        }}
      >
        {tr(lang, LEFT_BULLETS_UK, LEFT_BULLETS_EN).map((bullet, i) =>
          revealStage >= i ? (
            <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
          ) : null,
        )}
      </div>

      {/* Right column: English Claude prompts */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          textAlign: 'left',
        }}
      >
        {PROMPTS.map((prompt, i) =>
          revealStage >= LEFT_BULLETS_UK.length + i ? (
            <SlideItem key={i} delay={0}>{prompt}</SlideItem>
          ) : null,
        )}
      </div>
    </div>
  ),
  maxRevealStages: LEFT_BULLETS_UK.length + PROMPTS.length - 1,
  notes:
    'Один пункт на reveal. Ліва колонка: кодинг — це автозаповнення; ціль — робити все з Claude Code; feedback loops; CLI замість MCP; Chrome extension як escape hatch. Права колонка: конкретні приклади промптів через стадії SDLC.',
};
