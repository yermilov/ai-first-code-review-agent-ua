import { SlideDefinition } from '../types/slides';
import { T } from '../context/LanguageContext';
import terminalFighter from '../assets/terminal-fighter.png?url';
import ideFighter from '../assets/ide-fighter.png?url';

type Level = 'high' | 'medium' | 'low';

const levelStyles = {
  high: {
    prefix: '>>',
    prefixColor: 'var(--terminal-orange)',
    labelGlow: '0 0 20px color-mix(in srgb, var(--terminal-orange) 30%, transparent)',
    opacity: 1,
  },
  medium: {
    prefix: '> ',
    prefixColor: 'var(--terminal-blue)',
    labelGlow: 'none',
    opacity: 1,
  },
  low: {
    prefix: '--',
    prefixColor: 'var(--terminal-white-dim)',
    labelGlow: 'none',
    opacity: 0.85,
  },
};

function DisclaimerItem({ level, children }: { level: Level; children: React.ReactNode }) {
  const s = levelStyles[level];

  return (
    <div
      className="disclaimer-item"
      style={{
        display: 'grid',
        gridTemplateColumns: '2.5rem 1fr',
        alignItems: 'start',
        gap: 'var(--space-sm)',
        opacity: s.opacity,
      }}
    >
      <span style={{ color: s.prefixColor, fontWeight: 'bold' }}>{s.prefix}</span>
      <span
        style={{
          color: 'var(--terminal-white)',
          textShadow: s.labelGlow,
        }}
      >
        {children}
      </span>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: 'var(--terminal-cyan)',
  textDecoration: 'none',
  borderBottom: '1px dashed var(--terminal-cyan)',
  transition: 'all 0.2s ease',
};

export const DisclaimerSlide: SlideDefinition = {
  id: 'disclaimer',
  content: (
    <div className="vs-battle-slide">
      {/* Left Fighter - Terminal */}
      <div className="vs-fighter vs-fighter--left">
        <img
          src={terminalFighter}
          alt="Terminal CLI Fighter"
          className="vs-fighter-image"
          loading="lazy"
        />
        <div className="vs-fighter-name">Terminal</div>
      </div>

      {/* Center - VS + Disclaimer */}
      <div className="vs-center-content">
        <div className="vs-badge">VS</div>
        <div className="vs-disclaimer-content">
          {/* EN: own translation (every en= in this block) */}
          <DisclaimerItem level="high">
            <T uk="особисто мені найкраще зайшов флоу, коли працюю з" en="personally, the flow that works best for me is" />{' '}
            <em style={{ color: 'var(--terminal-orange)', fontStyle: 'normal', fontWeight: 600 }}>
              <T uk="Claude Code повністю в терміналі" en="Claude Code entirely in the terminal" />
            </em>
          </DisclaimerItem>

          <DisclaimerItem level="medium">
            <T uk="але можу відкрити IDE (зазвичай" en="but I may open an IDE (usually" />{' '}
            <span style={{ color: 'var(--terminal-cyan)' }}>VS Code</span>)
            {' '}<T uk="для невеликих точкових правок, які хочеться зробити руками" en="for small, targeted edits I'd rather make by hand" />
          </DisclaimerItem>

          <DisclaimerItem level="medium">
            <T uk="Термінал швидше відучує від старої ментальної моделі" en="the terminal unteaches the old mental model faster —" />{' '}
            <em style={{ color: 'var(--terminal-white-dim)', fontStyle: 'normal' }}><T uk="«я редагую текст»" en="“I edit text”" /></em>
            {' '}<T uk="і вчить нової:" en="— and teaches the new one:" />{' '}
            <em style={{ color: 'var(--terminal-green)', fontStyle: 'normal', fontWeight: 600 }}><T uk="«я ставлю задачі агенту»" en="“I give an agent tasks”" /></em>
          </DisclaimerItem>

          <DisclaimerItem level="low">
            <T uk="якщо в терміналі некомфортно — є плагіни:" en="not comfortable in the terminal? there are plugins:" />{' '}
            <a
              href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              VS Code
            </a>
            {' '}<T uk="або" en="or" />{' '}
            <a
              href="https://plugins.jetbrains.com/plugin/27310-claude-code-beta-"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              JetBrains IDE
            </a>
          </DisclaimerItem>
        </div>
      </div>

      {/* Right Fighter - IDE */}
      <div className="vs-fighter vs-fighter--right">
        <img
          src={ideFighter}
          alt="IDE Code Editor Fighter"
          className="vs-fighter-image"
          loading="lazy"
        />
        <div className="vs-fighter-name">IDE</div>
      </div>

    </div>
  ),
  notes: 'Особистий дисклеймер про термінал vs IDE — у стилі Mortal Kombat',
};
