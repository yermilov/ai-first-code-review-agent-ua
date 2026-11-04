import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, SlideLink, Code } from '../components/SlideElements';
import { CodeBlock } from '../components/CodeBlock';
import { tr, type Lang } from '../context/LanguageContext';

const TRACER_CODE = `export async function uploadSession(
  sessionId: string,
  workDir: string,
) {
  const encoded = workDir.replace(/\\//g, "-");
  const path = join(homedir(), ".claude",
    "projects", encoded, \`\${sessionId}.jsonl\`);
  const body = new FormData();
  body.append("file",
    new Blob([await readFile(path)]),
    \`\${sessionId}.jsonl\`);
  await fetch(VIBES_API_URL, {
    method: "POST", body,
  });
}`;

const FIRST_BULLET_UK: ReactNode = (
  <>
    завантажуйте <Code>.jsonl</Code>-лог кожної сесії агента
    {' '}в <Emphasis color="green">S3</Emphasis>
    {' '}— і <Emphasis color="orange">ви зможете дебажити</Emphasis>, як саме він працює, та що можна покращити
  </>
);

const SECOND_SET_UK: ReactNode[] = [
  <>
    <Emphasis color="orange">СТОП, ПОПАЛИСЬ!</Emphasis>
    {' '}не робіть нічого вручну: напишіть <Emphasis color="green">скіл</Emphasis>,
    {' '}який витягуватиме семпли сесій, аналізуватиме їх і пропонуватиме покращення
    {' '}для ваших скілів та інструкцій агентів
  </>,
  <>
    людям ділитися своїми сесіями ще цінніше — це створює основу для{' '}
    <Emphasis color="orange">командної пам'яті</Emphasis>;
    {' '}можна використати ту саму інфраструктуру або спробувати{' '}
    <SlideLink href="https://entire.io">entire.io</SlideLink>
  </>,
  <>
    тепер агенти можуть <Emphasis color="green">рев'ювити сесії людей</Emphasis>,
    {' '}а також напівавтоматично створювати чи оновлювати скіли
    {' '}на основі їхнього аналізу
  </>,
];

// EN: own translation
const FIRST_BULLET_EN: ReactNode = (
  <>
    upload every agent session's <Code>.jsonl</Code> log
    {' '}to <Emphasis color="green">S3</Emphasis>
    {' '}— and <Emphasis color="orange">you can debug</Emphasis> exactly how it works and what to improve
  </>
);

// EN: own translation
const SECOND_SET_EN: ReactNode[] = [
  <>
    <Emphasis color="orange">STOP, GOTCHA!</Emphasis>
    {' '}don't do any of it by hand: write a <Emphasis color="green">skill</Emphasis>
    {' '}that pulls session samples, analyses them and suggests improvements
    {' '}to your skills and agent instructions
  </>,
  <>
    people sharing their sessions is worth even more — it lays the ground for{' '}
    <Emphasis color="orange">team memory</Emphasis>;
    {' '}reuse the same infrastructure or try{' '}
    <SlideLink href="https://entire.io">entire.io</SlideLink>
  </>,
  <>
    now agents can <Emphasis color="green">review people's sessions</Emphasis>,
    {' '}and semi-automatically create or update skills
    {' '}based on what they find
  </>,
];

function AgentTracesContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const FIRST_BULLET = tr(lang, FIRST_BULLET_UK, FIRST_BULLET_EN);
  const SECOND_SET = tr(lang, SECOND_SET_UK, SECOND_SET_EN);
  const setIndex = revealStage === 0 ? 0 : 1;
  const visibleCount = setIndex === 1 ? revealStage : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(var(--vh-full) - 220px)',
      }}
    >
      <h2 style={{ textAlign: 'left', margin: 0 }}>
        <span className="text-dim">&gt;</span>{' '}
        <span className="text-green">{tr(lang, 'зберігайте', 'keep the')}</span>{' '}
        <span className="text-orange">{tr(lang, 'квитанції', 'receipts')}</span>
      </h2>

      <div
        key={setIndex}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: setIndex === 0 ? '2rem' : 0,
          minHeight: 0,
          ['--slide-line-height-normal' as string]: '1.3',
        } as React.CSSProperties}
      >
        <div
          style={{
            flex: setIndex === 0 ? '0 0 50%' : 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.6rem',
            textAlign: 'left',
          }}
        >
          {setIndex === 0 ? (
            <SlideItem delay={0.05}>{FIRST_BULLET}</SlideItem>
          ) : (
            SECOND_SET.slice(0, visibleCount).map((bullet, i) => (
              <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
            ))
          )}
        </div>

        {setIndex === 0 && (
          <div className="agent-traces-panel">
            <div className="agent-traces-panel__viewport">
              <CodeBlock language="typescript" code={TRACER_CODE} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const AgentTracesSlide: SlideDefinition = {
  id: 'agent-traces',
  maxRevealStages: SECOND_SET_UK.length,
  initialRevealStage: 0,
  content: ({ revealStage, lang }: SlideContentProps) => <AgentTracesContent revealStage={revealStage} lang={lang} />,
  notes:
    'Треси агентів — observability для автономної роботи. Phase 0: теза "завантажуйте .jsonl кожної сесії на S3" + uploadSession TS-сніпет. Phase 1 (по одному булету): "СТОП, ПОПАЛИСЬ — напишіть скіл-аналізатор" → "людям шарити свої сесії ще цінніше — entire.io" → "агенти рев\'юють людські сесії і напів-автоматично оновлюють скіли".',
};
