import { SlideDefinition, SlideContentProps } from '../types/slides';
import { CodeBlock } from '../components/CodeBlock';
import { T } from '../context/LanguageContext';
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

Why: you MUST NOT raise a concern that was already raised — by a human or another AI reviewer. De-dupe against this list before posting anything.`;

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

const CONVERSATION_ALT =
  'Real GitLab discussion thread: mango flags missing tests on getTextFieldContent; Ling Huang replies with three bullet points claiming all paths are covered; mango replies that the fixes are in ChatService.spec.ts, but the original finding was about AssistantBackgroundController.getTextFieldContent — a different file with no tests.';


function TeachClaudeCommunicateContent({ revealStage }: { revealStage: number }) {
  const showImage = revealStage >= 1;
  const activePrompt =
    revealStage >= 2
      ? { key: 'thread-analysis', code: THREAD_ANALYSIS_PROMPT }
      : revealStage >= 1
        ? { key: 'fetch-comments', code: FETCH_COMMENTS_PROMPT }
        : null;

  return (
    <>

      <div className="teach-claude-body">
        <div className="teach-claude-col teach-claude-col--image">
          {showImage && (
            <div className="teach-claude-panel teach-claude-panel--image" key="conversation">
              <img src={conversationImg} alt={CONVERSATION_ALT} loading="lazy" />
            </div>
          )}
        </div>

        <div className="teach-claude-col teach-claude-col--prompts">
          {activePrompt && (
            <div className="teach-claude-panel" key={activePrompt.key}>
              <div className="teach-claude-panel__viewport">
                <CodeBlock language="markdown" code={activePrompt.code} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const TeachClaudeCommunicateSlide: SlideDefinition = {
  id: 'teach-claude-communicate',
  maxRevealStages: 2,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="вчимо" en="teaching" /></span>{' '}
      <span className="text-orange"><T uk="Клода спілкуватися" en="Claude to talk" /></span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <TeachClaudeCommunicateContent revealStage={revealStage} />,
  notes:
    'Three-stage walkthrough: how Claude is taught to use review-channel state, plus a real-world payoff. Reveal 1: pre-review — load every existing comment as $EXISTING_COMMENTS so we de-dupe against humans and other AI bots. Reveal 2: post-review — Claude looks at threads it itself opened earlier and decides RESOLVE / UNRESOLVE (humans resolve their own). Reveal 3: payoff — real Inkwell MR thread (Ling Huang) where mango catches that the human "fixed" tests in ChatService.spec.ts but the original finding was about AssistantBackgroundController.getTextFieldContent — a different file. Snippets distilled from review/skills/fetch-existing-comments/SKILL.md and mango/.../prompt.ts:getSkillBasedThreadAnalysisStep.',
};
