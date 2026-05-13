import { ReactNode, useEffect } from 'react';
import { exportRegistry } from './exportRegistry';

interface SlideProps {
  children: ReactNode;
  isActive?: boolean;
  notes?: string;
  background?: string;
  /** Threaded so non-async slides can auto-settle via exportRegistry. */
  slideId?: string;
  asyncSettle?: boolean;
}

export function Slide({
  children,
  isActive = true,
  background,
  slideId,
  asyncSettle,
}: SlideProps) {
  // Auto-settle on mount for slides that don't do their own async work.
  // Slides with `asyncSettle: true` opt out and call markSlideSettled themselves.
  useEffect(() => {
    if (!isActive || asyncSettle || !slideId) return;
    exportRegistry.markSlideSettled(slideId);
  }, [isActive, asyncSettle, slideId]);

  if (!isActive) return null;

  return (
    <div
      className="slide"
      style={background ? { background } : undefined}
    >
      {children}
    </div>
  );
}
