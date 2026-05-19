import { SlideDefinition, SlideContentProps } from '../types/slides';
import { CodeBlock } from '../components/CodeBlock';
import conversationImg from '../assets/mango-conversation-inkwell.png?url';

// Simplified prompt snippets distilled from the real skills/steps —
// stripped of "Step N/12" headers, Skill(…) invocations, and other
// scaffolding so the audience sees the *intent* of the instruction.
//
// Sources (kept here for reference only — do NOT surface in the snippet):
//   fetch-existing-comments → claude-code-plugins/review/skills/fetch-existing-comments/SKILL.md
//   thread analysis         → mango/src/scenarios/code-review/prompt.ts (getSkillBasedThreadAnalysisStep)

const FETCH_COMMENTS_PROMPT = `Fetch every review comment on this PR.
For each one emit:
  { id, thread_id, file, line, body, author, resolved }
  thread_id = in_reply_to_id ?? id   // group replies
If the fetch fails, return [] and keep going.

Why: you MUST NOT raise a concern that was already raised — by a human or
another AI reviewer. De-dupe against this list before posting anything.`;

const THREAD_ANALYSIS_PROMPT = `Look at every comment thread YOU previously opened on this PR.
For each one, decide:
  fix is in the diff      →  RESOLVE
  fix was reverted        →  UNRESOLVE
  earlier finding wrong   →  RESOLVE w/ reason
Threads opened by HUMANS: take NO action.

Output:
  RESOLVE    comment_id: 12345
    REASON: Issue fixed in commit abc123
  UNRESOLVE  comment_id: 67890
    REASON: Fix was reverted`;

type PanelVariant =
  | { kind: 'prompt'; key: string; language: 'markdown'; code: string }
  | { kind: 'image'; key: string; src: string; alt: string };

function panelFor(revealStage: number): PanelVariant | null {
  if (revealStage >= 3) {
    return {
      kind: 'image',
      key: 'conversation',
      src: conversationImg,
      alt: 'Real GitLab discussion thread: mango flags missing tests on getTextFieldContent; Ling Huang replies with three bullet points claiming all paths are covered; mango replies that the fixes are in ChatService.spec.ts, but the original finding was about AssistantBackgroundController.getTextFieldContent — a different file with no tests.',
    };
  }
  if (revealStage >= 2) {
    return { kind: 'prompt', key: 'thread-analysis', language: 'markdown', code: THREAD_ANALYSIS_PROMPT };
  }
  if (revealStage >= 1) {
    return { kind: 'prompt', key: 'fetch-comments', language: 'markdown', code: FETCH_COMMENTS_PROMPT };
  }
  return null;
}

const STYLES = `
  @keyframes teachClaudePanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .teach-claude-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--vh-full) - 220px);
    min-height: 0;
    text-align: left;
  }

  .teach-claude-panel {
    width: 100%;
    flex: 1 1 auto;
    max-height: 100%;
    min-height: 0;
    min-width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(10, 14, 20, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    font-family: var(--font-mono);
    animation: teachClaudePanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .teach-claude-panel__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
  }

  .teach-claude-panel__viewport .code-block {
    flex: 1 1 auto;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .teach-claude-panel__viewport .code-block-header { display: none; }
  .teach-claude-panel__viewport .code-block pre {
    flex: 1 1 auto;
    margin: 0 !important;
    height: 100%;
  }

  /* Image variant — center the screenshot, contain it, no chrome around it.
     The panel still provides the green border + shadow. */
  .teach-claude-panel--image {
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
    background: rgba(10, 14, 20, 0.6);
  }
  .teach-claude-panel--image img {
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

function TeachClaudeCommunicateContent({ revealStage }: { revealStage: number }) {
  const panel = panelFor(revealStage);

  return (
    <>
      <style>{STYLES}</style>

      <div className="teach-claude-body">
        {panel && panel.kind === 'prompt' && (
          <div className="teach-claude-panel" key={panel.key}>
            <div className="teach-claude-panel__viewport">
              <CodeBlock language={panel.language} code={panel.code} />
            </div>
          </div>
        )}
        {panel && panel.kind === 'image' && (
          <div
            className="teach-claude-panel teach-claude-panel--image"
            key={panel.key}
          >
            <img src={panel.src} alt={panel.alt} loading="lazy" />
          </div>
        )}
      </div>
    </>
  );
}

export const TeachClaudeCommunicateSlide: SlideDefinition = {
  id: 'teach-claude-communicate',
  maxRevealStages: 3,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">вчимо</span>{' '}
      <span className="text-orange">Клода</span>{' '}
      <span className="text-green">коментувати</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <TeachClaudeCommunicateContent revealStage={revealStage} />,
  notes:
    'Three-stage walkthrough: how Claude is taught to use review-channel state, plus a real-world payoff. Reveal 1: pre-review — load every existing comment as $EXISTING_COMMENTS so we de-dupe against humans and other AI bots. Reveal 2: post-review — Claude looks at threads it itself opened earlier and decides RESOLVE / UNRESOLVE (humans resolve their own). Reveal 3: payoff — real Inkwell MR thread (Ling Huang) where mango catches that the human "fixed" tests in ChatService.spec.ts but the original finding was about AssistantBackgroundController.getTextFieldContent — a different file. Snippets distilled from review/skills/fetch-existing-comments/SKILL.md and mango/.../prompt.ts:getSkillBasedThreadAnalysisStep.',
};
