import { useState, useEffect, useRef } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, SlideLink } from '../components/SlideElements';
import { exportRegistry } from '../components/exportRegistry';
import { Lang, T, tr } from '../context/LanguageContext';
import { ReactNode } from 'react';

const SLIDE_ID = 'start-here';
const YAML_URL =
  'https://raw.githubusercontent.com/anthropics/claude-code-action/main/examples/pr-review-comprehensive.yml';
const YAML_DISPLAY_URL =
  'github.com/anthropics/claude-code-action/blob/main/examples/pr-review-comprehensive.yml';

const BULLETS_UK: ReactNode[] = [
  <>Як не дивно, це вже{' '}<Emphasis color="green">робочий код рев'ювер</Emphasis></>,
  <>десь так і побудовані всі стартапи у сфері{' '}<Emphasis color="orange">AI code review</Emphasis></>,
  <>але ми звичайно{' '}<Emphasis color="green">можемо краще</Emphasis></>,
];

// EN: own translation
const BULLETS_EN: ReactNode[] = [
  <>surprisingly, this is already a{' '}<Emphasis color="green">working code reviewer</Emphasis></>,
  <>roughly how every{' '}<Emphasis color="orange">AI code review</Emphasis> startup is built</>,
  <>but of course we{' '}<Emphasis color="green">can do better</Emphasis></>,
];


function StartHereContent({ revealStage, lang }: { revealStage: number; lang: Lang }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(YAML_URL)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      })
      .then(text => {
        setContent(text);
        exportRegistry.markSlideSettled(SLIDE_ID);
      })
      .catch(() => {
        setError(true);
        exportRegistry.markSlideSettled(SLIDE_ID);
      });
  }, []);

  // Once the YAML has rendered, measure how far it needs to scroll so the
  // last line lands flush with the bottom of the viewport, then drive that
  // scroll via Web Animations API. Fast at the start, decelerating into a
  // near-stop at the bottom — and it STOPS, no looping.
  useEffect(() => {
    if (!content) return;
    const id = requestAnimationFrame(() => {
      const inner = contentRef.current;
      const outer = containerRef.current;
      if (!inner || !outer) return;
      const distance = Math.max(0, inner.scrollHeight - outer.clientHeight);
      inner.animate(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(-${distance * 0.42}px)`, offset: 0.15 },
          { transform: `translateY(-${distance * 0.72}px)`, offset: 0.35 },
          { transform: `translateY(-${distance * 0.90}px)`, offset: 0.60 },
          { transform: `translateY(-${distance * 0.98}px)`, offset: 0.85 },
          { transform: `translateY(-${distance}px)` },
        ],
        {
          duration: 30_000,
          easing: 'linear',
          fill: 'forwards',
          iterations: 1,
        },
      );
    });
    return () => cancelAnimationFrame(id);
  }, [content]);

  return (
    <>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'stretch', height: '100%', minHeight: 0 }}>

        {/* ── Left column: link + progressive bullets ── */}
        <div style={{ flex: '0 0 44%', alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <SlideItem delay={0.08}>
            <SlideLink href={`https://${YAML_DISPLAY_URL}`}>
              {YAML_DISPLAY_URL}
            </SlideLink>
          </SlideItem>

          {tr(lang, BULLETS_UK, BULLETS_EN).map((bullet, i) => (
            <SlideItem key={i} delay={0} reveal hidden={revealStage < i + 1}>
              {bullet}
            </SlideItem>
          ))}
        </div>

        {/* ── Right column: scrolling YAML panel ── */}
        <div
          style={{
            flex: 1,
            height: '100%',
            background: 'color-mix(in srgb, var(--terminal-black) 60%, transparent)',
            border: '1px solid color-mix(in srgb, var(--terminal-green) 35%, transparent)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-code)',
            color: 'color-mix(in srgb, var(--terminal-green) 85%, transparent)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'startHereRevealPanel 0.5s ease-out both',
          }}
        >
          {/* CRT scan lines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--terminal-black) 8%, transparent) 2px, color-mix(in srgb, var(--terminal-black) 8%, transparent) 4px)',
          }} />

          {/* Top fade */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '60px', zIndex: 4, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, color-mix(in srgb, var(--terminal-black) 85%, transparent) 0%, transparent 100%)',
          }} />

          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 4, pointerEvents: 'none',
            background: 'linear-gradient(to top, color-mix(in srgb, var(--terminal-black) 85%, transparent) 0%, transparent 100%)',
          }} />

          {/* Corner decorations */}
          {['top:4px;left:4px', 'top:4px;right:4px', 'bottom:4px;left:4px', 'bottom:4px;right:4px'].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', zIndex: 5, width: '6px', height: '6px',
              borderColor: 'color-mix(in srgb, var(--terminal-green) 50%, transparent)',
              borderStyle: 'solid',
              borderWidth: i === 0 ? '1px 0 0 1px' : i === 1 ? '1px 1px 0 0' : i === 2 ? '0 0 1px 1px' : '0 1px 1px 0',
              ...Object.fromEntries(pos.split(';').map(p => { const [k, v] = p.split(':'); return [k, v]; })),
            }} />
          ))}

          {/* Scrollable content area */}
          <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {!content && !error && (
              <div style={{ padding: 'var(--space-md)', color: 'color-mix(in srgb, var(--terminal-green) 50%, transparent)' }}>
                {['', '', ''].map((_, i) => (
                  <span key={i} style={{ animation: `startHereLoadingDot 1.4s ${i * 0.2}s ease-in-out infinite` }}>●</span>
                ))}
                {' '}loading pr-review-comprehensive.yml
              </div>
            )}

            {error && (
              <div style={{ padding: 'var(--space-md)', color: 'color-mix(in srgb, var(--terminal-orange) 70%, transparent)' }}>
                ✗ failed to fetch pr-review-comprehensive.yml
              </div>
            )}

            {content && (
              <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
                <div
                  ref={contentRef}
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    whiteSpace: 'pre',
                    textAlign: 'left',
                    lineHeight: '1.55',
                    willChange: 'transform',
                  }}
                >
                  {content}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </>
  );
}

export const StartHereSlide: SlideDefinition = {
  id: SLIDE_ID,
  maxRevealStages: BULLETS_UK.length,
  asyncSettle: true,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="з чого" en="where do" /></span>{' '}
      <span className="text-orange"><T uk="почнемо?" en="we start?" /></span>
    </>
  ),
  content: ({ revealStage, lang }: SlideContentProps) => <StartHereContent revealStage={revealStage} lang={lang} />,
  notes:
    'Starting point for building your own AI code review: the official anthropics/claude-code-action pr-review-comprehensive.yml example. Stage 0: official example + link. Stage 1: copy-paste-add-API-key gets a working reviewer. Stage 2: customize prompt, allowedTools, add own skills. Right panel scrolls the live YAML content fetched from raw.githubusercontent.com.',
};
