import { ReactNode, useState, useEffect } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, SlideLink } from '../components/SlideElements';
import { exportRegistry } from '../components/exportRegistry';
import { tr, type Lang } from '../context/LanguageContext';
import skillMdFallback from '../assets/skill-creator-skill.md?raw';

const SLIDE_ID = 'meta-skills';
const SKILL_MD_URL =
  'https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/skill-creator/skills/skill-creator/SKILL.md';

// Two-phase reveal (same idiom as AiCodeReviewSlide):
// FIRST_SET = the meta-skill thesis (full-width bullets, no panel).
// SECOND_SET = prebuilt-vs-custom counterpoint with the live SKILL.md panel.
const FIRST_SET_UK: ReactNode[] = [
  <>найважливіший скіл у вашому маркетплейсі — це{' '}
    <Emphasis color="orange">скіл, що створює скіли</Emphasis></>,
  <>від його якості залежить якість{' '}
    <Emphasis color="orange">усіх</Emphasis> скілів у вашому маркетплейсі</>,
  <>змусьте Клода прочитати{' '}
    <SlideLink href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
      platform.claude.com/docs/.../agent-skills/best-practices
    </SlideLink>{' '}
    як відправну точку</>,
];

const SECOND_SET_UK: ReactNode[] = [
  <>або просто візьміть <Emphasis color="green">готовий</Emphasis> skill-creator
    від Anthropic:{' '}
    <SlideLink href="https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator">
      github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator
    </SlideLink></>,
  <>ваша наступна проблема — баланс між{' '}
    <Emphasis color="green">готовим</Emphasis> скілом, на який не треба витрачати
    час і зусилля, та <Emphasis color="orange">кастомним</Emphasis> скілом,
    який може врахувати всю вашу in-house специфіку</>,
];

// EN: own translation
const FIRST_SET_EN: ReactNode[] = [
  <>the most important skill in your marketplace is the{' '}
    <Emphasis color="orange">skill that creates skills</Emphasis></>,
  <>its quality sets the quality of{' '}
    <Emphasis color="orange">every</Emphasis> skill in your marketplace</>,
  <>make Claude read{' '}
    <SlideLink href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">
      platform.claude.com/docs/.../agent-skills/best-practices
    </SlideLink>{' '}
    as the starting point</>,
];

// EN: own translation
const SECOND_SET_EN: ReactNode[] = [
  <>or just take the <Emphasis color="green">ready-made</Emphasis> skill-creator
    from Anthropic:{' '}
    <SlideLink href="https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator">
      github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator
    </SlideLink></>,
  <>your next problem is the balance between a{' '}
    <Emphasis color="green">ready-made</Emphasis> skill that costs you no time or effort
    and a <Emphasis color="orange">custom</Emphasis> one that can capture
    all your in-house specifics</>,
];

const STYLES = `
  @keyframes metaSkillsPanelIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes metaSkillsScroll {
    0%    { transform: translateY(0);     animation-timing-function: linear; }
    12.5% { transform: translateY(-1%);   animation-timing-function: linear; }
    25%   { transform: translateY(-5%);   animation-timing-function: linear; }
    50%   { transform: translateY(-20%);  animation-timing-function: linear; }
    100%  { transform: translateY(-100%); }
  }
`;

function MetaSkillsContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const FIRST_SET = tr(lang, FIRST_SET_UK, FIRST_SET_EN);
  const SECOND_SET = tr(lang, SECOND_SET_UK, SECOND_SET_EN);
  // Render the bundled snapshot immediately so the panel never flashes empty
  // on a flaky network; swap to the live SKILL.md as soon as fetch resolves.
  const [content, setContent] = useState<string>(skillMdFallback);

  useEffect(() => {
    fetch(SKILL_MD_URL)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      })
      .then(text => {
        setContent(text);
        exportRegistry.markSlideSettled(SLIDE_ID);
      })
      .catch(() => {
        // Keep the fallback visible; settle so the exporter moves on.
        exportRegistry.markSlideSettled(SLIDE_ID);
      });
  }, []);

  const setIndex = revealStage < FIRST_SET.length ? 0 : 1;
  const currentSet = setIndex === 0 ? FIRST_SET : SECOND_SET;
  const visibleCount =
    setIndex === 0 ? revealStage + 1 : revealStage - FIRST_SET.length + 1;

  return (
    <>
      <style>{STYLES}</style>

      <div
        key={setIndex}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: setIndex === 0 ? 0 : 'var(--space-lg)',
          minHeight: 0,
          height: 'calc(var(--vh-full) - 220px)',
        }}
      >
        {/* Bullets — full-width on the thesis half, ~46% column once the
            SKILL.md panel joins the layout. */}
        <div
          style={{
            flex: setIndex === 0 ? 1 : '0 0 46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            textAlign: 'left',
            minWidth: 0,
          }}
        >
          {currentSet.slice(0, visibleCount).map((bullet, i) => (
            <SlideItem key={i} delay={i === 0 ? 0.05 : 0}>{bullet}</SlideItem>
          ))}
        </div>

        {/* Right — scrolling SKILL.md panel, only on the second set. */}
        {setIndex === 1 && (
          <div
            style={{
              flex: 1,
              background: 'color-mix(in srgb, var(--terminal-black) 60%, transparent)',
              border: '1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent)',
              borderRadius: '6px',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'var(--font-size-code)',
              color: 'color-mix(in srgb, var(--terminal-green) 85%, transparent)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'metaSkillsPanelIn 0.5s ease-out both',
              minHeight: 0,
            }}
          >
            {/* CRT scan lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                pointerEvents: 'none',
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--terminal-black) 8%, transparent) 2px, color-mix(in srgb, var(--terminal-black) 8%, transparent) 4px)',
              }}
            />

            {/* Top fade */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 4,
                pointerEvents: 'none',
                background:
                  'linear-gradient(to bottom, color-mix(in srgb, var(--terminal-black) 85%, transparent) 0%, transparent 100%)',
              }}
            />

            {/* Bottom fade */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 4,
                pointerEvents: 'none',
                background:
                  'linear-gradient(to top, color-mix(in srgb, var(--terminal-black) 85%, transparent) 0%, transparent 100%)',
              }}
            />

            {/* Scrolling content — repeated block for seamless loop */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
                <div
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    whiteSpace: 'pre-wrap',
                    textAlign: 'left',
                    lineHeight: '1.6',
                    animation: 'metaSkillsScroll 120s linear infinite',
                    willChange: 'transform',
                  }}
                >
                  {content}
                  <div
                    style={{
                      marginTop: '2em',
                      borderTop: '1px solid color-mix(in srgb, var(--terminal-green) 15%, transparent)',
                      paddingTop: '2em',
                    }}
                  >
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const MetaSkillsSlide: SlideDefinition = {
  id: SLIDE_ID,
  // 5 reveal stages: 0..2 walk through FIRST_SET (full-width thesis),
  // 3..4 walk through SECOND_SET alongside the SKILL.md panel.
  maxRevealStages: FIRST_SET_UK.length + SECOND_SET_UK.length - 1,
  asyncSettle: true,
  title: ({ lang }: SlideContentProps) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">{tr(lang, 'мета', 'meta')}</span>{' '}
      <span className="text-orange">{tr(lang, 'скіл', 'skill')}</span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <MetaSkillsContent revealStage={revealStage} lang={lang} />,
  notes:
    'Мета-скіли — найвища точка важеля. Stage 0–2 (full-width): чому скіл-що-створює-скіли є найважливішим, як його будувати з best practices. Stage 3–4 (з SKILL.md панеллю): або візьміть готовий skill-creator від Anthropic; далі — баланс між готовими та кастомними скілами.',
};
