import { SlideDefinition } from '../types/slides';
import { Code, Quote, SlideItem } from '../components/SlideElements';

export const CodeSlopSlide: SlideDefinition = {
  id: 'code-slop',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">без</span>{' '}
      <span className="text-orange">слопу</span>
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
          коли робимо UI зміни — додаємо{' '}
          <Quote>use frontend-design skill to create well-crafted ui/ux</Quote>
        </SlideItem>

        {revealStage >= 1 && (
          <SlideItem delay={0}>
            досліджуємо <Code>anthropics/claude-code</Code> маркетплейс
          </SlideItem>
        )}

        {revealStage >= 2 && (
          <SlideItem delay={0}>
            просимо{' '}
            <Quote>take a look how similar functionality is already implemented in the repo and follow the same patterns</Quote>
          </SlideItem>
        )}

        {revealStage >= 3 && (
          <SlideItem delay={0}>
            якщо Claude помиляється — виправляємо так:{' '}
            <Quote>instead do X and remember this in CLAUDE.md</Quote>
          </SlideItem>
        )}

        {revealStage >= 4 && (
          <SlideItem delay={0}>
            додаємо{' '}
            <Quote>ask questions first — never assume, use AskUserQuestion tool</Quote>{' '}
            у свій CLAUDE.md
          </SlideItem>
        )}
      </div>
    </>
  ),
  maxRevealStages: 4,
  notes:
    'Як уникати code slop: frontend-design skill для UI, плагіни з маркетплейсу, патерни з репозиторію, виправляти помилки через CLAUDE.md, питати замість вгадувати',
};
