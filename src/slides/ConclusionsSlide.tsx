import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';

// One reveal at a time. Stages 0..3 are two-column (text left, TBD-graph
// placeholder right). Stage 4 (final) is text-only, full width — that's the
// punchline question, so we want it to breathe.
type Conclusion = {
  key: string;
  text: ReactNode;
  hasGraph: boolean;
  /** Optional short caption shown inside the graph placeholder panel. */
  graphCaption?: string;
};

const CONCLUSIONS: Conclusion[] = [
  {
    key: 'time-shift',
    text: (
      <>
        час на <Emphasis color="green">початок ревю</Emphasis>{' '}
        <Emphasis color="green">падає</Emphasis>,
        {' '}а на <Emphasis color="orange">завершення ревю</Emphasis>{' '}
        <Emphasis color="orange">росте</Emphasis>
      </>
    ),
    hasGraph: true,
    graphCaption: 'time-to-first-review vs. time-to-merge',
  },
  {
    key: 'time-psychology',
    text: (
      <>
        <Emphasis color="green">психологія часу</Emphasis>:
        {' '}очікування людини боляче, очікування агента — ні
      </>
    ),
    hasGraph: true,
    graphCaption: 'perceived wait time, human vs. agent',
  },
  {
    key: 'vibes-metrics',
    text: (
      <>
        <Emphasis color="green">вайби</Emphasis>{' '}
        — <Emphasis color="orange">найкращі метрики</Emphasis>:
        {' '}людям подобається ≠ ось 47 KPI
      </>
    ),
    hasGraph: true,
    graphCaption: 'NPS / sentiment survey',
  },
  {
    key: 'costs',
    text: (
      <>
        <Emphasis color="orange">кости</Emphasis>{' '}
        — <Emphasis color="orange">велика проблема</Emphasis>:
        {' '}кожен MR коштує грошей, і вони ростуть з мірою деку
      </>
    ),
    hasGraph: true,
    graphCaption: '$ per MR over time',
  },
  {
    key: 'human-approver',
    text: (
      <>
        <Emphasis color="green">людина</Emphasis>{' '}
        залишається <Emphasis color="green">головним апрувером</Emphasis>{' '}
        — але, можливо, нам потрібен{' '}
        <Emphasis color="orange">абсолютно новий процес?</Emphasis>
      </>
    ),
    hasGraph: false,
  },
];

const STYLES = `
  @keyframes conclusionPanelIn {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes conclusionTextIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .conclusions-stage {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-md);
    width: 100%;
  }

  .conclusions-title {
    text-align: left;
    margin: 0;
  }

  /* Two-column row: text left, TBD-graph right. When hasGraph is false the
     text column expands to full width. */
  .conclusions-row {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 2rem;
  }

  .conclusions-row--solo .conclusions-text {
    flex: 1 1 100%;
    justify-content: center;
    text-align: center;
    font-size: var(--slide-text-large, 2.2rem);
    padding: 0 var(--space-xl);
  }

  .conclusions-text {
    flex: 0 0 40%;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: var(--slide-text-normal);
    animation: conclusionTextIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .conclusions-graph {
    flex: 1 1 60%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    overflow: hidden;
    border-radius: 14px;
    background:
      repeating-linear-gradient(
        45deg,
        rgba(126, 231, 135, 0.03) 0 8px,
        rgba(10, 14, 20, 0.6) 8px 16px
      );
    border: 1px dashed rgba(126, 231, 135, 0.45);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(126, 231, 135, 0.06);
    padding: var(--space-md);
    animation: conclusionPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .conclusions-graph__label {
    font-family: var(--font-mono);
    font-size: var(--slide-text-compact);
    color: var(--terminal-orange);
    letter-spacing: 0.08em;
    text-shadow: 0 0 8px rgba(240, 136, 62, 0.35);
  }

  .conclusions-graph__caption {
    font-family: var(--font-mono);
    font-size: var(--slide-text-dense);
    color: rgba(226, 232, 240, 0.5);
    text-align: center;
    max-width: 80%;
  }
`;

function ConclusionsContent({ revealStage }: { revealStage: number }) {
  const idx = Math.min(revealStage, CONCLUSIONS.length - 1);
  const c = CONCLUSIONS[idx];

  return (
    <>
      <style>{STYLES}</style>

      <div className="conclusions-stage">
        <h2 className="conclusions-title">
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">деякі</span>{' '}
          <span className="text-orange">висновки</span>
        </h2>

        <div
          className={`conclusions-row ${c.hasGraph ? '' : 'conclusions-row--solo'}`}
        >
          <div key={`text-${c.key}`} className="conclusions-text">
            <SlideItem>{c.text}</SlideItem>
          </div>

          {c.hasGraph && (
            <div key={`graph-${c.key}`} className="conclusions-graph">
              <div className="conclusions-graph__label">
                <Code>TBD</Code> графік
              </div>
              {c.graphCaption && (
                <div className="conclusions-graph__caption">
                  // {c.graphCaption}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const ConclusionsSlide: SlideDefinition = {
  id: 'conclusions',
  // 5 reveal stages (0..4) → maxRevealStages = 4
  maxRevealStages: CONCLUSIONS.length - 1,
  initialRevealStage: 0,
  content: ({ revealStage }: SlideContentProps) => (
    <ConclusionsContent revealStage={revealStage} />
  ),
  notes:
    'Висновки секції про код-рев\'ю агента. One-reveal-at-a-time: попередні булети ховаємо, щоб поточний дихав. Reveal 1: time-to-first-review падає, time-to-merge росте. 2: психологія часу — людина чекає боляче, агент ні. 3: вайби — найкраща метрика, ніяких 47 KPI. 4: кости — велика проблема, $ за MR ростуть з деку. 5 (фінальний, без графіка, повна ширина): людина — головний апрувер, але, можливо, потрібен абсолютно новий процес? Графіки на стейджах 1-4 — TBD placeholder з диагональними штрихами і dashed border, додати реальні дані пізніше.',
};
