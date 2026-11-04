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


function AgentWorkflowContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const panel = panelFor(revealStage);

  return (
    <>

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
