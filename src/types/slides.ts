import { ReactNode } from 'react';
import type { Lang } from '../context/LanguageContext';

export interface SlideContentProps {
  revealStage: number;
  inputText: string;
  /** Active deck language — `english` / `ukrainian` commands, `?lang=en`. */
  lang: Lang;
}

export interface SlideDefinition {
  id: string;
  content: ReactNode | ((props: SlideContentProps) => ReactNode);
  /** Optional fixed top-left title rendered by Slide.tsx, in the shell idiom
   * (dim `>`, green command, orange flag). Omit for hero / section-break
   * slides that own their full composition. A function derives the title
   * from reveal state. */
  title?: ReactNode | ((props: SlideContentProps) => ReactNode);
  notes?: string;
  /** Full-bleed CSS background on `.slide`; a function picks it per language (localised art). */
  background?: string | ((props: { lang: Lang }) => string);
  /** Optional contextual tooltip shown next to the slide (ported from pragmatic-vibe-clauding-ua). */
  tooltip?: ReactNode;
  maxRevealStages?: number;
  initialRevealStage?: number;
  /**
   * Optional non-linear detours. When the presenter advances past `atStage`
   * on this slide, navigation jumps to the slide with id `toId` (at reveal 0);
   * once that slide is fully revealed, it returns here at `returnStage`. Detour
   * targets are skipped on the subsequent linear pass. Multiple detours from
   * one slide should list their target slides consecutively right after it.
   */
  detours?: { atStage: number; toId: string; returnStage: number }[];
  /**
   * Opt out of the export-mode auto-settle in Slide.tsx. Set true on slides
   * that do their own async work (fetches, etc.) and call
   * `exportRegistry.markSlideSettled(id)` from the async path themselves.
   */
  asyncSettle?: boolean;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  filename?: string;
}

export interface TerminalInputProps {
  onCommand: (command: string) => void;
  onInputChange?: (value: string) => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface PresentationProps {
  slides: SlideDefinition[];
  initialSlide?: number;
}

export interface SlideProps {
  children: ReactNode;
  isActive: boolean;
  notes?: string;
  background?: string;
  /** Threaded so non-async slides can auto-settle via exportRegistry. */
  slideId?: string;
  asyncSettle?: boolean;
}

export interface SlideProgressProps {
  /** 1-based step on the talk path (utils/traversal.ts) */
  current: number;
  /** total steps — every reveal of every slide, detours inlined */
  total: number;
}

export type NavigationCommand =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; slideNumber: number };
