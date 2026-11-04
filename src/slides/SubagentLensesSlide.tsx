import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, Code } from '../components/SlideElements';
import { tr, type Lang } from '../context/LanguageContext';
import prTestAnalyzerImg from '../assets/subagent-comments/pr-test-analyzer.png?url';
import accessibilityReviewerImg from '../assets/subagent-comments/accessibility-reviewer.png?url';
import designSystemReviewerImg from '../assets/subagent-comments/design-system-reviewer.png?url';
import claudeMdReviewerImg from '../assets/subagent-comments/claude-md-reviewer.png?url';
import claudeMetaReviewerImg from '../assets/subagent-comments/claude-meta-reviewer.png?url';
import skillReviewerJavaHttpImg from '../assets/subagent-comments/skill-reviewer-java-http-client.png?url';
import codexImg from '../assets/subagent-comments/codex.png?url';

// EN: own translation (bulletEn)
// One entry per reveal stage. Bullet = short "what this lens looks for".
// Panel = screenshot of the real GitLab/GitHub comment that this sub-agent
// surfaced on a Grammarly MR/PR (matched by file+line in the mango session log).
type Lens = {
  key: string;
  bullet: ReactNode;
  /** English bullet — EN: own translation */
  bulletEn: ReactNode;
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
    bulletEn: (
      <>
        <Code>pr-test-analyzer</Code>{' '}
        — <Emphasis color="green">gaps in test coverage</Emphasis>:
        {' '}branches nobody covered, missing assertions, fragile stubs
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
    bulletEn: (
      <>
        <Code>accessibility-reviewer</Code>{' '}
        — <Emphasis color="green">WCAG 2.2 AA</Emphasis> violations:
        {' '}aria attributes, focus, roles, contrast in <Code>.tsx</Code> / <Code>.css</Code>
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
        — відповідність <Emphasis color="green">нашій дизайн системі</Emphasis>:
        {' '}нативні елементи замість компонентів, захардкоджені токени
      </>
    ),
    bulletEn: (
      <>
        <Code>design-system-reviewer</Code>{' '}
        — compliance with <Emphasis color="green">our design system</Emphasis>:
        {' '}native elements instead of components, hardcoded tokens
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
        — <Emphasis color="green">якість</Emphasis>{' '}
        <Code>CLAUDE.md</Code> / <Code>AGENTS.md</Code>:
        {' '}правила, які насправді не працюють, або застаріли
      </>
    ),
    bulletEn: (
      <>
        <Code>claude-md-reviewer</Code>{' '}
        — <Emphasis color="green">quality</Emphasis> of{' '}
        <Code>CLAUDE.md</Code> / <Code>AGENTS.md</Code>:
        {' '}rules that don't actually work, or went stale
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
        — якість <Emphasis color="green">SKILL.md / commands / hooks / agents</Emphasis>
        {' '}відповідно до мета скілу
      </>
    ),
    bulletEn: (
      <>
        <Code>claude-meta-reviewer</Code>{' '}
        — quality of <Emphasis color="green">SKILL.md / commands / hooks / agents</Emphasis>
        {' '}against the meta skill
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
        — конфігурація нашого стандартного <Emphasis color="green">HTTP-клієнта</Emphasis>:
        {' '}таймаути, retry, circuit-breaker, версії
      </>
    ),
    bulletEn: (
      <>
        <Code>skill-reviewer(java-http-client)</Code>{' '}
        — config of our standard <Emphasis color="green">HTTP client</Emphasis>:
        {' '}timeouts, retries, circuit breaker, versions
      </>
    ),
    src: skillReviewerJavaHttpImg,
    alt: 'skill-reviewer: SNAPSHOT dependency on grammarly:http-client in a published library POM',
  },
  {
    key: 'codex',
    bullet: (
      <>
        окремо <Code>codex</Code>{' '}
        — для <Emphasis color="orange">стороннього погляду</Emphasis>
        {' '}на найскладніші рев'ю
      </>
    ),
    bulletEn: (
      <>
        and separately <Code>codex</Code>{' '}
        — for <Emphasis color="orange">an outside view</Emphasis>
        {' '}on the hardest reviews
      </>
    ),
    src: codexImg,
    alt: 'codex: when keyArn is neither old nor new, errors increments but processVerifyPage declares SUCCEEDED',
  },
];

function SubagentLensesContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const lens = LENSES[Math.min(revealStage, LENSES.length - 1)];

  return (
    <>
      <div className="subagent-lens-stage">
        <h2 className="subagent-lens-title">
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">{tr(lang, 'скілові', 'skill')}</span>{' '}
          <span className="text-orange">{tr(lang, "рев'ювери", 'reviewers')}</span>
        </h2>

        <div className="subagent-lens-row">
          <div key={`bullet-${lens.key}`} className="subagent-lens-bullet">
            <SlideItem>{tr(lang, lens.bullet, lens.bulletEn)}</SlideItem>
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
  // One reveal per lens (0..LENSES.length-1). maxRevealStages is N-1.
  maxRevealStages: LENSES.length - 1,
  initialRevealStage: 0,
  content: ({ revealStage, lang }: SlideContentProps) => (
    <SubagentLensesContent revealStage={revealStage} lang={lang} />
  ),
  notes:
    'Спеціалізовані лінзи код-рев\'ю агента. Layout: текст ліворуч (40%), реальний скріншот коментаря праворуч (60%). По одному субагенту за reveal: pr-test-analyzer → accessibility → design-system → claude-md → claude-meta → skill-reviewer(java-http-client) → codex. Консолідатор (як review-consolidator зводить усі знахідки разом) винесений у окремий слайд.',
};
