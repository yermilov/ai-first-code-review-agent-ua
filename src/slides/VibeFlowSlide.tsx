import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { Code, SlideItem, revealWindow } from '../components/SlideElements';
import { tr } from '../context/LanguageContext';

// Command styling (orange code)
function Command({ children }: { children: string }) {
  return <code className="code-inline code-inline--orange">{children}</code>;
}

const GLOW_STYLE = { textShadow: '0 0 8px color-mix(in srgb, var(--terminal-orange) 90%, transparent), 0 0 20px color-mix(in srgb, var(--terminal-orange) 60%, transparent), 0 0 40px color-mix(in srgb, var(--terminal-orange) 30%, transparent)' };

const STEPS_UK: ReactNode[] = [
  <><Command>/clear</Command> чистимо сесію</>,
  <>переходимо у <Code>plan mode</Code></>,
  <>описуємо фічу / баг, <span className="text-orange" style={GLOW_STYLE}>формуємо контекст</span></>,
  <>ітеруємося по плану</>,
  <><Code>Yes, and use auto mode</Code></>,
  <><Command>/commit-push-pr</Command></>,
  <><Command>/clear</Command></>,
  <><Command>/simplify</Command> або <Command>/review</Command></>,
];

// EN: own translation
const STEPS_EN: ReactNode[] = [
  <><Command>/clear</Command> to start a fresh session</>,
  <>switch to <Code>plan mode</Code></>,
  <>describe the feature / bug, <span className="text-orange" style={GLOW_STYLE}>build the context</span></>,
  <>iterate on the plan</>,
  <><Code>Yes, and use auto mode</Code></>,
  <><Command>/commit-push-pr</Command></>,
  <><Command>/clear</Command></>,
  <><Command>/simplify</Command> or <Command>/review</Command></>,
];

export const VibeFlowSlide: SlideDefinition = {
  id: 'vibe-flow',
  title: ({ lang }) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">{tr(lang, 'вайб', 'vibe')}</span>{' '}
      <span className="text-orange">flow</span>
    </>
  ),
  // Every step is laid out from stage 0 and hidden until revealed, so a
  // reveal never moves what is already on screen.
  content: ({ revealStage, lang }) => (
    <>
      <div
        style={{
          textAlign: 'left',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {revealWindow(tr(lang, STEPS_UK, STEPS_EN), revealStage + 1).map(({ item, index, hidden }) => (
          <SlideItem key={index} delay={index === 0 ? 0.05 : 0} hidden={hidden}>
            {item}
          </SlideItem>
        ))}
      </div>
    </>
  ),
  maxRevealStages: STEPS_UK.length - 1,
  notes:
    'Воркфлоу: очистити сесію, plan mode, описати проблему, ітерувати по плану, auto-accept, коміт',
};
