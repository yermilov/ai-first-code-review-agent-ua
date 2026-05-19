import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import mrDescriptionImage from '../assets/mr-description-session-links.png?url';
import mrDescriptionResultImage from '../assets/mr-description-result.png?url';

// One pair per reveal stage. Stage 0 keeps the original lead bullet paired
// with the merged-PR screenshot; subsequent stages each show one good
// practice (top) and the matching distilled skill-prompt excerpt (full-width
// panel below).
type Practice = {
  key: string;
  /** Step-header bullet. Omit on stages where the evidence speaks for itself
   *  (e.g. the final "результат" image gets the whole canvas). */
  bullet?: ReactNode;
  panel:
    | { kind: 'screenshot'; src: string; alt: string }
    | { kind: 'prompt'; text: string };
};

const PRACTICES: Practice[] = [
  {
    key: 'session-links',
    bullet: <>додаємо посилання на сесію</>,
    panel: {
      kind: 'screenshot',
      src: mrDescriptionImage,
      alt: 'GitHub PR description with Claude Code session links',
    },
  },
  {
    key: 'intent',
    bullet: (
      <>
        intent з кожного коміту <Emphasis color="orange">витягуємо</Emphasis>,
        {' '}а не вигадуємо
      </>
    ),
    panel: {
      kind: 'prompt',
      text: `Every commit on the branch must have an intent explanation before proceeding.

For each commit:
  - find Claude Code sessions on this branch via ~/.claude/projects/<repo>/*.jsonl, filtered by gitBranch
  - grep the commit's short-hash across those JSONLs to find the claiming session
  - extract the first user-authored prompt from that session — that prompt is the WHY (not the WHAT)
  - if no session claimed the commit (orphan): AskUserQuestion("what was the purpose of this change?"), never fabricate intent`,
    },
  },
  {
    key: 'title',
    bullet: (
      <>
        title — <Emphasis color="green">конкретний і imperative</Emphasis>,
        {' '}≤72 chars, без adjective-soup
      </>
    ),
    panel: {
      kind: 'prompt',
      text: `Discover title conventions, in priority order:
  1. Project CLAUDE.md "Commit Message Conventions" section
  2. User CLAUDE.md
  3. Recent merged MRs/PRs by humans (filter out renovate, dependabot, sec-automation bots)
  4. Fallback: conventional commits — <type>: <description>

Generate a title that follows the discovered convention, stays under 72 characters, uses imperative mood, capitalizes the first letter, and avoids overused adjectives: "comprehensive", "robust", "various", "enhance".`,
    },
  },
  {
    key: 'description',
    bullet: (
      <>
        description = <Emphasis color="green">Why? / How?</Emphasis>,
        {' '}без переліку файлів і вигаданих risks
      </>
    ),
    panel: {
      kind: 'prompt',
      text: `Use the Why? / How? format:

### Why?
The problem being solved — taken verbatim from the intent we extracted above. NEVER fabricate. If no intent is available, state what changed factually.

### How?
The high-level approach in 1-2 sentences. Do NOT list files (the diff shows them), do NOT narrate the code change, do NOT speculate on risks unless the user explicitly mentioned them.

Optional sections, only if discussed: ### Decisions, ### Risks.

Size limits: small MR (≤5 files) max 1500 chars, large MR max 2000 chars. Avoid #NUMBER in prose — it auto-links to issue #N.`,
    },
  },
  {
    key: 'plan',
    bullet: (
      <>
        плани із сесії приклеюємо як <Emphasis color="green">collapsible details</Emphasis>
        {' '}— команда бачить як ми думали
      </>
    ),
    panel: {
      kind: 'prompt',
      text: `Discover plan slugs from each claiming session: grep -o '"slug":"[^"]*"' <session>.jsonl. Each slug maps to ~/.claude/plans/<slug>.md.

For each plan, summarize within the 500-char total budget:
  - extract the top-level heading and each section heading
  - add a one-sentence summary per section
  - omit code blocks and file listings

Append at the end of the description:
  <details><summary>Implementation plan</summary>[summary]</details>`,
    },
  },
  {
    key: 'result',
    // No bullet on the result reveal — the rendered screenshot is the punchline.
    panel: {
      kind: 'screenshot',
      src: mrDescriptionResultImage,
      alt: 'Rendered MR description: session links, Why? / How?, and a collapsible Implementation plan',
    },
  },
];

