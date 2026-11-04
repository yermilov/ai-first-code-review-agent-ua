import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';
import { Lang, T, tr } from '../context/LanguageContext';
import { ReactNode } from 'react';

const BULLETS_UK: ReactNode[] = [
  <>
    комунікацію з людиною довіряти
    {' '}<Emphasis color="orange">Provide detailed feedback using inline comments for specific issues. Use top-level comments for general observations or praise.</Emphasis>
    {' '} ще рано
  </>,
  <>загортаємо code review prompt у <Emphasis color="orange">Claude Agent SDK</Emphasis> (TypeScript-обгортка над Claude Code CLI)</>,
  <>
    і просимо повернути через <Emphasis color="green">structured output</Emphasis>
    {' '}результати рев'ю, які виконує звичайний Type Script код
  </>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>
    it's too early to hand the human conversation over to
    {' '}<Emphasis color="orange">Provide detailed feedback using inline comments for specific issues. Use top-level comments for general observations or praise.</Emphasis>
  </>,
  <>we wrap the code review prompt in the <Emphasis color="orange">Claude Agent SDK</Emphasis> (a TypeScript wrapper around the Claude Code CLI)</>,
  <>
    and ask for the review results back as <Emphasis color="green">structured output</Emphasis>,
    {' '}which plain TypeScript code then acts on
  </>,
];

const EXECUTION_CODE = `import { query } from
  "@anthropic-ai/claude-agent-sdk";
for await (const message of query({
  prompt:
    "Review the PR and post comments on issues",
  options: {
    allowedTools: ["Bash", "Read", "Glob"],
  },
})) {
  // handle streaming messages
}`;

const SCHEMA_CODE = `const reviewResultSchema = z.object({
  approve: z.boolean(),
  comments: z.array(z.object({
    file:         z.string().optional(),
    comment_body: z.string(), })), });
export type ReviewResult = z.infer<typeof reviewResultSchema>;
const { result } = await claudeClient.execute<ReviewResult>();
for (const c of result.comments) {
  await cicdClient.postInlineComment(prNumber, c);
}
if (result.approve) await cicdClient.approvePR(prNumber);`;

type PanelVariant = {
  key: string;
  label: string;
  language: 'typescript';
  code: string;
};

function panelFor(revealStage: number): PanelVariant | null {
  if (revealStage >= 3) {
    return { key: 'schema', label: 'types.ts — structured output schema', language: 'typescript', code: SCHEMA_CODE };
  }
  if (revealStage >= 2) {
    return { key: 'execution', label: 'federated-orchestrator.ts — mixed execution', language: 'typescript', code: EXECUTION_CODE };
  }
  return null;
}

const STYLES = `
  @keyframes agentWorkflowPanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .agent-workflow-body {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-lg);
    min-height: 0;
    text-align: left;
  }

  .agent-workflow-bullets {
    flex: 0 0 44%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .agent-workflow-panel {
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 14px;
    background: color-mix(in srgb, var(--terminal-bg) 60%, transparent);
    border: 1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent);
    box-shadow:
      0 18px 48px color-mix(in srgb, var(--terminal-black) 60%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--terminal-pure-white) 6%, transparent);
    font-family: var(--font-mono);
    animation: agentWorkflowPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .agent-workflow-panel__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
  }

  .agent-workflow-panel__viewport .code-block {
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

  .agent-workflow-panel__viewport .code-block-header { display: none; }
  .agent-workflow-panel__viewport .code-block pre {
    flex: 1 1 auto;
    margin: 0 !important;
    height: 100%;
  }
`;

function AgentWorkflowContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const panel = panelFor(revealStage);

  return (
    <>
      <style>{STYLES}</style>

      <div className="agent-workflow-body">
        {/* Left column: bullets accumulate across reveal stages */}
        <div className="agent-workflow-bullets">
          {tr(lang, BULLETS_UK, BULLETS_EN).map((bullet, i) => (
            <SlideItem key={i} delay={0} reveal hidden={revealStage < i + 1}>
              {bullet}
            </SlideItem>
          ))}
        </div>

        {/* Right column: framed code panel — mounts only at reveal stage >= 1 */}
        {panel && (
          <div className="agent-workflow-panel" key={panel.key}>
            <div className="agent-workflow-panel__viewport">
              <CodeBlock language={panel.language} code={panel.code} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const AgentWorkflowSlide: SlideDefinition = {
  id: 'agent-workflow',
  maxRevealStages: BULLETS_UK.length,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="починаємо працювати" en="let's get to work" /></span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <AgentWorkflowContent revealStage={revealStage} lang={lang} />,
  notes:
    'Структурний blueprint побудови агентів. Stage 0: bullets-only intro. Stage 1: Claude Agent SDK як рантайм. Stage 2: змішане детерміністичне/агентне виконання. Stage 3: Structured Output для рішень + код для сайд-ефектів. Ключова теза: детермінізм на межах, агентність всередині.',
};
