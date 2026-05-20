import { ReactNode, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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

// "No design system" mode strips the terminal aesthetic — white bg, black
// serif text, no CRT overlay, no bottom-bar chrome, no bullet chevrons —
// so the slide *looks* like raw unstyled HTML before the user reveals the
// "use /fronted-design skill" prompt that switches the look on.
const SCOPED_STYLES = `
  .presentation,
  .presentation::before,
  .presentation::after,
  .presentation .input-bar,
  .presentation .slide-progress,
  .presentation .slide h2,
  .presentation .slide h2 span,
  .presentation .slide .slide-item,
  .presentation .slide .slide-item span,
  .presentation .slide a,
  .presentation .slide a span {
    transition: opacity 0.55s ease, background 0.55s ease, color 0.55s ease;
  }

  .presentation.cc-no-ds::before,
  .presentation.cc-no-ds::after,
  .presentation.cc-no-ds .input-bar,
  .presentation.cc-no-ds .slide-progress {
    opacity: 0;
    pointer-events: none;
  }

  .presentation.cc-no-ds {
    background: #ffffff;
  }
  .presentation.cc-no-ds .slide,
  .presentation.cc-no-ds .slide * {
    font-family: "Times New Roman", Times, serif !important;
  }

  .presentation.cc-no-ds .slide h2,
  .presentation.cc-no-ds .slide h2 span,
  .presentation.cc-no-ds .slide .slide-item,
  .presentation.cc-no-ds .slide .slide-item span {
    color: #000 !important;
    text-shadow: none !important;
  }

  .presentation.cc-no-ds .slide .slide-item__prefix {
    color: #000 !important;
  }

  .presentation.cc-no-ds .slide .slide-item span[style*="terminal-orange"] {
    color: #000 !important;
  }

  .presentation.cc-no-ds .slide a {
    color: #0000EE !important;
    text-decoration: underline !important;
  }
  .presentation.cc-no-ds .slide a span {
    color: #0000EE !important;
    font-weight: normal !important;
  }
`;

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
      <style>{SCOPED_STYLES}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2 style={{ textAlign: 'left', margin: 0 }}>
          <span className="text-dim">&gt;</span>{' '}
          <span className="text-green">ну наприклад</span>
        </h2>

        <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center', minHeight: 0 }}>
          <div
            className="cc-bullets"
            style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}
          >
            <SlideItem delay={0.05}>
              цю презентацію повністю створено у Claude Code
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
                bgColor="#0a0e14"
                fgColor="#7ee787"
                level="M"
                style={{
                  borderRadius: 'var(--input-border-radius)',
                  border: '1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  padding: '12px',
                  background: '#0a0e14',
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
