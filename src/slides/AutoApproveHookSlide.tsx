import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';

const TIER_CODE = `# Tier 1: MCP annotations (~0ms)
if tool.readOnlyHint    → approve
if tool.destructiveHint → deny

# Tier 2: SHA-256 cache (~0ms)
if cache.has(sha256(tool + cmd)) → cached_decision

# Tier 3: LLM-as-a-judge with SAFETY_PROMPT (~2-18s)
#   SAFE   | cat, ls, git status, npm test, kubectl get
#   UNSAFE | rm -rf, terraform apply, sudo, env|SECRET
verdict = llm.classify(cmd, SAFETY_PROMPT)
# fail-safe: any error → exit(0) → normal prompt`;

const AUTO_MODE_CODE = `$ claude --permission-mode auto

# Sonnet classifier evaluates every tool call
allows: file read/write, npm install,
        push to feature/*, read-only HTTP
blocks: download+exec, credential leaks,
        force-push to main, mass deletion

# 3x consecutive block → resumes prompting

# enterprise config
{ "permissions": {
    "defaultMode": "auto",
    "allow": ["Bash(npm install:*)"]
  },
  "autoMode": {
    "environment": [
      "trusted: *.internal.acme.com"
    ]
  } }`;

type PanelVariant = { key: string; language: 'bash'; code: string };

function panelFor(revealStage: number): PanelVariant | null {
  if (revealStage >= 2) {
    return { key: 'auto-mode', language: 'bash', code: AUTO_MODE_CODE };
  }
  if (revealStage >= 1) {
    return { key: 'tiers', language: 'bash', code: TIER_CODE };
  }
  return null;
}

const STYLES = `
  @keyframes autoApprovePanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .auto-approve-body {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-lg);
    min-height: 0;
    text-align: left;
  }

  .auto-approve-bullets {
    flex: 0 0 44%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .auto-approve-panel {
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
    animation: autoApprovePanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .auto-approve-panel__viewport {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
  }

  .auto-approve-panel__viewport .code-block {
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

  .auto-approve-panel__viewport .code-block-header { display: none; }
  .auto-approve-panel__viewport .code-block pre {
    flex: 1 1 auto;
    margin: 0 !important;
    height: 100%;
  }
`;

function AutoApproveHookContent({ revealStage }: { revealStage: number }) {
  const panel = panelFor(revealStage);

  return (
    <>
      <style>{STYLES}</style>

      <div className="auto-approve-body">
        {/* Left column: bullets swap (not accumulate) per stage */}
        <div className="auto-approve-bullets">
          {revealStage === 1 && (
            <SlideItem delay={0.05}>
              <Emphasis color="green">хук для класифікації операцій</Emphasis>:
              {' '}LLM-as-a-judge класифікує дії Клода
              {' '}як <Emphasis color="green">SAFE</Emphasis> (read-only, тести) чи{' '}
              <Emphasis color="orange">UNSAFE</Emphasis> (деструктивне, credentials, інфра),
              {' '}повна заборона на коментування, апруви, і т.д.;
              {' '}кешуємо всі рішення для швидкості
            </SlideItem>
          )}

          {revealStage === 2 && (
            <SlideItem delay={0} reveal>
              Anthropic зашипили <Emphasis color="green">--permission-mode auto</Emphasis>
              {' '}— фоновий Sonnet-класифікатор із тією самою філософією: дозволяй
              {' '}безпечні локальні дії, блокуй деструктивні, fail-safe → ручне підтвердження у разі невпевненості
            </SlideItem>
          )}
        </div>

        {/* Right column: framed code panel — stable height across stages */}
        {panel && (
          <div className="auto-approve-panel" key={panel.key}>
            <div className="auto-approve-panel__viewport">
              <CodeBlock language={panel.language} code={panel.code} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const AutoApproveHookSlide: SlideDefinition = {
  id: 'auto-approve-hook',
  maxRevealStages: 2,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">Клод</span>{' '}
      <span className="text-orange">буде намагатися коментувати безпосередньо в коді</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <AutoApproveHookContent revealStage={revealStage} />,
  notes:
    'Stage 0: наш 3-рівневий плагін авто-підтвердження (MCP-анотації → SHA-кеш → LLM-як-суддя з SAFE/UNSAFE класифікацією, fail-safe на помилці). Stage 1: Anthropic зашипили офіційну версію --permission-mode auto — та сама філософія, підтримка на рівні платформи.',
};
