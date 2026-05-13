import { useState, useEffect, useCallback } from 'react';
import { PresentationProps } from '../types/slides';
import { useSlideNavigation } from '../hooks/useSlideNavigation';
import { NavigationContext } from '../context/NavigationContext';
import { useTouchNavigation } from '../hooks/useTouchNavigation';
import { Slide } from './Slide';
import { TerminalInput } from './TerminalInput';
import { SlideProgress } from './SlideProgress';
import { Timer } from './Timer';
import { OnboardingTooltip, ContextTooltip } from './OnboardingTooltip';
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

// Tool keywords for activation persistence
const TOOL_KEYWORDS: Record<string, string[]> = {
  claude: ['claude', 'claude code', 'anthropic'],
  codex: ['codex', 'openai'],
  cursor: ['cursor'],
  amp: ['amp', 'sourcegraph'],
  gemini: ['gemini', 'gemini-cli', 'google'],
  copilot: ['copilot', 'github copilot'],
  lovable: ['lovable'],
  other: ['?', 'other', 'else', 'something'],
};

// Find which tool IDs match the input
function getMatchingToolIds(input: string): string[] {
  const normalizedInput = input.toLowerCase().trim();
  if (normalizedInput.length < 3) return [];
  return Object.entries(TOOL_KEYWORDS)
    .filter(([, keywords]) =>
      keywords.some(kw => normalizedInput.includes(kw) || kw.includes(normalizedInput))
    )
    .map(([id]) => id);
}

function getInitialTimerState(): { seconds: number; running: boolean } {
  const startedAt = localStorage.getItem(TIMER_STARTED_AT_KEY);
  const accumulated = parseInt(localStorage.getItem(TIMER_ACCUMULATED_KEY) || '0', 10);

  if (startedAt) {
    const elapsed = Math.floor((Date.now() - parseInt(startedAt, 10)) / 1000);
    return { seconds: accumulated + elapsed, running: true };
  }
  return { seconds: accumulated, running: false };
}

export function Presentation({ slides, initialSlide = 0 }: PresentationProps) {
  const { currentSlide, goToSlide, goToSlideWithReveal, handleCommand: handleNavCommand, revealStage, revealNext, revealPrev } = useSlideNavigation(
    slides,
    initialSlide
  );

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

  // Track activated tools (persists after Enter)
  const [activatedTools, setActivatedTools] = useState<Set<string>>(new Set());

  // Track if user has interacted on current slide (for tooltips)
  const [slideInteracted, setSlideInteracted] = useState(false);

  // Reset interaction state when slide changes
  useEffect(() => {
    setSlideInteracted(false);
  }, [currentSlide]);

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

  const handleToolsReset = useCallback(() => {
    setActivatedTools(new Set());
  }, []);

  // Command handler that activates tools and delegates navigation
  const handleCommand = useCallback((command: string) => {
    const trimmed = command.trim().toLowerCase();

    // Mark as interacted (hides tooltips)
    setSlideInteracted(true);

    // Only activate tools when on the IntroSlide
    if (slides[currentSlide]?.id === 'intro') {
      const matchingTools = getMatchingToolIds(command);
      if (matchingTools.length > 0) {
        setActivatedTools(prev => {
          const next = new Set(prev);
          matchingTools.forEach(id => next.add(id));
          return next;
        });
      }
    }

    if (trimmed === 'reset') {
      handleToolsReset();
      return;
    }

    handleNavCommand(command);
  }, [handleNavCommand, handleToolsReset, currentSlide, slides]);

  const activeSlide = slides[currentSlide];

  if (!activeSlide) {
    return null;
  }

  const slideContent =
    typeof activeSlide.content === 'function'
      ? activeSlide.content({ revealStage, inputText, activatedTools })
      : activeSlide.content;

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
        >
          {slideContent}
        </Slide>
      </div>
      {!isExportMode && currentSlide === 0 && !slideInteracted && <OnboardingTooltip />}
      {!isExportMode && activeSlide.tooltip &&
        (activeSlide.maxRevealStages
          ? revealStage < activeSlide.maxRevealStages
          : !slideInteracted) && (
        <ContextTooltip>{activeSlide.tooltip}</ContextTooltip>
      )}
      {!isExportMode && (
        <div className="input-bar">
          <Timer
            elapsedSeconds={timerSeconds}
            currentSlide={currentSlide}
            totalSlides={slides.length}
          />
          <TerminalInput
            onCommand={handleCommand}
            onInputChange={setInputText}
            onArrowLeft={revealPrev}
            onArrowRight={revealNext}
            placeholder="type anything to continue, 'prev' to go back, or slide number..."
          />
          {(currentSlide + 1) / slides.length > 0.5 && (
            <SlideProgress
              current={currentSlide + 1}
              total={slides.length}
              isFirst={currentSlide === Math.floor(slides.length / 2)}
            />
          )}
        </div>
      )}
    </div>
    </NavigationContext.Provider>
  );
}
