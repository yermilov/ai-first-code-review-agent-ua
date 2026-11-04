/** The talk part of the slot, in seconds. Rehearse against this, not the Q&A. */
export const TALK_SECONDS = 60 * 60;

interface TimerProps {
  elapsedSeconds: number;
  /** 0-based step on the talk path (utils/traversal.ts) */
  currentStep: number;
  totalSteps: number;
}

// Pace is measured in steps (reveals), not slides, so a slide with eight
// reveals counts eight times — the same weighting as the progress bar.
function getPaceColor(elapsedSeconds: number, currentStep: number, totalSteps: number): string {
  const remaining = Math.max(0, TALK_SECONDS - elapsedSeconds);

  if (remaining === 0 && currentStep < totalSteps - 1) {
    return 'var(--terminal-red)';
  }

  const expectedStep = (elapsedSeconds / TALK_SECONDS) * (totalSteps - 1);
  const fractionBehind = (expectedStep - currentStep) / totalSteps;

  if (fractionBehind < 0.03) return 'var(--terminal-green)';
  if (fractionBehind < 0.06) return 'var(--terminal-yellow)';
  return 'var(--terminal-red)';
}

export function Timer({ elapsedSeconds, currentStep, totalSteps }: TimerProps) {
  const remaining = Math.max(0, TALK_SECONDS - elapsedSeconds);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const color = getPaceColor(elapsedSeconds, currentStep, totalSteps);

  return (
    <span className="timer-countdown" style={{ color }}>
      {display}
    </span>
  );
}
