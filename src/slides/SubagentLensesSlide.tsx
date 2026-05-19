import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';
import prTestAnalyzerImg from '../assets/subagent-comments/pr-test-analyzer.png?url';
import accessibilityReviewerImg from '../assets/subagent-comments/accessibility-reviewer.png?url';
import designSystemReviewerImg from '../assets/subagent-comments/design-system-reviewer.png?url';
import claudeMdReviewerImg from '../assets/subagent-comments/claude-md-reviewer.png?url';
import claudeMetaReviewerImg from '../assets/subagent-comments/claude-meta-reviewer.png?url';
import skillReviewerJavaHttpImg from '../assets/subagent-comments/skill-reviewer-java-http-client.png?url';
import skillReviewerReactInteractionImg from '../assets/subagent-comments/skill-reviewer-react-interaction-tests.png?url';
import codexImg from '../assets/subagent-comments/codex.png?url';

// One entry per reveal stage. Bullet = short "what this lens looks for".
// Panel = screenshot of the real GitLab/GitHub comment that this sub-agent
// surfaced on a Grammarly MR/PR (matched by file+line in the mango session log).
type Lens = {
  key: string;
  bullet: ReactNode;
  src: string;
  alt: string;
};

const LENSES: Lens[] = [
  {
    key: 'pr-test-analyzer',
    bullet: (
      <>
        <Code>pr-test-analyzer</Code>{' '}
        — <Emphasis color="green">прогалини в тестовому покритті</Emphasis>:
        {' '}гілки, які ніхто не покрив, missing assertions, fragile стаби
      </>
    ),
    src: prTestAnalyzerImg,
    alt: 'pr-test-analyzer: classify() KMS error router has ~10 branches but only 4 are tested end-to-end',
  },
  {
    key: 'accessibility-reviewer',
    bullet: (
      <>
        <Code>accessibility-reviewer</Code>{' '}
        — порушення <Emphasis color="green">WCAG 2.2 AA</Emphasis>:
        {' '}aria-атрибути, фокус, ролі, контраст у <Code>.tsx</Code> / <Code>.css</Code>
      </>
    ),
    src: accessibilityReviewerImg,
    alt: 'accessibility-reviewer: raw aria-* on IconButton bypasses Origin prop validation, WCAG 4.1.2',
  },
  {
    key: 'design-system-reviewer',
    bullet: (
      <>
        <Code>design-system-reviewer</Code>{' '}
        — відповідність <Emphasis color="green">Origin design system</Emphasis>:
        {' '}нативні елементи замість компонентів, hardcoded токени
      </>
    ),
    src: designSystemReviewerImg,
    alt: 'design-system-reviewer: Popover.Anchor is a pure positioning wrapper, does not inject aria-expanded',
  },
  {
    key: 'claude-md-reviewer',
    bullet: (
      <>
        <Code>claude-md-reviewer</Code>{' '}
        — <Emphasis color="green">точність</Emphasis>{' '}
        <Code>CLAUDE.md</Code> / <Code>AGENTS.md</Code>:
        {' '}правила, які насправді не працюють, або застаріли
      </>
    ),
    src: claudeMdReviewerImg,
    alt: 'claude-md-reviewer: AGENTS.md DON\'T rule uses incorrect Maven groupId',
  },
  {
    key: 'claude-meta-reviewer',
    bullet: (
      <>
        <Code>claude-meta-reviewer</Code>{' '}
        — якість <Emphasis color="green">SKILL.md / commands / hooks / agents</Emphasis>:
        {' '}інструкції, які не виконують те, що обіцяють
      </>
    ),
    src: claudeMetaReviewerImg,
    alt: 'claude-meta-reviewer: SKILL.md grep searches local files only — would return zero matches from a remote component',
  },
  {
    key: 'skill-reviewer-java-http-client',
    bullet: (
      <>
        <Code>skill-reviewer(java-http-client)</Code>{' '}
        — конфігурація HTTP-клієнта за <Emphasis color="green">golden path</Emphasis>:
        {' '}таймаути, retry, circuit-breaker, версії
      </>
    ),
    src: skillReviewerJavaHttpImg,
    alt: 'skill-reviewer: SNAPSHOT dependency on grammarly:http-client in a published library POM',
  },
  {
    key: 'skill-reviewer-react-interaction-tests',
    bullet: (
      <>
        <Code>skill-reviewer(react-interaction-tests)</Code>{' '}
        — <Emphasis color="green">інтерактивна семантика</Emphasis> React-компонентів через лінзу testing-library
      </>
    ),
    src: skillReviewerReactInteractionImg,
    alt: 'skill-reviewer: TreeItem renders role="button" + tabIndex=0 without onClick',
  },
  {
    key: 'codex',
    bullet: (
      <>
        <Code>codex</Code>{' '}
        — <Emphasis color="green">OpenAI</Emphasis>{' '}
        як <Emphasis color="orange">друга думка</Emphasis>:
        {' '}той самий MR, але іншою моделлю
      </>
    ),
    src: codexImg,
    alt: 'codex: when keyArn is neither old nor new, errors increments but processVerifyPage declares SUCCEEDED',
  },
];

