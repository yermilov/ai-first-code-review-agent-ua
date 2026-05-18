import { ReactNode, useState, useEffect } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, SlideLink } from '../components/SlideElements';
import { exportRegistry } from '../components/exportRegistry';
import skillMdFallback from '../assets/skill-creator-skill.md?raw';

const SLIDE_ID = 'meta-skills';
const SKILL_MD_URL =
  'https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/plugins/skill-creator/skills/skill-creator/SKILL.md';

// Two-phase reveal (same idiom as AiCodeReviewSlide):
// FIRST_SET = the meta-skill thesis (full-width bullets, no panel).
// SECOND_SET = prebuilt-vs-custom counterpoint with the live SKILL.md panel.
const FIRST_SET: ReactNode[] = [
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

const SECOND_SET: ReactNode[] = [
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

function MetaSkillsContent({ revealStage }: { revealStage: number }) {
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
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(126, 231, 135, 0.35)',
              borderRadius: '6px',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'var(--font-size-small)',
              color: 'rgba(126, 231, 135, 0.85)',
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
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
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
                  'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
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
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
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
                      borderTop: '1px solid rgba(126, 231, 135, 0.15)',
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
  maxRevealStages: FIRST_SET.length + SECOND_SET.length - 1,
  asyncSettle: true,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">мета</span>{' '}
      <span className="text-orange">скіл</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <MetaSkillsContent revealStage={revealStage} />,
  notes:
    'Мета-скіли — найвища точка важеля. Stage 0–2 (full-width): чому скіл-що-створює-скіли є найважливішим, як його будувати з best practices. Stage 3–4 (з SKILL.md панеллю): або візьміть готовий skill-creator від Anthropic; далі — баланс між готовими та кастомними скілами.',
};
