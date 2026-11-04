import { useState, useEffect, useCallback } from 'react';
import { PresentationProps } from '../types/slides';
import { useSlideNavigation } from '../hooks/useSlideNavigation';
import { NavigationContext } from '../context/NavigationContext';
import { useTouchNavigation } from '../hooks/useTouchNavigation';
import { Slide } from './Slide';
import { TerminalInput } from './TerminalInput';
import { SlideProgress } from './SlideProgress';
import { Timer } from './Timer';
import { RotateHint } from './RotateHint';
import { preloadSlideAssets } from '../utils/preloadAssets';
import { exportRegistry } from './exportRegistry';

declare global {
  interface Window {
    __deckExport?: {
      slideCount: number;
      slideIdAt: (i: number) => string;
      maxRevealStagesAt: (i: number) => number;
      goTo: (i: number, revealStage: number) => void;
      waitForSettled: (slideId: string, timeoutMs?: number) => Promise<void>;
      reset: () => void;
    };
  }
}

const isExportMode =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('export') === '1';

const TIMER_STARTED_AT_KEY = 'timerStartedAt';
const TIMER_ACCUMULATED_KEY = 'timerAccumulated';
const THEME_KEY = 'theme';

/** A stored timer start older than this is a previous run, not this talk.
 *  Without the expiry a deck opened days later loads with the clock already
 *  run out and the pace colour red. Four hours is far longer than any slot
 *  and far shorter than "another day". */
const STALE_TIMER_MS = 4 * 60 * 60 * 1000;
type Theme = 'dark' | 'light';

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

function getInitialTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'dark';
  return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
}

function getInitialTimerState(): { seconds: number; running: boolean } {
  const startedAt = localStorage.getItem(TIMER_STARTED_AT_KEY);
  const accumulated = parseInt(localStorage.getItem(TIMER_ACCUMULATED_KEY) || '0', 10);

  if (startedAt) {
    const startedMs = parseInt(startedAt, 10);
    const sinceStart = Date.now() - startedMs;

    if (!Number.isFinite(startedMs) || sinceStart > STALE_TIMER_MS || sinceStart < 0) {
      localStorage.removeItem(TIMER_STARTED_AT_KEY);
      localStorage.removeItem(TIMER_ACCUMULATED_KEY);
      return { seconds: 0, running: false };
    }

    return { seconds: accumulated + Math.floor(sinceStart / 1000), running: true };
  }
  return { seconds: accumulated, running: false };
}

export function Presentation({ slides, initialSlide = 0 }: PresentationProps) {
  const { currentSlide, step, totalSteps, goToSlide, goToSlideWithReveal, handleCommand: handleNavCommand, revealStage, revealNext, revealPrev } = useSlideNavigation(
    slides,
    initialSlide
  );

  // Theme state — applies `[data-theme]` on <html>, persists to localStorage.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Expose Playwright-driven navigation API in export mode.
  useEffect(() => {
    if (!isExportMode) return;
    window.__deckExport = {
      slideCount: slides.length,
      slideIdAt: (i: number) => slides[i]?.id ?? '',
      maxRevealStagesAt: (i: number) => slides[i]?.maxRevealStages ?? 0,
      goTo: (i: number, r: number) => goToSlideWithReveal(i, r),
      waitForSettled: (id: string, timeoutMs?: number) => exportRegistry.waitForSettled(id, timeoutMs),
      reset: () => exportRegistry.reset(),
    };
    return () => {
      delete window.__deckExport;
    };
  }, [slides, goToSlideWithReveal]);

  const goToSlideById = useCallback((id: string) => {
    const index = slides.findIndex(s => s.id === id);
    if (index !== -1) goToSlide(index);
  }, [slides, goToSlide]);

  const { containerRef } = useTouchNavigation({ onNext: revealNext, onPrev: revealPrev });

  // Track current input text for interactive slides
  const [inputText, setInputText] = useState('');

  // Warm the HTTP cache for every downstream slide asset while the title
  // slide is on screen. Deferred to idle so the first paint is unblocked.
  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      const handle = win.requestIdleCallback(preloadSlideAssets);
      return () => win.cancelIdleCallback?.(handle);
    }
    const timeout = window.setTimeout(preloadSlideAssets, 200);
    return () => window.clearTimeout(timeout);
  }, []);

  // Timer state with localStorage persistence
  const [timerSeconds, setTimerSeconds] = useState(() => getInitialTimerState().seconds);
  const [timerRunning, setTimerRunning] = useState(() => getInitialTimerState().running);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleTimerStart = useCallback(() => {
    setTimerRunning(true);
    setTimerSeconds((currentSeconds) => {
      localStorage.setItem(TIMER_STARTED_AT_KEY, Date.now().toString());
      localStorage.setItem(TIMER_ACCUMULATED_KEY, currentSeconds.toString());
      return currentSeconds;
    });
  }, []);

  // Auto-start timer when leaving the title slide; reset when returning to it
  useEffect(() => {
    if (currentSlide === 0) {
      setTimerRunning(false);
      setTimerSeconds(0);
      localStorage.removeItem(TIMER_STARTED_AT_KEY);
      localStorage.removeItem(TIMER_ACCUMULATED_KEY);
    } else if (!timerRunning) {
      handleTimerStart();
    }
  }, [currentSlide]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCommand = useCallback((command: string) => {
    const trimmed = command.trim().toLowerCase();

    if (trimmed === 'dark' || trimmed === 'light') {
      setTheme(trimmed);
      return;
    }

    handleNavCommand(command);
  }, [handleNavCommand]);

  const activeSlide = slides[currentSlide];

  if (!activeSlide) {
    return null;
  }

  const contentProps = { revealStage, inputText };
  const slideContent =
    typeof activeSlide.content === 'function'
      ? activeSlide.content(contentProps)
      : activeSlide.content;
  const slideTitle =
    typeof activeSlide.title === 'function'
      ? activeSlide.title(contentProps)
      : activeSlide.title;

  // Progress weights every reveal equally: it answers "how much talk is
  // left", not "how many slides". Hidden until the talk is past half-way.
  const progressCurrent = step + 1;

  return (
    <NavigationContext.Provider value={{ goToSlideById }}>
    <div className="presentation">
      {!isExportMode && <RotateHint />}
      <div className="slide-container" ref={containerRef} key={activeSlide.id}>
        <Slide
          isActive
          notes={activeSlide.notes}
          background={activeSlide.background}
          slideId={activeSlide.id}
          asyncSettle={activeSlide.asyncSettle}
          title={slideTitle}
        >
          {slideContent}
        </Slide>
      </div>
      {!isExportMode && (
        <div className="input-bar">
          <Timer
            elapsedSeconds={timerSeconds}
            currentStep={step}
            totalSteps={totalSteps}
          />
          <TerminalInput
            onCommand={handleCommand}
            onInputChange={setInputText}
            onArrowLeft={revealPrev}
            onArrowRight={revealNext}
            placeholder="type anything to continue, 'prev' to go back, or slide number..."
          />
          <SlideProgress
            current={progressCurrent}
            total={totalSteps}
            isFirst={progressCurrent === Math.floor(totalSteps / 2) + 1}
            hidden={progressCurrent / totalSteps <= 0.5}
          />
        </div>
      )}
    </div>
    </NavigationContext.Provider>
  );
}