// Consolidator bullets — what the review-consolidator agent does after all
// the per-lens findings come back. Distilled from
// claude-code-plugins/review/agents/review-consolidator.md.
const CONSOLIDATOR_BULLETS: ReactNode[] = [
  <>
    збирає результати від усіх <Emphasis color="green">background-агентів</Emphasis>
    {' '}через <Code>TaskOutput</Code>
  </>,
  <>
    <Emphasis color="green">дедуплікує</Emphasis> знахідки
    {' '}на однаковому <Code>file:line</Code> (±3 рядки)
  </>,
  <>
    <Emphasis color="green">підвищує впевненість</Emphasis> при збігу:
    {' '}<Code>+10%</Code> якщо знайшли 2 агенти, <Code>+20%</Code> якщо 3+
  </>,
  <>
    сортує за пріоритетом:
    {' '}<Emphasis color="orange">CRITICAL</Emphasis> → HIGH → MEDIUM → LOW
  </>,
  <>
    тайм-аути не блокують — <Emphasis color="green">публікуємо те, що встигли</Emphasis>
    {' '}за 20 хвилин
  </>,
];

const CONSOLIDATOR_STAGE_INDEX = LENSES.length; // i.e. 8 (zero-indexed final stage)

const STYLES = `
  @keyframes subagentPanelIn {
    from { opacity: 0; transform: translateY(8px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes subagentBulletIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .subagent-lens-stage {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-md);
    width: 100%;
  }

  .subagent-lens-title {
    text-align: left;
    margin: 0;
  }

  /* Two-column row: text on the left, image on the right. The row fills
     the remaining vertical space so the screenshot panel can grow tall. */
  .subagent-lens-row {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 2rem;
  }

  .subagent-lens-bullet {
    flex: 0 0 40%;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: var(--slide-text-normal);
    animation: subagentBulletIn 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .subagent-lens-panel {
    flex: 1 1 60%;
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(10, 14, 20, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(126, 231, 135, 0.08);
    padding: var(--space-md);
    animation: subagentPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .subagent-lens-panel img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  /* Consolidator panel — full-width bullet list. Same border/shadow chrome
     as the screenshot panel so it reads as the same "evidence canvas",
     but content is a centered stack of bullets. */
  .subagent-consolidator-panel {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-md);
    overflow: hidden;
    border-radius: 14px;
    background: rgba(10, 14, 20, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(126, 231, 135, 0.08);
    padding: var(--space-lg) var(--space-xl);
    text-align: left;
    font-size: var(--slide-text-normal);
    animation: subagentPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }
`;

function SubagentLensesContent({ revealStage }: { revealStage: number }) {
  const isConsolidator = revealStage >= CONSOLIDATOR_STAGE_INDEX;

  if (isConsolidator) {
    return (
      <>
        <style>{STYLES}</style>

        <div className="subagent-lens-stage">
          <h2 className="subagent-lens-title">
            <span className="text-dim">&gt;</span>{' '}
            <span className="text-green">а потім</span>{' '}
            <span className="text-orange">review-consolidator</span>{' '}
            <span className="text-green">збирає все докупи</span>
          </h2>

          <div key="consolidator-panel" className="subagent-consolidator-panel">
            {CONSOLIDATOR_BULLETS.map((b, i) => (
              <SlideItem key={i} delay={0.05 + i * 0.08}>
                {b}
              </SlideItem>
            ))}
          </div>
        </div>
      </>
    );
  }

  const lens = LENSES[Math.min(revealStage, LENSES.length - 1)];

  return (
    <>
      <style>{STYLES}</style>

      <div className="subagent-lens-stage">
        <h2 className="subagent-lens-title">
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">кожна лінза</span>{' '}
          <span className="text-orange">шукає своє</span>
        </h2>

        <div className="subagent-lens-row">
          <div key={`bullet-${lens.key}`} className="subagent-lens-bullet">
            <SlideItem>{lens.bullet}</SlideItem>
          </div>

          <div key={`panel-${lens.key}`} className="subagent-lens-panel">
            <img src={lens.src} alt={lens.alt} loading="lazy" />
          </div>
        </div>
      </div>
    </>
  );
}

export const SubagentLensesSlide: SlideDefinition = {
  id: 'subagent-lenses',
  // 8 lens stages (0..7) + 1 consolidator stage (8) = 9 total → maxRevealStages = 8.
  maxRevealStages: LENSES.length,
  initialRevealStage: 0,
  content: ({ revealStage }: SlideContentProps) => (
    <SubagentLensesContent revealStage={revealStage} />
  ),
  notes:
    'Спеціалізовані лінзи код-рев\'ю агента. Layout: текст ліворуч (40%), реальний скріншот коментаря праворуч (60%). 8 reveals — по одному субагенту: pr-test-analyzer → accessibility → design-system → claude-md → claude-meta → skill-reviewer(java-http-client) → skill-reviewer(react-interaction-tests) → codex. 9-й (фінальний) reveal — як review-consolidator зводить усі знахідки разом: TaskOutput → дедуп по file:line (±3) → boost confidence при збігу (+10% / +20%) → severity-сорт → тайм-аути не блокують.',
};
