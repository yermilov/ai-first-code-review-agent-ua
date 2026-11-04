import { ReactNode, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { T } from '../context/LanguageContext';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem } from '../components/SlideElements';

const REPO_URL = 'https://github.com/yermilov/ai-first-code-review-agent-ua';

function Prompt({ children }: { children: ReactNode }) {
  return (
    <span style={{ color: 'var(--terminal-orange)', fontStyle: 'italic' }}>
      '{children}'
    </span>
  );
}

const TASKS: ReactNode[] = [
  <Prompt>hey claude, build static web site from scratch and deploy on github pages</Prompt>,
  <Prompt>hey claude, use /fronted-design skill to come up with terminal inspired design system</Prompt>,
  <Prompt>hey claude, generate qr code from link</Prompt>,
  <Prompt>hey claude, generate images using Gemini</Prompt>,
];

const QR_REVEAL_STAGE = 2;
const DS_REVEAL_STAGE = 1;

// Stage 0 renders as raw unstyled HTML (.cc-no-ds, styles in slide-layouts.css)
// until the /frontend-design prompt is revealed.
function ClaudeCodeContent({ revealStage }: { revealStage: number }) {
  const dsApplied = revealStage >= DS_REVEAL_STAGE;
  useEffect(() => {
    const root = document.querySelector('.presentation');
    if (!root) return;
    if (dsApplied) {
      root.classList.remove('cc-no-ds');
    } else {
      root.classList.add('cc-no-ds');
    }
    return () => {
      root.classList.remove('cc-no-ds');
    };
  }, [dsApplied]);

  return (
    <>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2 style={{ textAlign: 'left', margin: 0 }}>
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green"><T uk="ну наприклад" en="for example" /></span>
        </h2>

        <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center', minHeight: 0 }}>
          <div
            className="cc-bullets"
            style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}
          >
            <SlideItem delay={0.05}>
              {/* EN: own translation */}
              <T uk="цю презентацію повністю створено у Claude Code" en="this whole deck was built in Claude Code" />
            </SlideItem>

            <div
              aria-hidden
              style={{
                height: '1px',
                width: '60%',
                margin: '0.6rem 0 0.4rem',
                background: 'color-mix(in srgb, var(--terminal-green) 25%, transparent)',
              }}
            />

            {TASKS.map((task, i) =>
              revealStage >= i ? (
                <SlideItem key={i} delay={0} reveal>
                  {task}
                </SlideItem>
              ) : null,
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-md)',
            }}
          >
            {revealStage >= QR_REVEAL_STAGE && (
              <QRCodeSVG
                value={REPO_URL}
                size={520}
                className="explore-qr"
                bgColor="var(--terminal-bg)"
                fgColor="var(--terminal-green)"
                level="M"
                style={{
                  borderRadius: 'var(--input-border-radius)',
                  border: '1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent)',
                  boxShadow: '0 8px 32px color-mix(in srgb, var(--terminal-black) 60%, transparent)',
                  padding: '12px',
                  background: 'var(--terminal-bg)',
                }}
              />
            )}

            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                color: 'var(--terminal-green)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--slide-text-normal)',
                textDecoration: 'none',
                borderBottom: 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ color: 'var(--terminal-orange)', fontWeight: 'bold' }}>$</span>
              github.com/yermilov/ai-first-code-review-agent-ua
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export const ClaudeCodeSlide: SlideDefinition = {
  id: 'explore-and-have-fun',
  maxRevealStages: TASKS.length - 1,
  content: ({ revealStage }: SlideContentProps) => <ClaudeCodeContent revealStage={revealStage} />,
  notes:
    `Stage 0: thesis + first prompt ('build static web site...'), raw-HTML look. Stage ${DS_REVEAL_STAGE} ('use /fronted-design skill...'): terminal design system snaps in. Stage ${QR_REVEAL_STAGE} ('generate qr code from link'): right-column QR appears alongside its matching prompt.`,
};
