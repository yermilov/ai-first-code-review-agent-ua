import { useState, useEffect, useRef } from 'react';
import { SlideDefinition, SlideContentProps } from '../types/slides';
import { SlideItem, Emphasis, SlideLink } from '../components/SlideElements';
import { exportRegistry } from '../components/exportRegistry';

const SLIDE_ID = 'start-here';
const YAML_URL =
  'https://raw.githubusercontent.com/anthropics/claude-code-action/main/examples/pr-review-comprehensive.yml';
const YAML_DISPLAY_URL =
  'github.com/anthropics/claude-code-action/blob/main/examples/pr-review-comprehensive.yml';

const STYLES = `
  @keyframes startHereLoadingDot {
    0%, 80%, 100% { opacity: 0; }
    40%           { opacity: 1; }
  }
  /* Scroll animation is driven programmatically via Web Animations API in
     JS once the content has rendered (see StartHereContent). This lets us
     scroll the full content_height − viewport_height distance in pixels
     with a fast-start / decelerating curve, stopping flush at the bottom
     of the file rather than looping. */
  @keyframes startHereRevealPanel {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

function StartHereContent({ revealStage }: { revealStage: number }) {
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

  const colHeight = 'calc(var(--vh-full) - 260px)';

  return (
    <>
      <style>{STYLES}</style>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>

        {/* ── Left column: link + progressive bullets ── */}
        <div style={{ flex: '0 0 44%', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <SlideItem delay={0.08}>
            <SlideLink href={`https://${YAML_DISPLAY_URL}`}>
              {YAML_DISPLAY_URL}
            </SlideLink>
          </SlideItem>

          {revealStage >= 1 && (
            <SlideItem delay={0} reveal>
              як не дивно це вже{' '}
              <Emphasis color="green">працюючий код рев'ювер</Emphasis>
            </SlideItem>
          )}

          {revealStage >= 2 && (
            <SlideItem delay={0} reveal>
              десь так всі стартапи по{' '}
              <Emphasis color="orange">ai-код рев'ю</Emphasis> і побудовані
            </SlideItem>
          )}

          {revealStage >= 3 && (
            <SlideItem delay={0} reveal>
              але ми звичайно{' '}
              <Emphasis color="green">можемо краще</Emphasis>
            </SlideItem>
          )}
        </div>

        {/* ── Right column: scrolling YAML panel ── */}
        <div
          style={{
            flex: 1,
            height: colHeight,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(126,231,135,0.35)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'var(--font-size-small)',
            color: 'rgba(126,231,135,0.85)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'startHereRevealPanel 0.5s ease-out both',
          }}
        >
          {/* CRT scan lines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          }} />

          {/* Top fade */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '60px', zIndex: 4, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }} />

          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 4, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }} />

          {/* Corner decorations */}
          {['top:4px;left:4px', 'top:4px;right:4px', 'bottom:4px;left:4px', 'bottom:4px;right:4px'].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', zIndex: 5, width: '6px', height: '6px',
              borderColor: 'rgba(126,231,135,0.5)',
              borderStyle: 'solid',
              borderWidth: i === 0 ? '1px 0 0 1px' : i === 1 ? '1px 1px 0 0' : i === 2 ? '0 0 1px 1px' : '0 1px 1px 0',
              ...Object.fromEntries(pos.split(';').map(p => { const [k, v] = p.split(':'); return [k, v]; })),
            }} />
          ))}

          {/* Scrollable content area */}
          <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {!content && !error && (
              <div style={{ padding: 'var(--space-md)', color: 'rgba(126,231,135,0.5)' }}>
                {['', '', ''].map((_, i) => (
                  <span key={i} style={{ animation: `startHereLoadingDot 1.4s ${i * 0.2}s ease-in-out infinite` }}>●</span>
                ))}
                {' '}loading pr-review-comprehensive.yml
              </div>
            )}

            {error && (
              <div style={{ padding: 'var(--space-md)', color: 'rgba(240,136,62,0.7)' }}>
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
  maxRevealStages: 3,
  asyncSettle: true,
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">з чого</span>{' '}
      <span className="text-orange">почнемо?</span>
    </>
  ),
  content: ({ revealStage }: SlideContentProps) => <StartHereContent revealStage={revealStage} />,
  notes:
    'Starting point for building your own AI code review: the official anthropics/claude-code-action pr-review-comprehensive.yml example. Stage 0: official example + link. Stage 1: copy-paste-add-API-key gets a working reviewer. Stage 2: customize prompt, allowedTools, add own skills. Right panel scrolls the live YAML content fetched from raw.githubusercontent.com.',
};