const STYLES = `
  @keyframes mrDescPanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes mrDescBulletIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Stage container — explicit height (NOT min-height) so descendant
     "max-height: 100%" resolves, which prevents tall images from
     overflowing past the visible area. */
  .mr-desc-stage {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-md);
    width: 100%;
  }

  .mr-desc-title {
    text-align: left;
    margin: 0;
  }

  /* Bullet sits as a single-row "step header". Hugs natural height so the
     panel below gets every remaining pixel of vertical room. */
  .mr-desc-bullet {
    flex: 0 0 auto;
    text-align: left;
    animation: mrDescBulletIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Panel — full width, fills remaining height. overflow: hidden contains
     the image variant; text variant overrides to overflow-y: auto if its
     content is ever taller than the slot. */
  .mr-desc-panel {
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(10, 14, 20, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(126, 231, 135, 0.08);
    font-family: var(--font-mono);
    animation: mrDescPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  /* Text variant — prompt excerpt at body font, wraps to full panel width */
  .mr-desc-panel--prompt {
    padding: var(--space-md) var(--space-lg);
    color: rgba(226, 232, 240, 0.94);
    text-align: left;
    white-space: pre-wrap;
    line-height: 1.45;
    font-size: var(--slide-text-normal);
    overflow-y: auto;
  }

  /* Image variant — panel hugs the image so the frame never floats with
     dead horizontal space around small portrait-ish screenshots. */
  .mr-desc-panel--image {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
    align-self: center;
    width: fit-content;
    max-width: 100%;
  }

  .mr-desc-panel--image img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
`;

function MrDescriptionContent({ revealStage }: { revealStage: number }) {
  const idx = Math.min(revealStage, PRACTICES.length - 1);
  const practice = PRACTICES[idx];

  return (
    <>
      <style>{STYLES}</style>

      <div className="mr-desc-stage">
        <h2 className="mr-desc-title">
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">тепер попрацюємо над</span>{' '}
          <span className="text-orange">дескріпшином</span>
        </h2>

        {/* Bullet — single-row "step header" above the evidence panel.
            Practice key remounts the element so the entry animation replays
            on each reveal swap. Stages without a bullet (e.g. the final
            "результат" image) collapse this row so the panel gets the
            full canvas. */}
        {practice.bullet && (
          <div key={`bullet-${practice.key}`} className="mr-desc-bullet">
            <SlideItem delay={0.05}>{practice.bullet}</SlideItem>
          </div>
        )}

        {/* Panel — full-width evidence: screenshot at stages 0 and 5, prompt
            excerpt at stages 1-4. Constrained to remaining vertical space. */}
        {practice.panel.kind === 'screenshot' ? (
          <div
            key={`panel-${practice.key}`}
            className="mr-desc-panel mr-desc-panel--image"
          >
            <img
              src={practice.panel.src}
              alt={practice.panel.alt}
              loading="lazy"
            />
          </div>
        ) : (
          <div
            key={`panel-${practice.key}`}
            className="mr-desc-panel mr-desc-panel--prompt"
          >
            {practice.panel.text}
          </div>
        )}
      </div>
    </>
  );
}

export const MrDescriptionSlide: SlideDefinition = {
  id: 'mr-description',
  maxRevealStages: PRACTICES.length - 1,
  initialRevealStage: 0,
  content: ({ revealStage }: SlideContentProps) => <MrDescriptionContent revealStage={revealStage} />,
  notes:
    'Reveal-swap, vertical layout. Each stage: title → bullet (step header) → evidence panel. 0) "додаємо посилання на сесію" + скріншот merged PR з Note-блоком і session links. 1) intent extraction — never fabricate. 2) title — imperative, ≤72 chars, no adjective-soup. 3) description — Why? / How?. 4) implementation plan — collapsible details from ~/.claude/plans/<slug>.md. 5) bullet прибраний — фінальний скріншот рендеру MR description займає весь канвас.',
};
