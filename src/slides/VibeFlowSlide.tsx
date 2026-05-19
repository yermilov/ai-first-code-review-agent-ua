import { SlideDefinition } from '../types/slides';
import { Code, SlideItem } from '../components/SlideElements';

// Command styling (orange code)
function Command({ children }: { children: string }) {
  return <code className="code-inline code-inline--orange">{children}</code>;
}

export const VibeFlowSlide: SlideDefinition = {
  id: 'vibe-flow',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">вайб</span>{' '}
      <span className="text-orange">flow</span>
    </>
  ),
  content: ({ revealStage }) => (
    <>
      <div
        style={{
          textAlign: 'left',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <SlideItem delay={0.05}>
          <Command>/clear</Command> чистимо сесію
        </SlideItem>

        {revealStage >= 1 && (
          <SlideItem delay={0}>
            переходимо у <Code>plan mode</Code>
          </SlideItem>
        )}

        {revealStage >= 2 && (
          <SlideItem delay={0}>описуємо фічу / баг, <span className="text-orange" style={{ textShadow: '0 0 8px rgba(240, 136, 62, 0.9), 0 0 20px rgba(240, 136, 62, 0.6), 0 0 40px rgba(240, 136, 62, 0.3)' }}>формуємо контекст</span></SlideItem>
        )}

        {revealStage >= 3 && (
          <SlideItem delay={0}>
            ітеруємося по плану
          </SlideItem>
        )}

        {revealStage >= 4 && (
          <SlideItem delay={0}>
            <Code>Yes, and use auto mode</Code>
          </SlideItem>
        )}

        {revealStage >= 5 && (
          <SlideItem delay={0}>
            <Command>/commit-push-pr</Command>
          </SlideItem>
        )}

        {revealStage >= 6 && (
          <SlideItem delay={0}>
            <Command>/clear</Command>
          </SlideItem>
        )}

        {revealStage >= 7 && (
          <SlideItem delay={0}>
            <Command>/simplify</Command> або <Command>/review</Command>
          </SlideItem>
        )}
      </div>
    </>
  ),
  maxRevealStages: 7,
  notes:
    'Воркфлоу: очистити сесію, plan mode, описати проблему, ітерувати по плану, auto-accept, коміт',
};
