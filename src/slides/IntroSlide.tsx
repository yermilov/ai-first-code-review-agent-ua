import { ReactNode } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';

const BASE_URL = import.meta.env.BASE_URL;

type Tool = {
  id: string;
  name: string;
  logo: string | null;
  take: ReactNode;
};

const TOOLS: Tool[] = [
  { id: 'claude',   name: 'Claude Code',  logo: `${BASE_URL}logos/claude.svg`,         take: 'легенда, кращого не існує' },
  { id: 'codex',    name: 'Codex',        logo: `${BASE_URL}logos/openai.svg`,         take: 'класна модель, cli відстає' },
  { id: 'cursor',   name: 'Cursor',       logo: `${BASE_URL}logos/cursor.svg`,         take: 'для тих, хто не відпускає IDE' },
  { id: 'amp',      name: 'Amp',          logo: `${BASE_URL}logos/sourcegraph.svg`,    take: 'цікаво, але навіщо неясно' },
  { id: 'gemini',   name: 'Gemini CLI',   logo: `${BASE_URL}logos/gemini.svg`,         take: 'загалом неясно навіщо' },
  { id: 'copilot',  name: 'Copilot',      logo: `${BASE_URL}logos/github-copilot.svg`, take: 'просто погано' },
  { id: 'lovable',  name: 'Lovable',      logo: `${BASE_URL}logos/lovable.svg`,        take: 'для фахівців не з інжинірингу' },
  { id: 'wildcard', name: '?',            logo: null,                                   take: '' },
];

function ToolCard({
  tool,
  takeShown,
  identityShown,
}: {
  tool: Tool;
  takeShown: boolean;
  identityShown: boolean;
}) {
  const isWildcard = tool.logo === null;

  const classes = [
    'tool-takes-card',
    takeShown && 'tool-takes-card--take-shown',
    identityShown && 'tool-takes-card--identity-shown',
    isWildcard && 'tool-takes-card--wildcard',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="tool-takes-icon">
        {tool.logo ? (
          <img src={tool.logo} alt="" loading="lazy" />
        ) : (
          <span className="tool-takes-icon__glyph">?</span>
        )}
      </div>
      {!isWildcard && (
        <div className="tool-takes-name">{identityShown ? tool.name : '???'}</div>
      )}
      <div className="tool-takes-take">{takeShown ? tool.take : ' '}</div>
    </div>
  );
}

export const IntroSlide: SlideDefinition = {
  id: 'intro',
  maxRevealStages: TOOLS.length - 1,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-orange">(не)популярні</span>{' '}
      <span className="text-green">думки про тули</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => (
    <div className="tool-takes-grid">
      {TOOLS.map((tool, i) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          takeShown={true}
          identityShown={revealStage >= i}
        />
      ))}
    </div>
  ),
};
