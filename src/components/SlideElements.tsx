import React from 'react';

// Inline code with color variants
export function Code({
  children,
  variant = 'cyan',
}: {
  children: string;
  variant?: 'cyan' | 'orange' | 'green';
}) {
  const className =
    variant === 'cyan' ? 'code-inline' : `code-inline code-inline--${variant}`;
  return <code className={className}>{children}</code>;
}

// Section header with color and size variants
export function SectionHeader({
  children,
  color,
  size = 'normal',
}: {
  children: string;
  color: 'green' | 'purple' | 'blue';
  size?: 'normal' | 'compact' | 'dense';
}) {
  const sizeClass = size === 'normal' ? '' : ` section-header--${size}`;
  return (
    <div className={`section-header section-header--${color}${sizeClass}`}>
      {'// '}
      {children}
    </div>
  );
}

// List item with size variants and animation.
//
// A reveal never moves what is already on screen: lay every revealable item
// out from stage 0 and pass `hidden` for the ones not revealed yet. A hidden
// item keeps its slot (visibility: hidden) and drops its animation, so the
// entrance plays at the moment it is revealed, in the place it will stay.
export function SlideItem({
  children,
  size = 'normal',
  delay,
  reveal = false,
  hidden = false,
}: {
  children: React.ReactNode;
  size?: 'normal' | 'compact' | 'dense';
  delay?: number;
  reveal?: boolean;
  hidden?: boolean;
}) {
  const classes = ['slide-item'];
  if (size !== 'normal') classes.push(`slide-item--${size}`);
  if (hidden) classes.push('is-unrevealed');
  else if (delay !== undefined) classes.push(reveal ? 'slide-item--reveal' : 'slide-item--enter');
  const style =
    !hidden && delay ? ({ '--enter-delay': `${delay}s` } as React.CSSProperties) : undefined;

  return (
    <div className={classes.join(' ')} style={style} aria-hidden={hidden || undefined}>
      <span className="slide-item__prefix">&gt;</span>
      <span>{children}</span>
    </div>
  );
}

/** Wrapper for any revealable block that is not a bullet (a card, an image,
 *  a code panel). Same contract as `SlideItem hidden`: it is laid out from
 *  stage 0 and only becomes visible — with the entrance animation — when
 *  `show` turns true. */
export function Reveal({
  show,
  children,
  className,
  as: Tag = 'div',
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'li';
}) {
  const cls = [className, show ? 'reveal-enter' : 'is-unrevealed'].filter(Boolean).join(' ');
  return (
    <Tag className={cls} aria-hidden={show ? undefined : true}>
      {children}
    </Tag>
  );
}

/**
 * Slots for a bullet list revealed one item per stage.
 *
 * `shown` is how many items are revealed. With `size` set, at most `size`
 * items are on screen (a sliding window: once full, the oldest — already
 * spoken — drops off and the survivors move up a slot, by design). Before
 * the window is full, the not-yet-revealed items are returned as hidden
 * slots so every bullet appears where it will stay.
 */
export function revealWindow<T>(
  items: readonly T[],
  shown: number,
  size: number = items.length,
): { item: T; index: number; hidden: boolean }[] {
  const visible = Math.max(0, Math.min(shown, items.length));
  const first = Math.max(0, visible - size);
  return items
    .slice(first, first + size)
    .map((item, k) => ({ item, index: first + k, hidden: first + k >= visible }));
}

/** Weighted bullet: `>>` (high, orange, glowing), `>` (medium, blue),
 *  `--` (low, dim). The marker carries the weight — never the size. Used by
 *  bio, agenda and the build-up slides. */
export type Level = 'high' | 'medium' | 'low';
const LEVEL_PREFIX: Record<Level, string> = { high: '>>', medium: '>', low: '--' };

export function LevelItem({
  level,
  hidden = false,
  aside,
  children,
}: {
  level: Level;
  hidden?: boolean;
  /** optional right-aligned verdict ("yes", "a little") */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const cls = [
    'level-item',
    `level-item--${level}`,
    aside !== undefined && 'level-item--with-aside',
    hidden ? 'is-unrevealed' : 'reveal-enter',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} aria-hidden={hidden || undefined}>
      <span className="level-item__prefix">{LEVEL_PREFIX[level]}</span>
      <span className="level-item__label">{children}</span>
      {aside !== undefined && <span className="level-item__aside">{aside}</span>}
    </div>
  );
}

// Styled quote text
export function Quote({ children }: { children: React.ReactNode }) {
  return <span className="text-quote">'{children}'</span>;
}

// Emphasized text with color variant
export function Emphasis({
  children,
  color = 'green',
}: {
  children: React.ReactNode;
  color?: 'orange' | 'green' | 'cyan' | 'dim';
}) {
  return (
    <span className={`text-emphasis text-emphasis--${color}`}>{children}</span>
  );
}

// External link styled for slides
export function SlideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="slide-link"
    >
      {children}
    </a>
  );
}
