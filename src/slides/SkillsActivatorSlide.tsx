import { useEffect, useRef, useState } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';
import yakImage from '../assets/yak.jpg?url';

// "25th frame" subliminal gag — wild yak (Bos mutus) flashes for ~120ms on
// the forward 0→1 reveal transition. The Ukrainian "як?" / English "yak"
// homophone is the joke. Skipped on first mount and on backward navigation
// so the flash only fires when the audience is about to hear the answer.
const YAK_FLASH_MS = 120;

const SKILL_MD_CODE = `---
activation:
  keywords:
    # block until loaded
    - { keyword: "create pr", action: require }
    # hint to load
    - { keyword: "commit",    action: suggest }
  tools:
    # match tool calls
    - { tool: Bash, match: "git (push|commit)" }
  directories:
    # required in this dir
    - { match: "my-service", action: require }
---`;

const HOOKS_CODE = `{
  "SessionStart":
    "scan SKILL.md files → index activations",
  "UserPromptSubmit":
    "match prompt keywords → suggest / block",
  "PreToolUse":
    "match tool name+input → suggest / block",
  "PostToolUse":
    "suggest skills based on tool result",
  "PostToolUseFailure":
    "suggest skills on tool failure",
  "SessionEnd":
    "cleanup session index"
}`;

const SUGGEST_CODE = `// suggest — additionalContext injection
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "UserPromptSubmit",
    additionalContext:
      "Relevant skills:\\n" +
      formatSkill(skill) +
      "\\n\\nConsider using Skill.",
  },
}));
process.exit(0);`;

const BLOCK_CODE = `// block — stderr + exit 2
console.error(
  "BLOCKED: Required skill not loaded: " +
  skillList + "\\n\\n" +
  "ACTION REQUIRED:\\n" +
  "1. Use Skill tool to load NOW.\\n" +
  "2. READ and INTERNALIZE the skill.\\n" +
  "3. REEVALUATE your approach."
);
process.exit(2);`;

type PanelVariant = {
  key: string;
  language: 'yaml' | 'json' | 'typescript';
  code: string;
};

function panelFor(revealStage: number): PanelVariant | null {
  if (revealStage >= 4) {
    return { key: 'block', language: 'typescript', code: BLOCK_CODE };
  }
  if (revealStage >= 3) {
    return { key: 'suggest', language: 'typescript', code: SUGGEST_CODE };
  }
  if (revealStage >= 2) {
    return { key: 'hooks', language: 'json', code: HOOKS_CODE };
  }
  if (revealStage >= 1) {
    return { key: 'skill', language: 'yaml', code: SKILL_MD_CODE };
  }
  return null;
}

const STYLES = `
  @keyframes skillsActivatorPanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .skills-activator-body {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-lg);
    min-height: 0;
    text-align: left;
  }

  .skills-activator-bullets {
    flex: 0 0 44%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .skills-activator-panel {
    flex: 1 1 auto;
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
    animation: skillsActivatorPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .skills-activator-panel__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
  }

  .skills-activator-panel__viewport .code-block {
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

  .skills-activator-panel__viewport .code-block-header { display: none; }
  .skills-activator-panel__viewport .code-block pre {
    flex: 1 1 auto;
    margin: 0 !important;
    height: 100%;
  }
`;

