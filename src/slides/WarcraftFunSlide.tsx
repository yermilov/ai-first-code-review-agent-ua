import { useEffect, useRef } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import warcraftComplete from '../assets/warcraft-complete.wav?url';
import warcraftYes from '../assets/warcraft-yes.wav?url';
import warcraftWhat from '../assets/warcraft-what.wav?url';
import peasantFace from '../assets/warcraft-peasant-permission.jpeg?url';

const PROMPT_CODE = `claude> Fetch the Warcraft 2 peon/peasant quotes page at warcraft.wiki.gg/wiki/Quotes_of_Warcraft_II#Peon and download the Ready, Yes, Job Complete and What sounds for both Peasant (Alliance) and Peon (Horde). Skip the "Pissed" category.

Organize them into ~/.claude/sounds/warcraft2/{ready,yes,complete,what}/.

Use curl with a browser User-Agent header and download files sequentially with small delays to avoid rate limiting. Verify each .wav with \`file\` — it must report RIFF/WAVE, not ASCII or JSON.

Then add two hooks to the global ~/.claude/settings.json: a Notification hook that plays a random "What?" sound when Claude waits for permission, and a Stop hook that plays a random ready/yes/complete sound when the session ends. Both with afplay -v 1.5.

Use @claude-code-guide (agent) to confirm hook format.`;

const STYLES = `
  @keyframes warcraftPanelIn {
    from { opacity: 0; transform: translateY(12px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .warcraft-fun-body {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    height: calc(var(--vh-full) - 220px);
    gap: var(--space-lg);
    min-height: 0;
    text-align: left;
  }

  .warcraft-fun-bullets {
    flex: 0 0 36%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .warcraft-fun-right {
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .warcraft-fun-right img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    border-radius: 14px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(126, 231, 135, 0.35);
    animation: warcraftPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .warcraft-fun-panel {
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
    animation: warcraftPanelIn 480ms cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  .warcraft-fun-prompt {
    flex: 1 1 auto;
    margin: 0;
    padding: 1.4rem 1.6rem;
    font-family: var(--font-mono);
    font-size: var(--font-size-code);
    line-height: var(--line-height-relaxed);
    color: #e2e8f0;
    white-space: pre-wrap;
    word-break: normal;
    overflow-wrap: anywhere;
    overflow: auto;
  }
`;

function WarcraftFunContent({ revealStage }: { revealStage: number }) {
  // Track which stages have already triggered audio so re-renders within the
  // same stage don't replay the cascade.
  const triggeredRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (triggeredRef.current.has(revealStage)) return;

    if (revealStage === 2) {
      triggeredRef.current.add(2);
      const a = new Audio(warcraftComplete);
      a.volume = 0.95;
      void a.play().catch(() => {});
      return;
    }

    if (revealStage === 3) {
      triggeredRef.current.add(3);
      // 2000s computer-club cacophony: stagger seven plays across ~1.6s,
      // overlapping yes/complete/what so the office sounds chaotic.
      const cascade = [
        warcraftYes,
        warcraftComplete,
        warcraftWhat,
        warcraftYes,
        warcraftComplete,
        warcraftWhat,
        warcraftYes,
      ];
      const timers = cascade.map((src, i) =>
        window.setTimeout(() => {
          const a = new Audio(src);
          a.volume = 0.7;
          void a.play().catch(() => {});
        }, i * 220),
      );
      return () => {
        timers.forEach(window.clearTimeout);
      };
    }
  }, [revealStage]);

  const showImage = revealStage === 1;
  const showCode = revealStage >= 2;

  return (
    <>
      <style>{STYLES}</style>

      <div className="warcraft-fun-body">
        {/* Left column — bullets accumulate across reveal stages. */}
        <div className="warcraft-fun-bullets">
          {revealStage >= 1 && revealStage < 3 && (
            <SlideItem delay={0.05}>
              бувало у вас таке, що запускаєте Клода з великим завданням, повертаєтеся через{' '}
              <Emphasis color="orange">30 хвилин</Emphasis> — а він увесь цей час
              чекав на дозвіл виконати <Emphasis color="green">grep</Emphasis> у
              вашому коді?
            </SlideItem>
          )}

          {revealStage >= 2 && (
            <SlideItem delay={0} reveal>
              ось промпт який вмикатиме{' '}
              <Emphasis color="orange">звук юніта з Warcraft</Emphasis> щоразу, коли Клод зупиняється
            </SlideItem>
          )}

          {revealStage >= 3 && (
            <SlideItem delay={0} reveal>
              якщо вчасно не встановити всім <Emphasis color="orange">хук для класифікації операцій</Emphasis>
              {' '}— готуйтеся до того, що ваш офіс звучатиме як{' '}
              <Emphasis color="green">комп'ютерний клуб 2000-х</Emphasis>
            </SlideItem>
          )}
        </div>

        {/* Right column — image at stage 1, framed prompt panel at stage 2+. */}
        {showImage && (
          <div className="warcraft-fun-right" key="image">
            <img
              src={peasantFace}
              alt="Warcraft II peasant — work, work."
              loading="lazy"
            />
          </div>
        )}

        {showCode && (
          <div className="warcraft-fun-panel" key="code">
            <pre className="warcraft-fun-prompt">{PROMPT_CODE}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export const WarcraftFunSlide: SlideDefinition = {
  id: 'warcraft-fun',
  maxRevealStages: 3,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">людям це теж буде в нагоді</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <WarcraftFunContent revealStage={revealStage} />,
  notes:
    'Stage 0: тільки заголовок-питання. Stage 1: знайомий біль (зупинка на grep) + peasant face. Stage 2: рішення — скіл зі звуком на Stop хук + промпт + один "work complete". Stage 3: маркетплейс-наслідок + каскад звуків як у комп\'ютерному клубі 2000-х.',
};
