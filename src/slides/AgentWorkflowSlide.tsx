import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';

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
    background: rgba(10, 14, 20, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
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

function AgentWorkflowContent({ revealStage }: { revealStage: number }) {
  const panel = panelFor(revealStage);

  return (
    <>
      <style>{STYLES}</style>

      <div className="agent-workflow-body">
        {/* Left column: bullets accumulate across reveal stages */}
        <div className="agent-workflow-bullets">
          {revealStage >= 1 && (
            <SlideItem delay={0} reveal>
              комунікацію з людиною довіряти
              {' '}<Emphasis color="orange">Provide detailed feedback using inline comments for specific issues. Use top-level comments for general observations or praise.</Emphasis>
              {' '} ще рано
            </SlideItem>
          )}
          {revealStage >= 2 && (
            <SlideItem delay={0} reveal>
              обгортаємо код рев'ю промпт в <Emphasis color="orange">Claude Agent SDK</Emphasis> (TypeScript-обгортка над Claude Code CLI)
            </SlideItem>
          )}
          {revealStage >= 3 && (
            <SlideItem delay={0} reveal>
              але просимо повернути через <Emphasis color="green">structured output</Emphasis>
              {' '}результати рев'ю які виконує звичайний Type Script код
            </SlideItem>
          )}
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
  maxRevealStages: 3,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">починаємо працювати</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <AgentWorkflowContent revealStage={revealStage} />,
  notes:
    'Структурний blueprint побудови агентів. Stage 0: bullets-only intro. Stage 1: Claude Agent SDK як рантайм. Stage 2: змішане детерміністичне/агентне виконання. Stage 3: Structured Output для рішень + код для сайд-ефектів. Ключова теза: детермінізм на межах, агентність всередині.',
};
