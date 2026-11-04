import { useEffect, useRef } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { ReactNode } from 'react';
import { SlideItem, Emphasis, revealWindow } from '../components/SlideElements';
import { Lang, T, tr } from '../context/LanguageContext';
import warcraftComplete from '../assets/warcraft-complete.wav?url';
import warcraftYes from '../assets/warcraft-yes.wav?url';
import warcraftWhat from '../assets/warcraft-what.wav?url';
import peasantFace from '../assets/warcraft-peasant-permission.jpeg?url';

const PROMPT_CODE = `claude> Fetch the Warcraft 2 peon/peasant quotes page at warcraft.wiki.gg/wiki/Quotes_of_Warcraft_II#Peon and download the Ready, Yes, Job Complete and What sounds for both Peasant (Alliance) and Peon (Horde). Skip the "Pissed" category.

Organize them into ~/.claude/sounds/warcraft2/{ready,yes,complete,what}/.

Use curl with a browser User-Agent header and download files sequentially with small delays to avoid rate limiting. Verify each .wav with \`file\` — it must report RIFF/WAVE, not ASCII or JSON.

Then add two hooks to the global ~/.claude/settings.json: a Notification hook that plays a random "What?" sound when Claude waits for permission, and a Stop hook that plays a random ready/yes/complete sound when the session ends. Both with afplay -v 1.5.

Use @claude-code-guide (agent) to confirm hook format.`;

// One bullet per stage from stage 1; a window of two, so the opening
// question drops once the third bullet arrives.
const BULLETS_UK: ReactNode[] = [
  <>
    бувало у вас таке, що запускаєте Клода з великим завданням, повертаєтеся через{' '}
    <Emphasis color="orange">30 хвилин</Emphasis> — а він увесь цей час
    чекав на дозвіл виконати <Emphasis color="green">grep</Emphasis> у
    вашому коді?
  </>,
  <>
    ось промпт який вмикатиме{' '}
    <Emphasis color="orange">звук юніта з Warcraft</Emphasis> щоразу, коли Клод зупиняється
  </>,
  <>
    якщо вчасно не встановити всім <Emphasis color="orange">хук для класифікації операцій</Emphasis>
    {' '}— готуйтеся до того, що ваш офіс звучатиме як{' '}
    <Emphasis color="green">комп'ютерний клуб 2000-х</Emphasis>
  </>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>
    ever kicked off Claude on a big task, come back{' '}
    <Emphasis color="orange">30 minutes</Emphasis> later — and it's been
    waiting the whole time for permission to run <Emphasis color="green">grep</Emphasis> on
    your code?
  </>,
  <>
    here's a prompt that plays a{' '}
    <Emphasis color="orange">Warcraft unit sound</Emphasis> every time Claude stops
  </>,
  <>
    roll out the <Emphasis color="orange">operation-classifying hook</Emphasis> to everyone in time
    {' '}— or get ready for your office to sound like a{' '}
    <Emphasis color="green">2000s computer club</Emphasis>
  </>,
];


function WarcraftFunContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
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

      <div className="warcraft-fun-body">
        {/* Left column — bullets accumulate across reveal stages. */}
        <div className="warcraft-fun-bullets">
          {revealWindow(tr(lang, BULLETS_UK, BULLETS_EN), revealStage, 2).map(({ item, index, hidden }) => (
            <SlideItem key={index} delay={index === 0 ? 0.05 : 0} reveal={index > 0} hidden={hidden}>
              {item}
            </SlideItem>
          ))}
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
  maxRevealStages: BULLETS_UK.length,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="людям це теж стане в пригоді" en="humans will find it handy too" /></span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <WarcraftFunContent revealStage={revealStage} lang={lang} />,
  notes:
    'Stage 0: тільки заголовок-питання. Stage 1: знайомий біль (зупинка на grep) + peasant face. Stage 2: рішення — скіл зі звуком на Stop хук + промпт + один "work complete". Stage 3: маркетплейс-наслідок + каскад звуків як у комп\'ютерному клубі 2000-х.',
};