function SkillsActivatorContent({ revealStage }: { revealStage: number }) {
  const panel = panelFor(revealStage);

  // Sliding window for solution bullets (stages 1..4): keep only the most
  // recent 3 visible so the column never overflows into the title band.
  // Stage 0 owns its own problem bullet that gets swapped out at stage 1.
  const SOLUTION_WINDOW = 3;
  const solutionIndex = revealStage - 1; // 0..3 once we leave the problem
  const firstSolution = Math.max(0, solutionIndex - SOLUTION_WINDOW + 1);
  const isSolutionVisible = (i: number) =>
    solutionIndex >= i && i >= firstSolution;

  // Track the previous revealStage so the yak flash only fires on the forward
  // 0→1 step. On mount the ref is seeded to the current stage, so landing
  // directly on stage 1+ (e.g. via URL hash) does not trigger.
  const prevStageRef = useRef(revealStage);
  const [yakVisible, setYakVisible] = useState(false);

  useEffect(() => {
    const isForwardTransition =
      prevStageRef.current === 0 && revealStage === 1;
    prevStageRef.current = revealStage;
    if (!isForwardTransition) return;
    setYakVisible(true);
    const t = window.setTimeout(() => setYakVisible(false), YAK_FLASH_MS);
    return () => window.clearTimeout(t);
  }, [revealStage]);

  return (
    <>
      <style>{STYLES}</style>

      <div className="skills-activator-body">
        {/* Left column: bullets — stage 0 = problem statement (single bullet,
            swapped out at stage 1); stages 1..4 = solution bullets accumulate. */}
        <div className="skills-activator-bullets">
          {revealStage === 0 && (
            <SlideItem delay={0.05}>
              Клод все ще ненадійно завантажує{' '}
              <Emphasis color="orange">потрібні скіли</Emphasis>
            </SlideItem>
          )}

          {isSolutionVisible(0) && (
            <SlideItem delay={0} reveal>
              тому ми зробили <Emphasis color="green">skills-activator</Emphasis> — у{' '}
              <Emphasis color="orange">SKILL.md</Emphasis> описуємо правила активації:
              {' '}ключові слова, патерни tool-викликів, директорії
            </SlideItem>
          )}

          {isSolutionVisible(1) && (
            <SlideItem delay={0} reveal>
              Claude Code <Emphasis color="green">хуки</Emphasis> перехоплюють події сесії
              {' '}і <Emphasis color="green">аналізують</Emphasis>{' '}
              промпти, bash-команди, виклики інструментів та їхні{' '}
              <Emphasis color="orange">аутпути</Emphasis>
            </SlideItem>
          )}

          {isSolutionVisible(2) && (
            <SlideItem delay={0} reveal>
              якщо хук бачить, що потрібний скіл не завантажений —
              {' '}<Emphasis color="green">підказує</Emphasis> Клоду,
              {' '}інжектуючи контекст у промпт через{' '}
              <Emphasis color="green">additionalContext</Emphasis>
            </SlideItem>
          )}

          {isSolutionVisible(3) && (
            <SlideItem delay={0} reveal>
              а для критичних випадків — <Emphasis color="orange">блокує</Emphasis>
              {' '}виклик через <Emphasis color="orange">exit 2</Emphasis> + stderr
              {' '}з інструкцією, який скіл завантажити
            </SlideItem>
          )}
        </div>

        {/* Right column: framed code panel — mounts only at reveal stage >= 1 */}
        {panel && (
          <div className="skills-activator-panel" key={panel.key}>
            <div className="skills-activator-panel__viewport">
              <CodeBlock language={panel.language} code={panel.code} />
            </div>
          </div>
        )}
      </div>

      {/* 25th-frame yak — always mounted so the image is painted to its own
          layer ahead of time; we just toggle opacity for the flash. Mounting
          the div conditionally was racing the browser paint cycle inside the
          120 ms window. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: yakVisible ? 1 : 0,
        }}
      >
        <img
          src={yakImage}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </>
  );
}

export const SkillsActivatorSlide: SlideDefinition = {
  id: 'skills-activator',
  maxRevealStages: 4,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">як?</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <SkillsActivatorContent revealStage={revealStage} />,
  notes:
    'Skills discovery — last-mile проблема. Stage 0: проблема (Клод ненадійно завантажує потрібні скіли). Stage 1: SKILL.md активаційні правила (keywords / tools / directories) + 25th-frame yak (на 0→1 forward only). Stage 2: ~/.claude/hooks.json — повний набір з 6 хуків (SessionStart → SessionEnd), які аналізують промпти, bash-команди, tool-виклики та їхні аутпути. Stage 3: suggest — інʼєкція в промпт через additionalContext, exit 0. Stage 4: block — stderr + exit 2 для критичних випадків.',
};
