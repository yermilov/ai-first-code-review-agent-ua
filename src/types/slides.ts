import { ReactNode } from 'react';

export interface SlideContentProps {
  revealStage: number;
  inputText: string;
  activatedTools: Set<string>;
}

export interface SlideDefinition {
  id: string;
  content: ReactNode | ((props: SlideContentProps) => ReactNode);
  /** Optional fixed top-left title rendered by Slide.tsx. Use `//` prefix
   * convention for the dim leader (matches dou-days deck). Omit for hero
   * / section-break slides that own their full composition. */
  title?: ReactNode;
  notes?: string;
  background?: string;
  maxRevealStages?: number;
  initialRevealStage?: number;
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
  current: number;
  total: number;
}

export type NavigationCommand =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; slideNumber: number };
