import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';
import { Lang, T, tr } from '../context/LanguageContext';

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


function AutoApproveHookContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const panel = panelFor(revealStage);

  return (
    <>

      <div className="auto-approve-body">
        {/* Left column: bullets swap (not accumulate) per stage */}
        <div className="auto-approve-bullets">
          {revealStage === 1 && (
            <SlideItem delay={0.05}>
              {tr(lang,
                <>
                  <Emphasis color="green">хук для класифікації операцій</Emphasis>:
                  {' '}LLM-as-a-judge класифікує дії Клода
                  {' '}як <Emphasis color="green">SAFE</Emphasis> (read-only, тести) чи{' '}
                  <Emphasis color="orange">UNSAFE</Emphasis> (деструктивне, credentials, інфра),
                  {' '}повна заборона на коментування, апруви, і т.д.;
                  {' '}кешуємо всі рішення для швидкості
                </>,
                // EN: own translation
                <>
                  <Emphasis color="green">a hook that classifies operations</Emphasis>:
                  {' '}an LLM-as-a-judge labels Claude's actions
                  {' '}<Emphasis color="green">SAFE</Emphasis> (read-only, tests) or{' '}
                  <Emphasis color="orange">UNSAFE</Emphasis> (destructive, credentials, infra),
                  {' '}commenting, approvals etc. are banned outright;
                  {' '}every decision is cached for speed
                </>,
              )}
            </SlideItem>
          )}

          {revealStage === 2 && (
            <SlideItem delay={0} reveal>
              {tr(lang,
                <>
                  Anthropic зашипили <Emphasis color="green">--permission-mode auto</Emphasis>
                  {' '}— фоновий Sonnet-класифікатор із тією самою філософією: дозволяй
                  {' '}безпечні локальні дії, блокуй деструктивні, fail-safe → ручне підтвердження у разі невпевненості
                </>,
                // EN: own translation
                <>
                  then Anthropic shipped <Emphasis color="green">--permission-mode auto</Emphasis>
                  {' '}— a background Sonnet classifier with the same philosophy: allow
                  {' '}safe local actions, block destructive ones, fail-safe → ask the human when unsure
                </>,
              )}
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
      {/* EN: own translation */}
      <span className="text-green"><T uk="Клод" en="Claude" /></span>{' '}
      <span className="text-orange"><T uk="буде намагатися коментувати безпосередньо в коді" en="will try to comment straight in the code" /></span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <AutoApproveHookContent revealStage={revealStage} lang={lang} />,
  notes:
    'Stage 0: наш 3-рівневий плагін авто-підтвердження (MCP-анотації → SHA-кеш → LLM-як-суддя з SAFE/UNSAFE класифікацією, fail-safe на помилці). Stage 1: Anthropic зашипили офіційну версію --permission-mode auto — та сама філософія, підтримка на рівні платформи.',
};
