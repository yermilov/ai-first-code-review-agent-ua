import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { tr, type Lang } from '../context/LanguageContext';

// Three bullets that accumulate. The framed panel on the right is only
// meaningful from stage 1 onward (when bullet 2 introduces "наприклад").
const BULLETS_UK: ReactNode[] = [
  <>створюємо <Emphasis color="green">code-review скіл</Emphasis>,
    {' '}який використовує і агент, і люди можуть самі запускати,
    {' '}щоб перевірити свій або чужий код</>,
  <>ще краще — цей скіл <Emphasis color="orange">покроково делегує</Emphasis>
    {' '}меншим, сфокусованим скілам, наприклад:</>,
  <>але найголовніше — AI рев'ювер може брати скіли, які інженери писали
    {' '}для себе, і використовувати їх як{' '}
    <Emphasis color="green">гайдлайни для код-рев'ю</Emphasis></>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>we build a <Emphasis color="green">code-review skill</Emphasis>
    {' '}that the agent uses — and people can run it themselves
    {' '}to check their own code or someone else's</>,
  <>even better — that skill <Emphasis color="orange">delegates step by step</Emphasis>
    {' '}to smaller, focused skills, for example:</>,
  <>but the main thing — the AI reviewer can take the skills engineers wrote
    {' '}for themselves and use them as{' '}
    <Emphasis color="green">code-review guidelines</Emphasis></>,
];

// Prompt-shaped distillations of each SKILL.md so the audience sees what
// the skill actually does, not just its name. Sources:
//   review:gather-changes     → review/skills/gather-changes/SKILL.md
//   review:project-guidelines → review/skills/project-guidelines/SKILL.md
const SKILL_EXAMPLES = `Skill(review:project-guidelines)
    load CLAUDE.md / AGENTS.md / CONTRIBUTING.md
      from the BASE branch first (git show BASE:…)
      so a PR can't weaken its own review rules
    pick up every subdir CLAUDE.md the diff touches
    follow cross-refs inside CLAUDE.md that fit the diff
    execute "when reviewing X, check Y" matrices
      → those reads are MANDATORY
    project rules OVERRIDE defaults (except security
      — always flag, regardless of project conventions)

Skill(review:gather-changes)
    git diff between BASE and HEAD — report
      commits ahead, # files, ± insertions/deletions
    drop lock files, minified/bundled, generated,
      vendor/, node_modules/, dist/, build/, .next/
    migrations are kept even if they match a filter
    cross-reference with the platform PR/MR file list
      → remove phantom files from merge-base drift
    if the diff is fully filtered → APPROVE and
      exit the pipeline cleanly`;


function EverythingIsSkillContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const BULLETS = tr(lang, BULLETS_UK, BULLETS_EN);
  const visibleCount = revealStage + 1;
  const showPanel = revealStage >= 1;

  return (
    <>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: 'var(--space-lg)',
          minHeight: 0,
          height: '100%',
        }}
      >
        {/* Bullets — half-width left column */}
        <div
          style={{
            flex: '0 0 46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            textAlign: 'left',
            minWidth: 0,
          }}
        >
          {BULLETS.slice(0, visibleCount).map((bullet, i) => (
            <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
          ))}
        </div>

        {/* Right — skill-examples panel, mounts at stage 1+ */}
        {showPanel && (
          <div
            style={{
              flex: 1,
              alignSelf: 'center',
              maxHeight: '100%',
              background: 'color-mix(in srgb, var(--terminal-bg) 60%, transparent)',
              border: '1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent)',
              borderRadius: '6px',
              padding: 'var(--space-md) var(--space-lg)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'var(--font-size-code)',
              lineHeight: 1.5,
              color: 'color-mix(in srgb, var(--terminal-white) 92%, transparent)',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              boxShadow:
                '0 18px 48px color-mix(in srgb, var(--terminal-black) 55%, transparent), inset 0 1px 0 color-mix(in srgb, var(--terminal-pure-white) 5%, transparent)',
              animation: 'everythingPanelIn 0.5s ease-out both',
            }}
          >
            <div>{SKILL_EXAMPLES}</div>
          </div>
        )}
      </div>
    </>
  );
}

export const EverythingIsSkillSlide: SlideDefinition = {
  id: 'everything-is-skill',
  maxRevealStages: BULLETS_UK.length - 1,
  title: ({ lang }: SlideContentProps) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">{tr(lang, 'з цього моменту все', 'from now on, everything is a')}</span>{' '}
      <span className="text-orange">{tr(lang, 'скіл', 'skill')}</span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => (
    <EverythingIsSkillContent revealStage={revealStage} lang={lang} />
  ),
  notes:
    'Code-review агент сам збудований зі скілів — і виробляє нові скіли як побічний продукт. Stage 0: робимо code-review скіл який і агент, і люди запускають вручну. Stage 1: цей скіл делегує меншим скілам (приклад: 1 environment setup, 2 gather changes, 4 project guidelines — step 3 ми вже показали раніше на TeachClaudeCommunicate). Stage 2: інженери пишуть свої скіли, і AI рев\'ювер їх підхоплює як гайдлайни.',
};
